import numpy as np
from typing import List, Optional
from parseGpx import parse_gpx, GPXData
from scipy.spatial import KDTree
from pyproj import Transformer
from lidar_util import get_real_path, load_lidar_points, get_route_bounds

def fit_lidar_to_route(las, gpx_data: GPXData, margin: float = 0.001, las_crs_epsg: int = 28356):
    """
    Filter the LAS points to only those within the bounding box of the GPX route plus a margin.
    """
    min_lat, max_lat, min_lon, max_lon = get_route_bounds(gpx_data)
    min_lat -= margin
    max_lat += margin
    min_lon -= margin
    max_lon += margin

    # Transform GPX WGS84 coordinates to LAS CRS
    transformer = Transformer.from_crs("EPSG:4326", f"EPSG:{las_crs_epsg}", always_xy=True)

    # Transform the bounding box corners
    (min_x, min_y) = transformer.transform(min_lon, min_lat)
    (max_x, max_y) = transformer.transform(max_lon, max_lat)

    # Create a mask for points within the bounding box
    mask = (las.x >= min_x) & (las.x <= max_x) & (las.y >= min_y) & (las.y <= max_y)

    # Apply the mask to filter points
    las.points = las.points[mask]

def link_points_to_route(las, gpx_data: GPXData, distance_thresh: float) -> List[Optional[float]]:
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
    
    
def prune_trees(elevations: List[Optional[float]], max_gap: int = 5) -> List[Optional[float]]:
    """Prune spikes in elevation data likely caused by trees."""
    if not elevations:
        return []

    pruned = list(elevations)
    n = len(pruned)
    i = 0
    while i < n - 1:
        if pruned[i] is None:
            i += 1
            continue

        j = i + 1
        while j < n and pruned[j] is None:
            j += 1

        if j == n:
            break

        current_val = pruned[i]
        next_val = pruned[j]

        # Detect a spike: a sharp increase in elevation
        if next_val - current_val > max_gap:
            end_of_spike = j + 1
            while end_of_spike < n and (pruned[end_of_spike] is None or pruned[end_of_spike] - current_val > max_gap):
                end_of_spike += 1

            if end_of_spike < n:
                # Interpolate all points within the spike
                end_val = pruned[end_of_spike]
                num_points = end_of_spike - i
                for k in range(i + 1, end_of_spike):
                    pruned[k] = current_val + (end_val - current_val) * (k - i) / num_points
                i = end_of_spike
            else:
                i = j
        else:
            i = j
    return pruned

if __name__ == "__main__":
    laz_path = "data/lidar/combined.laz"

    gpx_path = "data/gpx/honeyeater.gpx"
    with open(get_real_path(gpx_path), "r") as gpx_file:
        gpx_data = parse_gpx(gpx_file)

    las = load_lidar_points(laz_path)
    print(f"Total LIDAR points before filtering: {len(las.points)}")
    fit_lidar_to_route(las, gpx_data, margin=0.001, las_crs_epsg=28356)
    print(f"Total LIDAR points after filtering: {len(las.points)}")

    elevations = link_points_to_route(las, gpx_data, distance_thresh=1.5)

    # get number of points that aren't None
    last_point = None
    for i in range(len(elevations) - 1, -1, -1):
        if elevations[i] is not None:
            print(i)
            last_point = elevations[i]
            break

    print(f"Elevation point 1: {elevations[0]}, final: {last_point}")