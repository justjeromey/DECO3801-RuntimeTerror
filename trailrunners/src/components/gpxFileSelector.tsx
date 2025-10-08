"use client";

import FileSelector from "./fileSelector";

interface GPXFileSelectorProps {
    firstUse?: boolean;
    setTrailData: (data: unknown) => void;
    selected: string;
    setSelected: (name: string) => void;
}


export default function GPXFileSelector({firstUse = false, setTrailData, selected, setSelected}: GPXFileSelectorProps) {
    return (
        <FileSelector
            onDataLoaded={(files) => {
                setTrailData(files);

            }}
            selected={selected}
            onSelectionChange={setSelected}
            firstUse={firstUse}
            config={{
                acceptedFileTypes: ".gpx",
                uploadEndpoint: "/api/parser",
                fetchEndpoint: "/api/fileReader",
            }}
        />
    );
}