import laspy
import numpy as np
import os
from typing import Tuple, List, Optional
from parseGpx import parse_gpx, GPXData
from scipy.spatial import KDTree
from pyproj import Transformer, CRS


def get_real_path(path: str) -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), path))


def load_lidar_points(laz_rel_path: str):
    """Load a LAZ file given a path relative to this script.

    Returns the stacked points array and number of points.
    Raises a helpful FileNotFoundError if the file is missing.
    """
    laz_path = get_real_path(laz_rel_path)

    # Helpful check and message if file missing
    if not os.path.exists(laz_path):
        lidar_dir = get_real_path("../data/lidar")
        available = []
        if os.path.isdir(lidar_dir):
            available = [f for f in os.listdir(lidar_dir) if os.path.isfile(os.path.join(lidar_dir, f))]
        raise FileNotFoundError(
            f"LiDAR file not found: {laz_path}\n"
            f"Looked in: {laz_path}\n"
            f"Available files in {lidar_dir}: {available}"
        )
    las = laspy.read(laz_path)

    # Build KDTree for quick nearest-neighbour queries (on X,Y)
    points_2d = np.column_stack((las.x, las.y))
    kdtree = KDTree(points_2d)

    # Attach kdtree to las object for convenience
    # Note: laspy LasData is not typed for this attribute; we add it dynamically
    las.kdtree = kdtree

    return las

def link_points_to_route(las: laspy.LasData, gpx_data: GPXData, max_distance: float = 50.0, default_epsg: int = 28356) -> List[Optional[float]]:
    """Given LiDAR points and GPX data, find nearest LiDAR elevation for each GPX point.

    Returns a list of elevations (or None if no nearby point found).
    max_distance is in the same units as las.x/las.y (meters for projected CRS).
    Notes:
      - This function assumes the GPX lat/lon ordering matches the LAS X/Y ordering.
        If the LAS file is in a projected CRS (meters) you must reproject GPX points first.
    """
    elevations: List[Optional[float]] = []

    # Use existing KDTree if attached, otherwise build one
    if hasattr(las, "kdtree") and isinstance(getattr(las, "kdtree"), KDTree):
        kdtree = las.kdtree
    else:
        points_2d = np.column_stack((las.x, las.y))
        kdtree = KDTree(points_2d)

    # LAS bounding box for heuristic checks
    las_x_min, las_x_max = float(np.min(las.x)), float(np.max(las.x))
    las_y_min, las_y_max = float(np.min(las.y)), float(np.max(las.y))

    def _within_las_bounds(xs, ys, margin=0.1, required_fraction=0.6):
        """Return True if at least required_fraction of transformed points fall within LAS bbox.

        This is looser than requiring every point to lie inside the bbox; it helps when GPX
        covers a slightly larger area than the LiDAR tile or when endpoints lie just outside.
        """
        xs = np.asarray(xs)
        ys = np.asarray(ys)
        if xs.size == 0:
            return False
        x_margin = (las_x_max - las_x_min) * margin
        y_margin = (las_y_max - las_y_min) * margin
        inside_x = (xs >= (las_x_min - x_margin)) & (xs <= (las_x_max + x_margin))
        inside_y = (ys >= (las_y_min - y_margin)) & (ys <= (las_y_max + y_margin))
        inside = inside_x & inside_y
        frac = float(np.sum(inside)) / inside.size
        return frac >= required_fraction

    def _try_project_candidates(latitudes, longitudes):
        """Try a small set of projections and return transformed (x,y) that fit LAS bounds.

        Order:
          1) user-provided default_epsg (MGA56 by default)
          2) LAS header SRS (if available)
          3) inferred UTM zone from mean longitude

        Returns (xs, ys) or (None, None) if none succeeded.
        """
        # If pyproj isn't available for any reason, bail out
        if Transformer is None:
            return None, None

        # Candidate A: default/project EPSG (closure variable default_epsg)
        try:
            transformer = Transformer.from_crs(CRS.from_epsg(4326), CRS.from_epsg(default_epsg), always_xy=True)
            xs, ys = transformer.transform(longitudes, latitudes)
            if _within_las_bounds(xs, ys):
                return xs, ys
        except Exception:
            pass

        # Candidate B: LAS header SRS
        try:
            srs = getattr(las.header, "srs", None)
            if srs is not None:
                try:
                    target_crs = CRS.from_wkt(srs.wkt) if hasattr(srs, 'wkt') else CRS.from_user_input(srs)
                except Exception:
                    target_crs = None
                if target_crs is not None:
                    try:
                        transformer = Transformer.from_crs(CRS.from_epsg(4326), target_crs, always_xy=True)
                        xs, ys = transformer.transform(longitudes, latitudes)
                        if _within_las_bounds(xs, ys):
                            print("candidate b")
                            return xs, ys
                    except Exception:
                        pass
        except Exception:
            pass

        return None, None

    # First attempt: assume GPX lat/lon are already in the LAS coordinate space (X=lon, Y=lat)
    query_points = np.column_stack((gpx_data.longitudes, gpx_data.latitudes))
    dists, idxs = kdtree.query(query_points)

    # If none of the matches are within max_distance, attempt to project GPX points into LAS CRS
    if not any(d <= max_distance for d in dists):
        # Try to find a projection that maps GPX into LAS bounding box
        xs, ys = _try_project_candidates(gpx_data.latitudes, gpx_data.longitudes)
        if xs is None:
            # Can't project automatically; warn user
            raise RuntimeError(
                "No LiDAR matches found. The LAS file appears to use projected coordinates (meters) "
                "while GPX points are in lat/lon degrees. Install 'pyproj' and/or provide a transformer "
                "or ensure the LAS header contains CRS information so GPX points can be reprojected.")

        # Re-query using transformed coordinates
        query_points = np.column_stack((xs, ys))
        dists, idxs = kdtree.query(query_points)

    # Build elevations list from distances and indices
    for dist, idx in zip(dists, idxs):
        if dist is None or dist > max_distance:
            elevations.append(None)
            continue
        try:
            z_val = float(las.z[int(idx)])
        except Exception:
            elevations.append(None)
            continue
        elevations.append(z_val)

    # Normalize elevations to start at 0
    min_elevation = min(e for e in elevations if e is not None)
    elevations = [e - min_elevation if e is not None else None for e in elevations]

    return elevations


if __name__ == "__main__":
	# change this relative path to the LAZ file you expect to use
    rel_path = "data/lidar/honeyeater.laz"
    las = load_lidar_points(get_real_path(rel_path))

    gpx_path = "data/gpx/honeyeater.gpx"
    with open(get_real_path(gpx_path), "r") as gpx_file:
        gpx_data = parse_gpx(gpx_file)

    first_e = gpx_data.elevations[0] if gpx_data.elevations else None
    last_e = gpx_data.elevations[-1] if gpx_data.elevations else None
    print(f"GPX elevations: start {first_e}, end {last_e}")

    elevations = link_points_to_route(las, gpx_data)
    print(f"num elevations: {len(elevations)} num points: {len(gpx_data.latitudes)}")

    # determine the height gain where values exist
    valid = [e for e in elevations if e is not None]
    if valid:
        print(f"Sample elevations: {valid[:5]}")
        print(f"Height range: {min(valid):.2f} to {max(valid):.2f} m")
    else:
        print("No matching LiDAR elevations found for GPX points. Check CRS and coverage.")

    # plotting for visual verification
    import matplotlib.pyplot as plt
    from matplotlib.ticker import MultipleLocator
    num_points = len(gpx_data.latitudes)

    # Plotting the elevation profile against distance
    fig, ax = plt.subplots(figsize=(10, 4))
    ax.plot(gpx_data.convert_distance_to_km, elevations, marker='.', color='green')
    ax.set_title('Elevation Profile with LiDAR Data')
    ax.set_xlabel('Distance (km)')
    ax.set_ylabel('Elevation (m)')
    ax.grid(True)
    # Set major ticks on the distance axis every 1 km (change to desired interval)
    ax.xaxis.set_major_locator(MultipleLocator(1))
    fig.tight_layout()
    plt.show()
    print("Done")
    