import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const API_URL = "http://127.0.0.1:8000/process-lidar";

export async function POST(request: NextRequest) {
    try {
            const formData = await request.formData();
            const file = formData.get("file");

    } catch (error) {
        console.error(`Error processing LIDAR data: ${error}`);
        return NextResponse.json(
            { error: "Error processing LIDAR data" },
            { status: 500 },
        );
    }
}