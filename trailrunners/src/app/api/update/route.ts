import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL;

export async function POST(req: Request) {
    const body = await req.json();
    
    const res = await fetch(`${API_URL}/update`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(
        data, 
        { 
            status: res.status 
        }
    );
}
