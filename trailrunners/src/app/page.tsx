"use client";

import { useEffect, useRef, useState } from "react";
import GPXFileSelector from "@/components/gpxFileSelector";
import LidarFileSelector from "@/components/lidarFileSelector";
import type { FileItem } from "@/components/fileSelector";
import dynamic from "next/dynamic";
import Dashboard from "@/components/dashboard";
import Header from "../components/header";
import ControlPanel from "@/components/controlPanel";
import Footer from "@/components/footer";

const MapViewer = dynamic(() => import("@/components/map"), {
  ssr: false,
});

const ChartViewer = dynamic(() => import("@/components/chart"), {
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
  const [displayData, setDisplayData] = useState();

  useEffect(() => {
    setLidarData(undefined);
    setSelectedLidar("");
  }, [selectedTrail]);

  useEffect(() => {
    setDisplayData(lidarData || trailData);
  }, [trailData, lidarData]);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header activePath="/" />

      <main className="flex flex-col px-10 py-5 flex-1 justify-center">
        {!trailData ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6 mt-10">
            <h1 className="text-3xl font-bold">
              Welcome to{" "}
              <span className="text-green-400 italic">TrailRunners</span>
            </h1>
            <p className="text-lg max-w-md">
              To get started, upload a trail <strong>.gpx</strong> file for
              trail analysis and summary.
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
          <div className="w-full flex flex-col gap-6 min-h-screen">
            <div className="w-full flex items-center justify-end min-h-16">
              <div className="flex flex-row items-center gap-4 min-h-16">
                <LidarFileSelector
                  key="lidar"
                  setTrailData={setLidarData}
                  selected={selectedLidar}
                  setSelected={setSelectedLidar}
                  firstUse={false}
                  gpxFileItem={gpxFileItem}
                />

                <GPXFileSelector
                  key="gpx"
                  setTrailData={setTrailData}
                  selected={selectedTrail}
                  setSelected={setSelectedTrail}
                  setFileItem={setGpxFileItem}
                  firstUse={false}
                />
              </div>
            </div>

            <div className="components flex flex-col gap-6">
              <div className="nested_components flex flex-col md:flex-row gap-6">
                <div className="sections flex-1">
                  <h1>Trail Elevation Visualiser</h1>
                  {displayData && (
                    <ChartViewer
                      trailData={displayData}
                      setPointIndex={setPointIndex}
                    />
                  )}
                </div>
                <div className="sections flex-1">
                  <h1>Trail Overview</h1>
                  {displayData && (
                    <MapViewer
                      key={selectedLidar || selectedTrail}
                      trailData={displayData}
                      pointIndex={pointIndex}
                      ref={mapRef}
                    />
                  )}
                </div>
              </div>

              <div className="sections">
                <h1>Trail Analysis</h1>
                <div className="analysis_container">
                  {displayData && <Dashboard trailData={displayData} />}
                  {displayData && (
                    <ControlPanel
                      trailData={displayData}
                      setTrailData={setDisplayData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
