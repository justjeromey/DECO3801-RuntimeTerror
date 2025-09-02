"use client";

import Image from "next/image";
import FileSelector from "@/components/fileSelector";
import { useState } from "react";
import dynamic from "next/dynamic";

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
    const [pointData, setPointData] = useState(0);

    return (
        <div className="flex flex-col justify-between h-screen">
            <main className="flex flex-col p-10 h-full">
                <div className="w-full">
                    <nav className="flex mb-5 justify-between items-center">
                        <Image
                            src="/logo.svg"
                            width={303}
                            height={83}
                            alt="Trail Runners"
                        />
                        <FileSelector setTrailData={setTrailData} />
                    </nav>
                </div>
                <div className="components">
                    <div className="nested_components">
                        <div className="sections">
                            <h1>Trail Elevation Visualiser</h1>
                            <ChartViewer trailData={trailData} setPointData={setPointData}/>
                        </div>
                        <div className="sections">
                            <h1>Trail Overview</h1>
                            <MapViewer trailData={trailData} pointData={pointData}/>
                        </div>
                    </div>
                    <div className="sections">
                        <h1>Trail Analysis</h1>
                        <div className="analysis_container">
                            <p>This is where the analysis goes</p>
                            <p className="outline min-h-100">
                                Testing out the vertical spacing
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
