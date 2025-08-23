import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const folderPath = path.join(process.cwd(), "trails");
    const filenames = fs.readdirSync(folderPath);

    return NextResponse.json(filenames);
}
