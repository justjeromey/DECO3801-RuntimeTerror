"use client";

import FileSelector from "./fileSelector";

interface GPXFileSelectorProps {
    firstUse?: boolean;
    setTrailData: (data: unknown) => void;
    selected: string;
    setSelected: (name: string) => void;
    setFileItem?: (data: unknown) => void;
}


export default function GPXFileSelector({firstUse = false, setTrailData, selected, setSelected, setFileItem}: GPXFileSelectorProps) {
    return (
        <FileSelector
            key="gpx"
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
            setFileItem={setFileItem}
        />
    );
}
