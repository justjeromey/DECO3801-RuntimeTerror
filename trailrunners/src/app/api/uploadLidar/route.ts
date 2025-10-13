import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const API_URL = "http://127.0.0.1:8000/process-lidar";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const lidarFile = formData.get("file");

    const formDataToSend = new FormData();
    if (lidarFile instanceof File) {
      formDataToSend.append("lidar_file", lidarFile);
    }

    if (!lidarFile) {
      const fileName = formData.get("fileName");
      if (!fileName || typeof fileName !== "string") {
        throw new Error("File name not valid");
      }

      const filePath = path.join(process.cwd(), "lidarFiles", fileName);

      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      // read the file
      const fileBuf = fs.readFileSync(filePath);
      const file = new File([fileBuf], fileName, {
        type: "application/octet-stream",
      });
      formDataToSend.append("lidar_file", file);
    }

    // Check for accompanying GPX file
    const gpxFile = formData.get("gpxFile");
    if (gpxFile instanceof File) {
      formDataToSend.append("gpx_file", gpxFile);
    } else {
      const gpxFileName = formData.get("gpxFileName");
        if (gpxFileName && typeof gpxFileName === "string") {
            const gpxFilePath = path.join(process.cwd(), "trails", gpxFileName);
            if (fs.existsSync(gpxFilePath)) {
                const gpxFileBuf = fs.readFileSync(gpxFilePath);
                const gpxFileObj = new File([gpxFileBuf], gpxFileName, {
                    type: "application/gpx+xml",
                });
                formDataToSend.append("gpx_file", gpxFileObj);
            }
        }
    }

    // make the request to the FastAPI server
    const fastApiRes = await fetch(API_URL, {
      method: "POST",
      body: formDataToSend,
    });
    if (!fastApiRes.ok) {
      throw new Error(`${fastApiRes.status}`);
    }
    const result = await fastApiRes.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error processing LIDAR data: ${error}`);

    return NextResponse.json(
      { error: "Error processing LIDAR data" },
      { status: 500 }
    );
  }
}
