import os
import gpxpy
import matplotlib.pyplot as plt

gpx_rel_path = "../data/trails/fells_loop.gpx"

def convert_to_abs_path(path: str):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), path))

gpx_path = convert_to_abs_path(gpx_rel_path)

with open(gpx_path, 'r') as gpx_file:
    gpx = gpxpy.parse(gpx_file)

latitudes = []
longitudes = []

# Try to get points from tracks (if any)
for track in gpx.tracks:
    for segment in track.segments:
        for point in segment.points:
            latitudes.append(point.latitude)
            longitudes.append(point.longitude)

# If no track points, get points from routes
if not latitudes and not longitudes:
    for route in gpx.routes:
        for point in route.points:
            latitudes.append(point.latitude)
            longitudes.append(point.longitude)
for waypoint in gpx.waypoints:
    pass  

for route in gpx.routes:
    for point in route.points:
        pass 
print(f"GPX file exists: {os.path.exists(gpx_path)}")
print(f"GPX file path: {gpx_path}")
print(f"Tracks: {len(gpx.tracks)}")
print(f"Routes: {len(gpx.routes)}")
print(f"Waypoints: {len(gpx.waypoints)}")
"""
print(f"Number of points: {len(latitudes)}")
print(f"First 5 latitudes: {latitudes[:5]}")
print(f"First 5 longitudes: {longitudes[:5]}")
"""
plt.figure(figsize=(8, 6))
plt.plot(longitudes, latitudes, marker='o', linestyle='-', color='blue')
plt.title('GPX Trail Visualization')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.grid(True)
plt.gca().set_aspect('equal', adjustable='box') 
plt.show()

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