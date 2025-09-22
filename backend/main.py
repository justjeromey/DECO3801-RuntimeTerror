from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from parseGpx import parse_gpx, convert_gpx_data_to_json

app = FastAPI()

@app.post("/format-gpx")
async def upload_gpx(file: UploadFile = File(...)):
    #check its gpx
    if not file.filename.endswith(".gpx"):
        return JSONResponse(status_code=400, content={"message": "Invalid file type. Please upload a GPX file."})

    # Process the GPX file
    gpx_data = parse_gpx(file.file)
    json = convert_gpx_data_to_json(gpx_data)

    return JSONResponse(status_code=200, content=json)

@app.post("/process-lidar")
async def process_lidar(lidar_file: UploadFile = File(...), gpx_file: UploadFile = File(...)):
    if not lidar_file.filename.endswith(".laz"):
        return JSONResponse(status_code=400, content={"message": "Invalid LiDAR file type. Please upload a .laz file."})
    
    if not gpx_file.filename.endswith(".gpx"):
        return JSONResponse(status_code=400, content={"message": "Invalid GPX file type. Please upload a .gpx file."})
    
    # Load the lidar data


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)