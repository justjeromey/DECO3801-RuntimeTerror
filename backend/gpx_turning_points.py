import matplotlib.pyplot as plt
from matplotlib.ticker import MultipleLocator

from parseGpx import get_trail_file_path, parse_gpx, GPXData

ROLLING_SEGMENT_THRESHOLD = 10  # Meters
NUMBER_OF_SPLITS = 5


def calculateSegmentStats(x_list: list[int], y_list: list[int], start: int, end: int):
    #calculate elevation gain for the segment 
    totalGain = 0.0
    for x in range(start, end - 1):
        if y_list[x + 1] > y_list[x]:
            totalGain += y_list[x + 1] - y_list[x]

    # Calculate hypotenuse
    rolling_x = []
    rolling_y = []
    numhills = 0

    for x in range(start, end - 1):
        x_diff = (x_list[x+1] - x_list[x]) * 1000
        y_diff = abs(y_list[x+1] - y_list[x])
        hypotenuse = (x_diff**2 + y_diff**2)**0.5

        # If section is short then it is rolling hill
        if hypotenuse < ROLLING_SEGMENT_THRESHOLD:
            rolling_x.extend([x_list[x],x_list[x+1]])
            rolling_y.extend([y_list[x], y_list[x+1]])
            numhills += 1

    # calculate grade for the segment 
    #print("\n\n\n",y_list[end - 1], y_list[start], x_list[end - 1], x_list[start], "\n\n\n")
    grade = (y_list[end - 1] - y_list[start]) / ((x_list[end - 1] - x_list[start])*1000)

    # organise the stats nicely
    stats = {
        "gain": totalGain,
        "hillcount": numhills,
        "rolling_x": rolling_x,
        "rolling_y": rolling_y,
        "grade": grade
    }

    return stats


trail_name = "device_measurement_2"
print(f"Loading {trail_name} GPX data...")
gpx_path = get_trail_file_path(trail_name)

gpx_result: GPXData = parse_gpx(gpx_path)


# Find turning points 
first = 0
second = 0
grad = "neutral"
index_list = []
i = 0

for y in gpx_result.elevations: 
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
        turning_x.append(gpx_result.cumulative_distances_m[index-1] / 1000)
        turning_y.append(gpx_result.elevations[index-1])

totalGain = 0.0
for x in range(len(turning_y)):
    if turning_y[x] > turning_y[x-1]:
        totalGain += turning_y[x] - turning_y[x-1]


# Calculate hypotenuse
rolling_x = []
rolling_y = []

for x in range(len(turning_x) - 1):
    x_diff = (turning_x[x+1] - turning_x[x]) * 1000
    y_diff = abs(turning_y[x+1] - turning_y[x])
    hypotenuse = (x_diff**2 + y_diff**2)**0.5

    # If section is short then it is rolling hill
    if hypotenuse < ROLLING_SEGMENT_THRESHOLD:
        rolling_x.extend([turning_x[x],turning_x[x+1]])
        rolling_y.extend([turning_y[x], turning_y[x+1]])


lastPoint = len(gpx_result.elevations) - 1
grade = gpx_result.elevations[lastPoint] / gpx_result.cumulative_distances_m[lastPoint]

distPerSegment = gpx_result.cumulative_distances_m[lastPoint] / NUMBER_OF_SPLITS

segmentIndeces = []

segmentStats = []

#find indeces of split points 
for i in range(0,NUMBER_OF_SPLITS):
    for j in range(0,len(turning_x)):
        if (turning_x[j] * 1000) > (distPerSegment * i):
            segmentIndeces.append(j)
            break

segmentIndeces.append(len(turning_x))
segmentPoints_x = []
segmentPoints_y = []

#calculate the segment statistics of each segment 
for i in range (len(segmentIndeces)):
    start = segmentIndeces[i-1] if i > 0 else 0
    end = segmentIndeces[i]
    print("segment start:",start, "segment end:", end)
    segmentPoints_x.append(turning_x[start])
    segmentPoints_y.append(turning_y[start])
    if end != 0:
        segmentStats.append(calculateSegmentStats(turning_x,turning_y,start-1,end))

#print segment stats
tg= 0
for stat in segmentStats:
    print("\nsegment grade:",stat["grade"])
    print("segment gain:",stat["gain"])
    tg += stat["gain"]
    print("cumulative gain:", tg)

results = calculateSegmentStats(turning_x, turning_y, 0, (len(turning_y)))

print("\ntotal elevation gain is:" , totalGain)
print(results["gain"])
print("total grade is:", grade)
print(results["grade"])

fig, ax = plt.subplots(figsize=(10, 4))
ax.plot(gpx_result.convert_distance_to_km, gpx_result.elevations, marker='.', color='green')
ax.scatter(turning_x, turning_y, c="blue", label="Turning points", marker="o", s=100, alpha=0.7, edgecolors="black")
ax.scatter(rolling_x, rolling_y, c="red", label="Rolling Hills", marker="o", s=100, alpha=0.7, edgecolors="black")
ax.scatter(segmentPoints_x, segmentPoints_y, c="yellow", label="Segment Starts", marker="o", s=100, alpha=0.7, edgecolors="black")

ax.legend()
ax.set_title('Elevation Profile')
ax.set_xlabel('Distance (km)')
ax.set_ylabel('Elevation (m)')
ax.grid(True)
# Set major ticks on the distance axis every 1 km (change to desired interval)
ax.xaxis.set_major_locator(MultipleLocator(1))
fig.tight_layout()

plt.show()




