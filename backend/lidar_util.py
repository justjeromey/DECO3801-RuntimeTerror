import os
import numpy as np
from typing import Tuple, List, Optional
import laspy
from scipy.spatial import KDTree
from pyproj import Transformer
from parseGpx import GPXData, parse_gpx


def load_lidar_points(laz_rel_path: str):
    laz_path = get_real_path(laz_rel_path)

    if not os.path.exists(laz_path):
        raise FileNotFoundError(
            f"LiDAR file not found at the specified path: {laz_path}"
        )

    return laspy.read(laz_path)


def get_route_bounds(gpx_data: GPXData) -> Tuple[float, float, float, float]:
    """Return (min_lat, max_lat, min_lon, max_lon) for the GPX route."""
    if not gpx_data.latitudes or not gpx_data.longitudes:
        raise ValueError("GPX data has no latitude/longitude points.")
    min_lat = min(gpx_data.latitudes)
    max_lat = max(gpx_data.latitudes)
    min_lon = min(gpx_data.longitudes)
    max_lon = max(gpx_data.longitudes)
    return (min_lat, max_lat, min_lon, max_lon)


def get_real_path(path: str) -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), path))


def join_laz_files(p1: str, p2: str, output_name="combined.laz"):
    p1 = get_real_path(p1)
    p2 = get_real_path(p2)

    input_files = [p1, p2]
    output_file = get_real_path(f"data/lidar/{output_name}")

    # Open the first file to copy the header
    with laspy.open(input_files[0]) as f:
        header = f.header

    # Create the output file
    with laspy.open(output_file, mode="w", header=header) as writer:
        for infile in input_files:
            with laspy.open(infile) as reader:
                for points in reader.chunk_iterator(
                    1_000_000
                ):  # read 1M points at a time
                    writer.write_points(points)


def save_gpx_data_to_laz(gpx_data, output_path: str):
    output_path = get_real_path(output_path)

    # Transformer: WGS84 (EPSG:4326) → GDA94 / MGA Zone 56 (EPSG:28356)
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:28356", always_xy=True)

    # Transform lon/lat → easting/northing
    eastings, northings = transformer.transform(gpx_data.longitudes, gpx_data.latitudes)

    elevations = np.array([e if e is not None else -9999 for e in gpx_data.elevations])

    # Setup LAS header (XYZ only, version 1.2)
    header = laspy.LasHeader(point_format=0, version="1.2")

    # Set scaling/offsets for storage precision
    header.scales = [0.01, 0.01, 0.01]  # centimeter precision
    header.offsets = [np.min(eastings), np.min(northings), np.min(elevations)]

    # Create LAS object
    las = laspy.LasData(header)
    las.x = eastings
    las.y = northings
    las.z = elevations

    # Add CRS metadata (so GIS knows it’s EPSG:28356)
    header.parse_crs("EPSG:28356")

    # Write file
    las.write(output_path)


def fit_lidar_to_route(
    las, gpx_data: GPXData, margin: float = 0.001, las_crs_epsg: int = 28356
):
    """
    Filter the LAS points to only those within the bounding box of the GPX route plus a margin.
    """
    min_lat, max_lat, min_lon, max_lon = get_route_bounds(gpx_data)
    min_lat -= margin
    max_lat += margin
    min_lon -= margin
    max_lon += margin

    # Transform GPX WGS84 coordinates to LAS CRS
    transformer = Transformer.from_crs(
        "EPSG:4326", f"EPSG:{las_crs_epsg}", always_xy=True
    )

    # Transform the bounding box corners
    (min_x, min_y) = transformer.transform(min_lon, min_lat)
    (max_x, max_y) = transformer.transform(max_lon, max_lat)

    # Create a mask for points within the bounding box
    mask = (las.x >= min_x) & (las.x <= max_x) & (las.y >= min_y) & (las.y <= max_y)

    # Apply the mask to filter points
    las.points = las.points[mask]


def create_mini_lidar_file(
    input_laz_path: str, output_laz_path: str, gpx_data: GPXData, distance: float = 5.0
):
    # read the full LIDAR file
    las = load_lidar_points(input_laz_path)

    # fit LIDAR points to route
    fit_lidar_to_route(las, gpx_data, margin=0.001, las_crs_epsg=28356)

    # transformer for coordinate conversion
    transformer_to_projected = Transformer.from_crs(
        "EPSG:4326", "EPSG:28356", always_xy=True
    )

    # convert GPX points to projected coordinates (EPSG:28356)
    gpx_eastings, gpx_northings = transformer_to_projected.transform(
        gpx_data.longitudes, gpx_data.latitudes
    )
    gpx_coords = np.vstack((gpx_eastings, gpx_northings)).T

    # create a KDTree for fast nearest-neighbor lookup of GPX points
    gpx_tree = KDTree(gpx_coords)

    # vectorized query: query all LiDAR points at once (MUCH faster!)
    lidar_coords = np.vstack((las.x, las.y)).T
    distances, _ = gpx_tree.query(lidar_coords)

    # create boolean mask for points within the distance threshold
    print(f"Total LIDAR points before filtering: {len(las.x)}")
    mask = distances <= distance
    print(f"Number of points within {distance}m of route: {np.sum(mask)}")

    # apply mask to filter points (vectorized operation)
    filtered_x = las.x[mask]
    filtered_y = las.y[mask]
    filtered_z = las.z[mask]

    # create new LAS file with filtered points
    output_path = get_real_path(output_laz_path)

    # setup LAS header
    header = laspy.LasHeader(point_format=0, version="1.2")
    header.scales = [0.01, 0.01, 0.01]  # centimeter precision
    header.offsets = [np.min(filtered_x), np.min(filtered_y), np.min(filtered_z)]

    # create LAS object
    filtered_las = laspy.LasData(header)
    filtered_las.x = filtered_x
    filtered_las.y = filtered_y
    filtered_las.z = filtered_z

    # add CRS metadata
    header.parse_crs("EPSG:28356")

    # write the filtered LAS file
    filtered_las.write(output_path)

    print(f"Filtered {len(filtered_x)} points from {len(las.x)} total points")
    print(f"Saved to {output_path}")

    # Max elevation and Min elevation for debugging
    max_elevation = np.max(filtered_z)
    min_elevation = np.min(filtered_z)
    print(f"Max elevation in filtered LIDAR: {max_elevation}")
    print(f"Min elevation in filtered LIDAR: {min_elevation}")
    print(f"Elevation range in filtered LIDAR: {max_elevation - min_elevation}")


if __name__ == "__main__":
    laz_path = "data/lidar/combined.laz"

    gpx_path = "data/gpx/honeyeater.gpx"
    with open(get_real_path(gpx_path), "r") as gpx_file:
        result = parse_gpx(gpx_file)

    create_mini_lidar_file(laz_path, "data/lidar/mini.laz", result, distance=5.0)

