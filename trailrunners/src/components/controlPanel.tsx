import { useState } from "react";

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

interface DashboardProps {
    trailData?: TrailData;
}

const MAX_THRESHOLD = 100;
const MAX_SPLITS = 100;

export default function ControlPanel({ trailData }: DashboardProps) {
    const [thresh, setThresh] = useState<number|null>(null)
    const [splits, setSplits] = useState<number|null>(null)

    const handleParameters = (formData: FormData) => {
        if (!formData) return;

        const threshold = Number(formData.get("threshold"));
        const splits = Number(formData.get("splits"));

        if (threshold && threshold >= 1 && threshold <= MAX_THRESHOLD) {
            setThresh(threshold);
        }

        if (splits && splits >= 1 && splits <= MAX_SPLITS) {
            setSplits(splits);
        }

        console.log(formData);
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
                            placeholder={splits ? splits.toString() : "5"}
                        />
                    </div>
                    <button type="submit" className="button_1 px-4 py-2 w-full">Update Parameters</button>
                </div>
            </form>
        </div>
    );
}
