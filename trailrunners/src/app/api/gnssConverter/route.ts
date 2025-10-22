import { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL;

export async function POST(request: NextRequest) {
    try {
        // Get the file sent from the browser
        const formData = await request.formData();

        const fastApiRes = await fetch(`${API_URL}/convert`, {
            method: "POST",
            body: formData,
        });

        if (!fastApiRes.ok) {
            return new Response(
                JSON.stringify({ error: `FastAPI error: ${fastApiRes.status}` }),
                { status: fastApiRes.status, headers: { "Content-Type": "application/json" } }
            );
        }

        // Forward the GPX file back to the client
        const blob = await fastApiRes.blob();
        return new Response(blob, {
            headers: {
                "Content-Type": "application/gpx+xml",
                "Content-Disposition": "attachment; filename=converted_output.gpx",
            },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: `Failed to process GNSS file: ${error}` }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
