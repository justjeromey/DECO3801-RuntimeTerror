import os
import gpxpy
import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator
from gpxpy.geo import haversine_distance

trail_name = "fells_loop"
gpx_rel_path = f"../data/trails/{trail_name}.gpx"

def convert_to_abs_path(path: str):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), path))

gpx_path = convert_to_abs_path(gpx_rel_path)

with open(gpx_path, 'r') as gpx_file:
    gpx = gpxpy.parse(gpx_file)

latitudes = []
longitudes = []
elevations = []

# Try to get points from tracks (if any)
for track in gpx.tracks:
    for segment in track.segments:
        for point in segment.points:
            latitudes.append(point.latitude)
            longitudes.append(point.longitude)
            elevations.append(point.elevation)

# If no track points, get points from routes
if not latitudes and not longitudes:
    for route in gpx.routes:
        for point in route.points:
            latitudes.append(point.latitude)
            longitudes.append(point.longitude)
            elevations.append(point.elevation)

for waypoint in gpx.waypoints:
    pass  

for route in gpx.routes:
    for point in route.points:
        pass 

## Debugging messages
"""
print(f"GPX file exists: {os.path.exists(gpx_path)}")
print(f"GPX file path: {gpx_path}")
print(f"Tracks: {len(gpx.tracks)}")
print(f"Routes: {len(gpx.routes)}")
print(f"Waypoints: {len(gpx.waypoints)}")
"""

## Plotting the trail topdown view
plt.figure(figsize=(8, 6))
plt.plot(longitudes, latitudes, marker='o', linestyle='-', color='blue')
plt.title('GPX Trail Visualization')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.grid(True)
plt.gca().set_aspect('equal', adjustable='box') 
plt.show(block=False)

## Plotting the elevation profile (Distance vs Elevation)
if latitudes and longitudes and elevations and any(e is not None for e in elevations):
    # Compute cumulative distance along the path using haversine distance
    cum_dist_m = [0.0]
    total = 0.0
    for i in range(1, len(latitudes)):
        d = haversine_distance(latitudes[i-1], longitudes[i-1], latitudes[i], longitudes[i]) or 0.0
        total += d
        cum_dist_m.append(total)

    # Keep only points that have elevation values
    dist_km = [cum_dist_m[i] / 1000.0 for i, e in enumerate(elevations) if e is not None]
    elev_ok = [e for e in elevations if e is not None]

    if dist_km and elev_ok:
        fig, ax = plt.subplots(figsize=(10, 4))
        ax.plot(dist_km, elev_ok, marker='.', color='green')
        ax.set_title('Elevation Profile')
        ax.set_xlabel('Distance (km)')
        ax.set_ylabel('Elevation (m)')
        ax.grid(True)
        # Set major ticks on the distance axis every 1 km (change to desired interval)
        ax.xaxis.set_major_locator(MultipleLocator(1))
        fig.tight_layout()
        plt.show()

## Creating a GPX file
"""
print('GPX:', gpx.to_xml())

gpx = gpxpy.gpx.GPX()

gpx_track = gpxpy.gpx.GPXTrack()
gpx.tracks.append(gpx_track)

gpx_segment = gpxpy.gpx.GPXTrackSegment()
gpx_track.segments.append(gpx_segment)

gpx_segment.points.append(gpxpy.gpx.GPXTrackPoint(2.1234, 5.1234, elevation=1234))
gpx_segment.points.append(gpxpy.gpx.GPXTrackPoint(2.1235, 5.1235, elevation=1235))
gpx_segment.points.append(gpxpy.gpx.GPXTrackPoint(2.1236, 5.1236, elevation=1236))

print('Created GPX:', gpx.to_xml())
"""