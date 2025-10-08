"use client";

import { useEffect, useRef, useState } from "react";
import GPXFileSelector from "@/components/gpxFileSelector";
import LidarFileSelector from "@/components/lidarFileSelector";
import type { FileItem } from "@/components/fileSelector";
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
    const [selectedLidar, setSelectedLidar] = useState("");
    const [lidarData, setLidarData] = useState();
    const [gpxFileItem, setGpxFileItem] = useState<FileItem | null>(null);
    const mapRef = useRef(null);

    useEffect(() => {
        setLidarData(null);
        setSelectedLidar("");
    }, [selectedTrail]);

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
                            setFileItem={setGpxFileItem}
                        />
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-6 mt-6">
                        <div className="w-full flex items-center justify-between">
                            
                            <h1 className="trailSummary">TRAIL SUMMARY</h1>

                            <div className="flex flex-row items-center gap-4">
                                <LidarFileSelector
                                    setTrailData={setLidarData}
                                    selected={selectedLidar}
                                    setSelected={setSelectedLidar}
                                    firstUse={false}
                                    gpxFileItem={gpxFileItem}
                                />

                                <GPXFileSelector
                                    setTrailData={setTrailData}
                                    selected={selectedTrail}
                                    setSelected={setSelectedTrail}
                                    firstUse={false}
                                />
                            </div>
                        </div>

                        <div className="components flex flex-col gap-6">
                            <div className="nested_components flex flex-col md:flex-row gap-6">
                                <div className="sections flex-1">
                                    <h1>Trail Elevation Visualiser</h1>
                                    <ChartViewer trailData={lidarData ? lidarData : trailData} setPointIndex={setPointIndex}/>
                                </div>
                                <div className="sections flex-1">
                                    <h1>Trail Overview</h1>
                                    <MapViewer trailData={lidarData ? lidarData : trailData} pointIndex={pointIndex} ref={mapRef} />
                                </div>
                            </div>

                            <div className="sections">
                                <h1>Trail Analysis</h1>
                                <div className="analysis_container">
                                    <Dashboard trailData={lidarData ? lidarData : trailData} />
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
