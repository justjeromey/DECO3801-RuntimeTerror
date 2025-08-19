import os
import json

from dataclasses import dataclass
from typing import List, Optional

import gpxpy
from gpxpy.geo import haversine_distance


@dataclass
class GPXData:
    """Structured GPX parse result.

    Attributes
    -----------
    latitudes: List of latitudes for each point.
    longitudes: List of longitudes for each point.
    elevations: List of elevations (meters). 
    cumulative_distances_m: Cumulative distances between points in meters.

    Convenience
    -----------
    total_distance_m: Total length of the path in meters.
    total_distance_km: Total length of the path in kilometers.
    """

    latitudes: List[float]
    longitudes: List[float]
    elevations: List[Optional[float]]
    cumulative_distances_m: List[float]

    @property
    def total_distance_m(self) -> float:
        return self.cumulative_distances_m[-1] if self.cumulative_distances_m else 0.0

    @property
    def total_distance_km(self) -> float:
        return self.cumulative_distances_km[-1] if self.cumulative_distances_km else 0.0

    @property
    def convert_distance_to_km(self):
        return [d / 1000 for d in self.cumulative_distances_m]


def get_trail_file_path(trail_name: str) -> str:
    gpx_rel_path = f"../data/trails/{trail_name}.gpx"
    return os.path.abspath(os.path.join(os.path.dirname(__file__), gpx_rel_path))


def parse_gpx(gpx_path: str) -> GPXData:
    latitudes: List[float] = []
    longitudes: List[float] = []
    elevations: List[Optional[float]] = []

    with open(gpx_path, 'r') as gpx_file:
        gpx = gpxpy.parse(gpx_file)

    def add_points(points):
        #check elevation points exist
        first_point = points[0]
        if first_point.elevation is None:
            raise ValueError("Elevation data is missing for the first point.")

        for point in points:
            latitudes.append(point.latitude)
            longitudes.append(point.longitude)
            elevations.append(point.elevation)

    for track in gpx.tracks:
        for segment in track.segments:
            add_points(segment.points)

    # If no track points, get points from routes
    if not latitudes and not longitudes:
        for route in gpx.routes:
            add_points(route.points)

    if len(latitudes) == 0 or len(longitudes) == 0:
        raise ValueError("No valid GPS points found.")

    print(f"Trail latitude points: {len(latitudes)}")
    print(f"Total longitude points: {len(longitudes)}")
    print(f"Total elevation points: {len(elevations)}")

    #calcuate distance
    cum_dist_m = [0.0]
    total = 0.0
    for i in range(1, len(latitudes)):
        d = haversine_distance(latitudes[i-1], longitudes[i-1], latitudes[i], longitudes[i]) or 0.0
        total += d
        cum_dist_m.append(total)

    print(f"Total trail length: {total:.2f} meters")

    #standardize the elevation to 0
    min_elevation = min(elevations) if elevations else 0
    elevations = [e - min_elevation for e in elevations]

    return GPXData(
        latitudes=latitudes,
        longitudes=longitudes,
        elevations=elevations,
        cumulative_distances_m=cum_dist_m,
    )

def convert_gpx_data_to_json(data: GPXData):
    return {
        "latitudes": data.latitudes,
        "longitudes": data.longitudes,
        "elevations": data.elevations,
        "cumulative_distances_m": data.cumulative_distances_m,
        "cumulative_distances_km": data.convert_distance_to_km,
        "total_distance_m": data.total_distance_m,
        "total_distance_km": data.total_distance_m / 1000,
    }

def save_json(data: GPXData, file_path: str):
    json_data = convert_gpx_data_to_json(data)
    with open(file_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)