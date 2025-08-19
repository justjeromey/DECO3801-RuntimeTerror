import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator

from parseGpx import get_trail_file_path, parse_gpx, GPXData
## Working
##trail_name = "fells_loop"
##trail_name = "Skyline_Drive_2023.11.25"
trail_name = "route_file"


gpx_path = get_trail_file_path(trail_name)

gpx_result: GPXData = parse_gpx(gpx_path)

##num_points = len(gpx_result.latitudes)

##trail_markersize = max(0.5, 20 / num_points)  # Adjust 20 to tune overall size
##print("Trail marker size: ", trail_markersize)
## Plotting the trail topdown view
plt.figure(figsize=(8, 6))
plt.plot(gpx_result.longitudes, gpx_result.latitudes, marker='o', linestyle='-', color='blue', markersize=3)
plt.title('GPX Trail Visualization')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.grid(True)
plt.gca().set_aspect('equal', adjustable='box') 
plt.show(block=False)


fig, ax = plt.subplots(figsize=(10, 4))
ax.plot(gpx_result.convert_distance_to_km, gpx_result.elevations, marker='.', color='green')
ax.set_title('Elevation Profile')
ax.set_xlabel('Distance (km)')
ax.set_ylabel('Elevation (m)')
ax.grid(True)
# Set major ticks on the distance axis every 1 km (change to desired interval)
ax.xaxis.set_major_locator(MultipleLocator(1))
fig.tight_layout()
plt.show()