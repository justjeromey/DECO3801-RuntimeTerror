import numpy as np
import laspy
from typing import List, Optional
from parseGpx import parse_gpx, GPXData
from scipy.spatial import KDTree
from pyproj import Transformer
from lidar_util import get_real_path, fit_lidar_to_route


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


def prune_trees(elevations: List[Optional[float]], max_gap: int = 5, gap_increase: float = 0.3) -> List[Optional[float]]:
    """
    Prune spikes in elevation data likely caused by trees and interpolate missing values.
    Also handles the case where trees might be at the end of the route.
    """
    if not elevations:
        return []

    pruned = list(elevations)
    n = len(pruned)
    
    # First pass: detect and handle tree spikes (including at the end)
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
            gap = max_gap
            while end_of_spike < n and (pruned[end_of_spike] is None or pruned[end_of_spike] - current_val > gap):
                gap += gap_increase
                end_of_spike += 1

            if end_of_spike < n:
                # Normal spike with an endpoint - interpolate
                end_val = pruned[end_of_spike]
                num_points = end_of_spike - i
                for k in range(i + 1, end_of_spike):
                    pruned[k] = current_val + (end_val - current_val) * (k - i) / num_points
                i = end_of_spike
            else:
                # Spike extends to the end - likely trees at the end
                # Interpolate backwards from the last known good point
                for k in range(j, n):
                    pruned[k] = current_val
                break
        else:
            i = j

    return pruned

def fill_missing_values(elevations: List[Optional[float]]) -> List[Optional[float]]:
    for i in range(len(elevations)):
        if elevations[i] is None:
            # Find the nearest non-None values before and after
            before_val = None
            before_idx = i - 1
            while before_idx >= 0 and elevations[before_idx] is None:
                before_idx -= 1
            if before_idx >= 0:
                before_val = elevations[before_idx]

            after_val = None
            after_idx = i + 1
            while after_idx < len(elevations) and elevations[after_idx] is None:
                after_idx += 1
            if after_idx < len(elevations):
                after_val = elevations[after_idx]

            # Interpolate based on available values
            if before_val is not None and after_val is not None:
                # Linear interpolation between before and after
                distance_ratio = (i - before_idx) / (after_idx - before_idx)
                elevations[i] = before_val + (after_val - before_val) * distance_ratio
            elif before_val is not None:
                # Use the last known value (forward fill)
                elevations[i] = before_val
            elif after_val is not None:
                # Use the next known value (backward fill)
                elevations[i] = after_val
            # If both are None, leave as None (shouldn't happen in normal cases)

    return elevations

def parse_lidar(laz_file, gpx_file, distance_thresh: float = 1.5, max_tree_gap: float = 1.5) -> GPXData:
    gpx_data = parse_gpx(gpx_file)

    las = laspy.read(laz_file)
    fit_lidar_to_route(las, gpx_data, margin=0.001, las_crs_epsg=28356)

    elevations = link_points_to_route(las, gpx_data, distance_thresh=distance_thresh)
    elevations = prune_trees(elevations, max_gap=max_tree_gap)

    elevations = fill_missing_values(elevations)

    # replace gpx_data.elevations with elevations
    gpx_data.elevations = elevations
    return gpx_data

if __name__ == "__main__":
    laz_path = "data/lidar/honeyeater_mini.laz"
    laz_path = get_real_path(laz_path)

    with open(get_real_path("data/gpx/honeyeater.gpx"), "r") as gpx_file:
        result = parse_lidar(laz_path, gpx_file, max_tree_gap=1.5)

    # save to file
    from lidar_util import save_gpx_data_to_laz
    # save_gpx_data_to_laz(result, "data/lidar/honeyeater_mini.laz")

    # plot the elevations against distance
    import matplotlib.pyplot as plt
    plt.plot(result.cumulative_distances_m, result.elevations)
    plt.xlabel("Distance (m)")
    plt.ylabel("Elevation (m)")
    plt.title("Elevation Profile")
    plt.show()
