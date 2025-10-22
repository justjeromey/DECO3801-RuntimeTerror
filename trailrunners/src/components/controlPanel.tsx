/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { toast } from "react-toastify";

interface TrailData {
    altitudeChange: number;
    altitudeMin: number;
    altitudeMax: number;
    altitudeStart: number;
    altitudeEnd: number;
    grade: number;
    distanceUp: number;
    distanceDown: number;
    distanceFlat: number;
    total_distance_km: number;
    total_distance_m: number;
    cumulative_distances_km: number[];
    cumulative_distances_m: number[];
    elevations: number[];
    latitudes: number[];
    longitudes: number[];
    turning_x: number[];
    turning_y: number[];
}

interface Parameters {
    threshold: number;
    segments: number;
}

interface DashboardProps {
    trailData?: TrailData;
    setTrailData?: React.Dispatch<React.SetStateAction<TrailData>>;
}

const MAX_THRESHOLD = 100;
const DEFAULT_THESHOLD = 10;
const DEFAULT_SEGMENTS = 5;
const MAX_SEGMENTS = 100;
const API_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL;

export default function ControlPanel({ trailData, setTrailData }: DashboardProps) {
    const [thresh, setThresh] = useState<number>(DEFAULT_THESHOLD);
    const [segs, setSegments] = useState<number>(DEFAULT_SEGMENTS);
    const [pending, setPending] = useState<boolean>(false);

    const handleParameters = async (formData: FormData) => {
        if (formData.get("threshold") == "" && formData.get("splits") == "") return;

        const threshold = Number(formData.get("threshold"));
        const segments = Number(formData.get("splits"));

        if (threshold && threshold >= 1 && threshold <= MAX_THRESHOLD) {
            setThresh(threshold);
        }

        if (segments && segments >= 1 && segments <= MAX_SEGMENTS) {
            setSegments(segments);
        }

        // Call api with gpx data + new params
        try {
            if (pending) return;
            setPending(true)

            const promise = await fetch(`${API_URL}/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    elevations: trailData.elevations,
                    latitudes: trailData.latitudes,
                    longitudes: trailData.longitudes,
                    cumulative_distances_m: trailData.cumulative_distances_m,

                    // Fill in value with previous one if not provided
                    threshold: threshold ? threshold : thresh,
                    segments: segments ? segments : segs,
                }),
            })

            const data = await promise.json();
            setPending(false)

            if (data) {
                console.log(data)
                setTrailData(data)
            }
        } catch (e) {
            console.error("Update failed...", e);
        }
    };

    return (
        <div className="max-w-full flex-grow bg-background rounded-xl shadow-lg p-6 border border-secondary">
            <h1>Parameters</h1>
            <form action={handleParameters}>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-10">
                        <label htmlFor="height" className="min-w-20">
                            Segment Threshold (m)
                        </label>
                        <input
                            className="flex-grow px-4 py-1 border border-secondary rounded-md bg-[#110f0e]"
                            type="number"
                            id="height"
                            name="threshold"
                            min="1"
                            max="100"
                            placeholder={thresh ? thresh.toString() : "10"}
                        />
                    </div>
                    <div className="flex justify-between items-center gap-10">
                        <label htmlFor="splits" className="min-w-20">
                            Number of splits
                        </label>
                        <input
                            className="flex-grow px-4 py-1 border border-secondary rounded-md bg-[#110f0e]"
                            type="number"
                            id="splits"
                            name="splits"
                            min="1"
                            max="200"
                            placeholder={segs ? segs.toString() : "5"}
                        />
                    </div>
                    <button type="submit" className="button_1 px-4 py-2 w-full">Update Parameters</button>
                </div>
            </form>
        </div>
    );
}
