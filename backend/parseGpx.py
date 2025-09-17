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
    altitudeChange: Optional[float] = None
    altitudeMin: Optional[float] = None
    altitudeMax: Optional[float] = None
    altitudeStart: Optional[float] = None
    altitudeEnd: Optional[float] = None
    distanceUp: Optional[float] = None
    distanceDown: Optional[float] = None
    distanceFlat: Optional[float] = None
    turning_x: Optional[List[float]] = None
    turning_y: Optional[List[float]] = None

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
    gpx_rel_path = f"../backend/data/gpx/{trail_name}.gpx"
    return os.path.abspath(os.path.join(os.path.dirname(__file__), gpx_rel_path))

def calculateTurningPoints(distances: List[float], elevations: List[float]):
    # Find turning points 
    first = 0
    second = 0
    grad = "neutral"
    index_list = []
    i = 0

    for y in elevations: 
        second = first
        first = y
        diff = first - second 
        # Uphill
        if diff > 0 :
            if grad != "pos":
                index_list.append(i)
            grad = "pos"
        # Downhill
        elif diff < 0:
            if grad != "neg":
                index_list.append(i) 
            grad = "neg"
        i += 1

        # Collect x and y of turning points
    turning_x = []
    turning_y = []
    for index in index_list:
        # Converting m to km
        if index > 0:
            turning_x.append(distances[index-1] / 1000)
            turning_y.append(elevations[index-1])
    return (turning_x, turning_y)


def calculateTrailStats(distances: List[float], elevations: List[float]) -> dict:

    altitudeMin = min(elevations)
    altitudeMax = max(elevations)
    altitudeStart = elevations[0]
    altitudeEnd = elevations[-1]
    altitudeChange = altitudeEnd - altitudeStart

    distanceUp = 0.0
    distanceDown = 0.0
    distanceFlat = 0.0

    grades = []

    for i in range(len(elevations) - 1):
        dy = elevations[i+1] - elevations[i]
        dx = distances[i+1] - distances[i]

        if dx <= 0:
            continue 

        grade = (dy / dx) * 100 
        grades.append(grade)

        if dy > 0:
            distanceUp += dx
        elif dy < 0:
            distanceDown += dx
        else:
            distanceFlat += dx

    avgGrade = (altitudeChange / (distances[-1] if distances[-1] > 0 else 1)) * 100

    return {
        "altitudeChange" : altitudeChange,
        "altitudeMin" : altitudeMin,
        "altitudeMax" : altitudeMax,
        "altitudeStart" : altitudeStart,
        "altitudeEnd" : altitudeEnd,
        "distanceUp" : distanceUp,
        "distanceDown" : distanceDown,
        "distanceFlat" : distanceFlat,
        "grade" : avgGrade
    }

def parse_gpx(gpx_file) -> GPXData:
    latitudes: List[float] = []
    longitudes: List[float] = []
    elevations: List[Optional[float]] = []

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

    gpx_data = GPXData(
        latitudes=latitudes,
        longitudes=longitudes,
        elevations=elevations,
        cumulative_distances_m=cum_dist_m,
    )

    stats = calculateTrailStats(gpx_data.cumulative_distances_m, gpx_data.elevations)
    turning_x, turning_y = calculateTurningPoints(gpx_data.cumulative_distances_m, gpx_data.elevations)
    gpx_data.altitudeChange = stats["altitudeChange"]
    gpx_data.altitudeMin = stats["altitudeMin"]
    gpx_data.altitudeMax = stats["altitudeMax"]
    gpx_data.altitudeStart = stats["altitudeStart"]
    gpx_data.altitudeEnd = stats["altitudeEnd"]
    gpx_data.distanceUp = stats["distanceUp"]
    gpx_data.distanceDown = stats["distanceDown"]
    gpx_data.distanceFlat = stats["distanceFlat"]
    gpx_data.grade = stats["grade"]
    gpx_data.turning_x = turning_x
    gpx_data.turning_y = turning_y


    return gpx_data


def convert_gpx_data_to_json(data: GPXData):
    return {
        "latitudes": data.latitudes,
        "longitudes": data.longitudes,
        "elevations": data.elevations,
        "cumulative_distances_m": data.cumulative_distances_m,
        "cumulative_distances_km": data.convert_distance_to_km,
        "total_distance_m": data.total_distance_m,
        "total_distance_km": data.total_distance_m / 1000,

        # ADDITIONAL STATS FOR DIFFICULTY RATING AND ANALYSIS 

        "altitudeChange": data.altitudeChange,
        "altitudeMin": data.altitudeMin,
        "altitudeMax": data.altitudeMax,
        "altitudeStart": data.altitudeStart,
        "altitudeEnd": data.altitudeEnd,
        "distanceUp": data.distanceUp,
        "distanceDown": data.distanceDown,
        "distanceFlat": data.distanceFlat,
        "grade": data.grade
    }

def save_json(data: GPXData, file_path: str):
    json_data = convert_gpx_data_to_json(data)
    with open(file_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

# testing code
# gpx_path = get_trail_file_path("fells_loop")

# with open(gpx_path, 'r') as gpx_file:
#     gpx_result: GPXData = parse_gpx(gpx_file)
#     print(gpx_result.turning_x)