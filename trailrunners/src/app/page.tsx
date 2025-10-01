"use client";
import FileSelector from "@/components/fileSelector";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Dashboard from "@/components/dashboard";
import Header from "../components/header";

interface PointData {
    longitude: number;
    latitude: number;
};


const MapViewer = dynamic(() => import("@/components/map"), {
    ssr: false,
});

const ChartViewer = dynamic(() => import('@/components/chart'), {
  ssr: false,
});

export default function Home() {
    const [trailData, setTrailData] = useState();
    const [pointIndex, setPointIndex] = useState(0);
    const mapRef = useRef(null);

    return (
        <div className="flex flex-col justify-between">
            <Header activePath="/" />
            
            <main className="flex flex-col px-10 py-5 h-full flex-1">
                
                <div className="w-full">
    
                    <nav className="nav_container">
                        <h1>TRAIL SUMMARY</h1>
                        <FileSelector setTrailData={setTrailData}/>
                    </nav>
                </div>
                <div className="components">
                    <div className="nested_components">
                        <div className="sections">
                            <h1>Trail Elevation Visualiser</h1>
                            <ChartViewer trailData={trailData} setPointIndex={setPointIndex}/>
                        </div>
                        <div className="sections">
                            <h1>Trail Overview</h1>
                            <MapViewer trailData={trailData} pointIndex={pointIndex} ref={mapRef}/>
                        </div>
                    </div>
                    <div className="sections">
                        <h1>Trail Analysis</h1>
                        <div className="analysis_container">
                            <p className="min-h-100">
                                <Dashboard trailData={trailData} />
                            </p>
                        </div>
                    </div>
                </div>
                <footer className="p-2 py-3 flex flex-wrap items-center justify-center">
                    <p>Made with ❤️ by Runtime Terrors</p>
                </footer>
            </main>
        </div>
    );
}

