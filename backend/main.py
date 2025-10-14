from typing import List, Optional
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from parseGpx import GPXData, parse_gpx, convert_gpx_data_to_json, handle_gpx_stats
from parseLidar import parse_lidar
from gnss_to_gpx import convert_to_gpx
from pydantic import BaseModel
import tempfile

class TrailData(BaseModel):
    elevations: List[Optional[float]]
    latitudes: List[float]
    longitudes: List[float]
    cumulative_distances_m: List[float]
    threshold: int
    segments: int

app = FastAPI()

@app.post("/format-gpx")
async def upload_gpx(file: UploadFile = File(...)):
    #check its gpx
    if not file.filename.endswith(".gpx"):
        return JSONResponse(status_code=400, content={"message": "Invalid file type. Please upload a GPX file."})

    # Process the GPX file
    gpx_data = parse_gpx(file.file)
    handle_gpx_stats(gpx_data)
    json = convert_gpx_data_to_json(gpx_data)

    return JSONResponse(status_code=200, content=json)

@app.post("/process-lidar")
async def process_lidar(lidar_file: UploadFile = File(...), gpx_file: UploadFile = File(...)):
    if not lidar_file.filename.endswith(".laz"):
        return JSONResponse(status_code=400, content={"message": "Invalid LiDAR file type. Please upload a .laz file."})
    
    if not gpx_file.filename.endswith(".gpx"):
        return JSONResponse(status_code=400, content={"message": "Invalid GPX file type. Please upload a .gpx file."})
    
    # Load the lidar data
    gpx_data = parse_lidar(lidar_file.file, gpx_file.file)
    handle_gpx_stats(gpx_data)
    json = convert_gpx_data_to_json(gpx_data)
    
    return JSONResponse(status_code=200, content=json)

@app.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    # Output file
    output_file = tmp_path.replace(".txt", ".gpx")

    # Run your converter
    convert_to_gpx(tmp_path, output_file)

    # Return file to frontend
    return FileResponse(
        path=output_file,
        filename="converted_output.gpx",
        media_type="application/gpx+xml"
    )

@app.post("/update")
async def update_params(data: TrailData):
    gpx_data = GPXData(
            longitudes = data.longitudes,
            latitudes = data.latitudes,
            elevations = data.elevations,
            cumulative_distances_m = data.cumulative_distances_m)
    output = handle_gpx_stats(gpx_data, data.threshold, data.segments)
    json = convert_gpx_data_to_json(output)

    return JSONResponse(status_code=200, content=json)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
