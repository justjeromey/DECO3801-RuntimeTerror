import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator

from parseGpx import get_trail_file_path, parse_gpx, GPXData



trail_name = "fells_loop"
print(f"Loading {trail_name} GPX data...")
gpx_path = get_trail_file_path(trail_name)

gpx_result: GPXData = parse_gpx(gpx_path)


print("elevations expressed as a list")
print(gpx_result.elevations)
print("distance along trail")
print(gpx_result.cumulative_distances_m)





first = 0
second = 0
grad = "neutral"
index_list = []
i=0
for y in gpx_result.elevations: 
    second = first
    first = y
    diff = first - second 
    if diff > 0 :
        if grad != "pos":
            index_list.append(i)
        grad = "pos"
    elif diff < 0:
        if grad != "neg":
            index_list.append(i) 
        grad = "neg"
    i += 1

print(index_list)


turning_x = []
turning_y = []
for index in index_list:
    turning_x.append(gpx_result.cumulative_distances_m[index] / 1000)
    turning_y.append(gpx_result.elevations[index])




num_points = len(gpx_result.latitudes)

trail_markersize = max(0.5, 20 / num_points)  # Adjust 20 to tune overall size
print("Trail marker size: ", trail_markersize)
## Plotting the trail topdown view
plt.figure(figsize=(8, 6))
plt.plot(gpx_result.longitudes, gpx_result.latitudes, marker='o', linestyle='-', color='blue', markersize=trail_markersize)
plt.title('GPX Trail Visualization')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.grid(True)
plt.gca().set_aspect('equal', adjustable='box') 
plt.show(block=False)


fig, ax = plt.subplots(figsize=(10, 4))
ax.plot(gpx_result.convert_distance_to_km, gpx_result.elevations, marker='.', color='green')
ax.scatter(turning_x, turning_y, c="blue", marker="o", s=100, alpha=0.7, edgecolors="black")
ax.set_title('Elevation Profile')
ax.set_xlabel('Distance (km)')
ax.set_ylabel('Elevation (m)')
ax.grid(True)
# Set major ticks on the distance axis every 1 km (change to desired interval)
ax.xaxis.set_major_locator(MultipleLocator(1))
fig.tight_layout()

plt.show()




