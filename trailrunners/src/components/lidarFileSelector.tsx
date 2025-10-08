"use client";

import FileSelector from "./fileSelector";

interface LidarFileSelectorProps {
    firstUse?: boolean;
    setTrailData: (data: unknown) => void;
    selected: string;
    setSelected: (name: string) => void;
}


export default function LidarFileSelector({firstUse = false, setTrailData, selected, setSelected}: LidarFileSelectorProps) {
    return (
        <FileSelector
            onDataLoaded={(files) => {
                setTrailData(files);

            }}
            selected={selected}
            onSelectionChange={(name) => {
                console.log("Selected trail:", name);
                setSelected(name);
            }}
            firstUse={firstUse}
            config={{
                acceptedFileTypes: ".laz",
                uploadEndpoint: "/api/parser",
                selectItemText: "Upload Lidar Data",
            }}
        />
    );
}