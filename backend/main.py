from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

from parseGpx import parse_gpx, save_json, GPXData

app = FastAPI()

@app.post("/upload-gpx")
async def upload_gpx(file: UploadFile = File(...)):
    #check its gpx
    if not file.filename.endswith(".gpx"):
        return JSONResponse(status_code=400, content={"message": "Invalid file type. Please upload a GPX file."})

    # Process the GPX file
    gpx_data = parse_gpx(file.file)
    json_file_path = f"../data/trails/{file.filename}.json"
    save_json(gpx_data, json_file_path)

    return JSONResponse(status_code=200, content={"message": "GPX file uploaded and processed successfully."})