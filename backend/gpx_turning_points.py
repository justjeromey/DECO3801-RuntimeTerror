import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator

from parseGpx import get_trail_file_path, parse_gpx, GPXData



trail_name = "fells_loop"
print(f"Loading {trail_name} GPX data...")
gpx_path = get_trail_file_path(trail_name)

gpx_result: GPXData = parse_gpx(gpx_path)


#find turning points 
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
    turning_x.append(gpx_result.cumulative_distances_m[index-1] / 1000)
    turning_y.append(gpx_result.elevations[index-1])

#calculate hypotenuse 
threshold = 200
rolling_x = []
rolling_y = []

for x in range(len(turning_x)-1):
    x_diff = (turning_x[x+1] - turning_x[x])*1000
    y_diff = abs(turning_y[x+1] - turning_y[x])
    hypotenuse = (x_diff**2 + y_diff**2)**0.5
    if hypotenuse < threshold:
        rolling_x.extend([turning_x[x],turning_x[x+1]])
        rolling_y.extend([turning_y[x], turning_y[x+1]])
        print(hypotenuse)

num_points = len(gpx_result.latitudes)

fig, ax = plt.subplots(figsize=(10, 4))
ax.plot(gpx_result.convert_distance_to_km, gpx_result.elevations, marker='.', color='green')
ax.scatter(turning_x, turning_y, c="blue", marker="o", s=100, alpha=0.7, edgecolors="black")
ax.scatter(rolling_x, rolling_y, c="red", marker="o", s=100, alpha=0.7, edgecolors="black")
ax.set_title('Elevation Profile')
ax.set_xlabel('Distance (km)')
ax.set_ylabel('Elevation (m)')
ax.grid(True)
# Set major ticks on the distance axis every 1 km (change to desired interval)
ax.xaxis.set_major_locator(MultipleLocator(1))
fig.tight_layout()

plt.show()




