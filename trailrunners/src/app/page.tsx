"use client";

import GPXFileSelector from "@/components/gpxFileSelector";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Dashboard from "@/components/dashboard";
import Header from "../components/header";

const MapViewer = dynamic(() => import("@/components/map"), {
    ssr: false,
});

const ChartViewer = dynamic(() => import('@/components/chart'), {
  ssr: false,
});

export default function Home() {
    const [trailData, setTrailData] = useState();
    const [pointIndex, setPointIndex] = useState(0);
    const [selectedTrail, setSelectedTrail] = useState(""); 
    const mapRef = useRef(null);

    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Header activePath="/" />

            <main className="flex flex-col px-10 py-5 flex-1 justify-center">
                {!trailData ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-6 mt-10">
                        <h1 className="text-3xl font-bold">
                            Welcome to <span className="text-green-400 italic">TrailRunners</span>
                        </h1>
                        <p className="text-lg max-w-md">
                            To get started, upload a trail <strong>.gpx</strong> file for trail analysis and summary.
                        </p>

                        <GPXFileSelector
                            setTrailData={setTrailData}
                            selected={selectedTrail}
                            setSelected={setSelectedTrail}
                            firstUse={true}
                        />
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-6 mt-6">
                        <div className="w-full flex items-center justify-between">
                            
                            <h1 className="trailSummary">TRAIL SUMMARY</h1>

                            <GPXFileSelector
                                setTrailData={setTrailData}
                                selected={selectedTrail}
                                setSelected={setSelectedTrail}
                                firstUse={false}
                            />
                        </div>

                        <div className="components flex flex-col gap-6">
                            <div className="nested_components flex flex-col md:flex-row gap-6">
                                <div className="sections flex-1">
                                    <h1>Trail Elevation Visualiser</h1>
                                    <ChartViewer trailData={trailData} setPointIndex={setPointIndex}/>
                                </div>
                                <div className="sections flex-1">
                                    <h1>Trail Overview</h1>
                                    <MapViewer trailData={trailData} pointIndex={pointIndex} ref={mapRef} />
                                </div>
                            </div>

                            <div className="sections">
                                <h1>Trail Analysis</h1>
                                <div className="analysis_container">
                                    <Dashboard trailData={trailData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="p-2 py-3 flex flex-wrap items-center justify-center">
                <p>Made with ❤️ by Runtime Terrors</p>
            </footer>
        </div>
    );
}
