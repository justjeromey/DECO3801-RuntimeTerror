import os
import numpy as np
from typing import Tuple
import laspy
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

def join_laz_files(p1: str, p2: str, output_name = "combined.laz"):
    p1 = get_real_path(p1)
    p2 = get_real_path(p2)
    
    input_files = [p1,p2]
    output_file = get_real_path(f"data/lidar/{output_name}")

    # Open the first file to copy the header
    with laspy.open(input_files[0]) as f:
        header = f.header

    # Create the output file
    with laspy.open(output_file, mode="w", header=header) as writer:
        for infile in input_files:
            with laspy.open(infile) as reader:
                for points in reader.chunk_iterator(1_000_000):  # read 1M points at a time
                    writer.write_points(points)

def save_gpx_data_to_laz(gpx_data, output_path: str):
    output_path = get_real_path(output_path)

    # Transformer: WGS84 (EPSG:4326) → GDA94 / MGA Zone 56 (EPSG:28356)
    transformer = Transformer.from_crs("EPSG:4326", "EPSG:28356", always_xy=True)

    # Transform lon/lat → easting/northing
    eastings, northings = transformer.transform(
        gpx_data.longitudes,
        gpx_data.latitudes
    )

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