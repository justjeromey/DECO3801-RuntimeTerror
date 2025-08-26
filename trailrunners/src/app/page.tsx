'use client'

import Image from "next/image";
import FileSelector from "@/components/fileSelector";
import { useState } from "react";
import ChartViewer from "@/components/chart";

export default function Home() {
    const [trailData, setTrailData] = useState();
    return (
        <div className="flex flex-col justify-between h-screen">
            <header className="header flex flex-col px-10 py-4">
                <Image
                        src="/logo.svg"
                        width={290}
                        height={70}
                        alt="Trail Runners"
                    />
            </header>

            <main className="flex flex-col px-10 py-5 h-full">
                
                <div className="w-full">
                    <nav className="nav_container">
                        <h1>Trail Summary</h1>
                        <FileSelector setTrailData={setTrailData}/>
                    </nav>
                </div>
                <div className="components">
                    <div className="nested_components">
                        <div className="sections">
                            <h1>Trail Elevation Visualiser</h1>
                            <ChartViewer trailData={trailData}/>
                        </div>
                        <div className="sections">
                            <h1>Trail Analysis</h1>
                            <div className="analysis_container">
                                <p>This is where the analysis goes</p>
                            </div>
                        </div>
                    </div>
                    <div className="sections">
                        <h1>Trail Overview</h1>
                        <div className="container">
                            <p>This is where the map goes</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="p-2 py-3 flex flex-wrap items-center justify-center">
                <p>Made with ❤️ by Runtime Terrors</p>
            </footer>
        </div>
    );
}
