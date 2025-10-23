import numpy as np
import laspy
from typing import List, Optional
from parseGpx import parse_gpx, GPXData
from scipy.spatial import KDTree
from scipy.ndimage import uniform_filter1d
from pyproj import Transformer
from lidar_util import get_real_path, fit_lidar_to_route


def link_points_to_route(
    las, gpx_data: GPXData, distance_thresh: float
) -> List[Optional[float]]:
    """
    Link each GPX point to the nearest LIDAR point and return a list of elevations.
    If no LIDAR points are available, return a list of None.
    """
    if len(las.points) == 0:
        print("No LIDAR points available after filtering.")
        return [None] * len(gpx_data.latitudes)

    # Transform GPX WGS84 coordinates to LAS CRS
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:28356", always_xy=True)

    # create a KDTree for fast nearest-neighbor lookup
    lidar_coords = np.vstack((las.x, las.y)).T
    tree = KDTree(lidar_coords)
    elevations: List[Optional[float]] = []
    for lat, lon in zip(gpx_data.latitudes, gpx_data.longitudes):
        x, y = transformer.transform(lon, lat)
        distance, index = tree.query((x, y))
        if distance < distance_thresh:  # threshold distance in meters
            elevations.append(float(las.z[int(index)]))
        else:
            elevations.append(None)  # no nearby LIDAR point

    # Normalize elevations to start at 0
    min_elevation = min(e for e in elevations if e is not None)
    elevations = [e - min_elevation if e is not None else None for e in elevations]

    return elevations


def fuse_elevation_models(
    lidar_elevations: List[float | None],
    gpx_elevations: List[float | None],
    max_gap: float = 3.0,
    weight_lidar: float = 0.7,
    smoothing_window: int = 5,
) -> None | List[float]:
    """
    Prune LIDAR elevations that are likely to be from trees.
    If a gap larger than max_gap is detected between consecutive known elevations,
    the elevations in that gap are set to None.
    """

    if len(lidar_elevations) != len(gpx_elevations):
        raise ValueError("Arrays must be the same length.")

    fused = []
    for lidar, gpx in zip(lidar_elevations, gpx_elevations):
        # Skip None values
        if lidar is None or gpx is None:
            fused.append(gpx if gpx is not None else lidar)
            continue

        # Prune spikes above GPX
        if lidar - gpx > max_gap:
            lidar = gpx

        # Weighted fusion
        fused_val = weight_lidar * lidar + (1 - weight_lidar) * gpx
        fused.append(fused_val)

    # Smooth the array using a simple moving average
    fused_array = np.array(fused, dtype=float)
    smoothed = uniform_filter1d(fused_array, size=smoothing_window, mode="nearest")

    return smoothed.tolist()


def fill_missing_values(elevations: List[Optional[float]]) -> List[float | None]:
    n = len(elevations)
    result = elevations.copy()

    # Forward pass: fill with last known value
    last_val = None
    for i in range(n):
        if result[i] is not None:
            last_val = result[i]
        else:
            result[i] = last_val

    # Backward pass: fill remaining None with next known value
    next_val = None
    for i in range(n - 1, -1, -1):
        if result[i] is not None:
            next_val = result[i]
        elif next_val is not None:
            # Linear interpolation
            # Find the start of the missing segment
            j = i
            while j >= 0 and elevations[j] is None:
                j -= 1
            start_val = result[j] if j >= 0 else next_val
            end_val = next_val
            segment_len = i - j
            for k in range(j + 1, i + 1):
                ratio = (k - j) / segment_len
                if (start_val is not None) and (end_val is not None):
                    result[k] = start_val + (end_val - start_val) * ratio
                else:
                    result[k] = start_val if start_val is not None else end_val

    return result


def parse_lidar(
    laz_file, gpx_file, distance_thresh: float = 1.5, max_tree_gap: float = 1.5
) -> GPXData:
    gpx_data = parse_gpx(gpx_file)

    las = laspy.read(laz_file)
    fit_lidar_to_route(las, gpx_data, margin=0.001, las_crs_epsg=28356)

    lidar_elevations = link_points_to_route(
        las, gpx_data, distance_thresh=distance_thresh
    )

    fusion = fuse_elevation_models(
        lidar_elevations, gpx_data.elevations, max_gap=max_tree_gap
    )
    if fusion is not None:
        gpx_data.elevations = [float(e) for e in fusion]

    return gpx_data


if __name__ == "__main__":
    laz_path = "data/lidar/honeyeater_mini.laz"
    laz_path = get_real_path(laz_path)

    with open(get_real_path("data/gpx/honeyeater.gpx"), "r") as gpx_file:
        result = parse_lidar(laz_path, gpx_file, max_tree_gap=1.5)

    # save to file
    # from lidar_util import save_gpx_data_to_laz
    # save_gpx_data_to_laz(result, "data/lidar/honeyeater_mini.laz")

    # plot the elevations against distance
    import matplotlib.pyplot as plt

    fixed_eles = [e if e is not None else 0 for e in result.elevations]
    plt.plot(result.cumulative_distances_m, fixed_eles)
    plt.xlabel("Distance (m)")
    plt.ylabel("Elevation (m)")
    plt.title("Elevation Profile")
    plt.show()
