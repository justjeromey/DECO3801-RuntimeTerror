"use client";

import Image from "next/image";
import FileSelector from "@/components/fileSelector";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapViewer = dynamic(() => import("@/components/map"), {
    ssr: false,
});

const ChartViewer = dynamic(() => import('@/components/chart'), {
  ssr: false,
});

export default function Home() {
    const [trailData, setTrailData] = useState();
    return (
        <div className="flex flex-col justify-between h-screen">
            <header className="header flex flex-row justify-between items-center px-10 py-4">
                <Image
                        src="/logo.svg"
                        width={290}
                        height={70}
                        alt="Trail Runners"
                    />

                <div className="nav_links flex flex-row gap-10 text-lg font-medium uppercase">
                    <Link href="/" className="headerLink activeLink">Trail Summary</Link>
                    <Link href="/info" className="headerLink">Info</Link>

                </div>
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
                            <ChartViewer trailData={trailData} />
                        </div>
                        <div className="sections">
                            <h1>Trail Overview</h1>
                            <MapViewer trailData={trailData} />
                        </div>
                    </div>
                    <div className="sections">
                        <h1>Trail Analysis</h1>
                        <div className="analysis_container">
                            <p className="min-h-100">
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

