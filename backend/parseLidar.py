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
    laz_path = get_real_path(laz_rel_path)

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