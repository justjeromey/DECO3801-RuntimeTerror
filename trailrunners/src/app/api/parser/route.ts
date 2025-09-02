import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const API_URL = "http://127.0.0.1:8001/format-gpx";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        // Check if it's sent as a selection (i.e. file name)
        if (!file) {
            const fileName = formData.get("fileName");
            // If it's not sent as a fileName an error has occured
            if (!fileName || typeof fileName !== "string") {
                throw new Error("File name not valid");
            }

            const filePath = path.join(process.cwd(), "trails", fileName);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return NextResponse.json(
                    { error: "File not found" },
                    { status: 404 },
                );
            }

            // Read file and package into file object
            const fileBuf = fs.readFileSync(filePath);
            const file = new File([fileBuf], fileName, {
                type: "application/gpx+xml",
            });

            const _formData = new FormData();
            _formData.append("file", file);

            // Pass file object to parser api
            const fastApiRes = await fetch(API_URL, {
                method: "POST",
                body: _formData,
            });
            if (!fastApiRes.ok) {
                throw new Error(`${fastApiRes.status}`);
            }

            // Return the json result back
            const result = await fastApiRes.json();
            return NextResponse.json(result);
        }

        // If it's a file object, pass the file object to parser api
        const fastApiRes = await fetch(API_URL, {
            method: "POST",
            body: formData,
        });
        if (!fastApiRes.ok) {
            throw new Error(`${fastApiRes.status}`);
        }

        // Return the json result back
        const result = await fastApiRes.json();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to process GPX file ${error}` },
            { status: 500 },
        );
    }
}
