import fiona
import geopandas as gpd
import os
import matplotlib.pyplot as plt

gdb_path = "../data/QSpatial/data.gdb"
trails_path = "../data/trails/brisbane.geojson"

def convert_to_abs_path(path: str):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), path))

gdb_path = convert_to_abs_path(gdb_path)
trails_path = convert_to_abs_path(trails_path)


layers = fiona.listlayers(gdb_path)
lidar_layer = layers[0]

print(f"Loading layer: {lidar_layer}")
lidar_gdf = gpd.read_file(gdb_path, layer=lidar_layer)

#find brisbane from project_name
brisbane_rows = lidar_gdf[lidar_gdf['project_name'].str.contains('brisbane', case=False, na=False)]

brisbane_project_name = "Brisbane_2019_Prj"
brisbane_gdf = lidar_gdf[lidar_gdf['project_name'] == brisbane_project_name]
brisbane_geometry = brisbane_gdf['geometry'].values[0]

brisbane_gdf.plot()
plt.show()

#load trails
trails_gdf = gpd.read_file(trails_path)