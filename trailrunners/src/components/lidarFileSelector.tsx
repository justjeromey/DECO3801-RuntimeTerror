"use client";

import FileSelector, { FileItem } from "./fileSelector";

interface LidarFileSelectorProps {
    firstUse?: boolean;
    setTrailData: (data: unknown) => void;
    selected: string;
    setSelected: (name: string) => void;
    gpxFileItem?: FileItem | null;
}


export default function LidarFileSelector({firstUse = false, setTrailData, selected, setSelected, gpxFileItem}: LidarFileSelectorProps) {
    const addGpxToFormData = (formData: FormData) => {
        if (gpxFileItem?.file) {
            formData.append("gpxFile", gpxFileItem.file);
        } else if (gpxFileItem?.fileName) {
            formData.append("gpxFileName", gpxFileItem.fileName);
        }
    }

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
                acceptedFileTypes: ".laz,.las",
                uploadEndpoint: "/api/uploadLidar",
                fetchEndpoint: "/api/lidarFiles",
                uploadMessages: {
                    pending: "Uploading LIDAR file...",
                    success: "LIDAR file uploaded.",
                    error: "Failed to upload LIDAR file",
                },
                fetchMessages: {
                    pending: "Fetching LIDAR files...",
                    success: "LIDAR files successfully fetched",
                    error: "Failed to retrieve LIDAR files",
                },
                selectionMessages: {
                    pending: "Processing LIDAR data...",
                    success: "LIDAR data processed.",
                    error: "Failed to process LIDAR data",
                },
                firstUseUploadText: "Upload LIDAR",
                selectItemText: "Select LIDAR",
            }}
            formDataHelper={addGpxToFormData}
        />
    );
}