import fiona
import geopandas as gpd
import os

gdb_path = "../data/QSpatial/data.gdb"
# Construct absolute path to the geodatabase
gdb_path = os.path.abspath(os.path.join(os.path.dirname(__file__), gdb_path))


layers = fiona.listlayers(gdb_path)
lidar_layer = layers[0]

print(f"Loading layer: {lidar_layer}")
gdf = gpd.read_file(gdb_path, layer=lidar_layer)
print(gdf.head())
