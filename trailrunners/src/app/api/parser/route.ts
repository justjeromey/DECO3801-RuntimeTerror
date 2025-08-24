import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        let file = formData.get("file");

        // Check if it's sent as a selection
        if (!file) {
            file = formData.get("fileName");
            console.log(file);
            // If it's not sent as a selection an error has occured
            if (!file) return;
        }

        // Run uploaded file through parser
        console.log(file);

        return NextResponse.json("");
    } catch (error) {
        return;
    }
}
