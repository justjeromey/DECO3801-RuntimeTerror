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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)