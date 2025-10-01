import React, { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Polyline, Circle, Marker, CircleMarker } from "react-leaflet";
import { useState } from "react";
import { useMap } from "react-leaflet/hooks";

interface SetMapCenterProps {
    center: [number, number];
    initial: boolean;
}


// Dynamic imports for react leaflet components
interface Trail {
    cumulative_distances_km: Array<number>;
    cumulative_distances_m: Array<number>;
    elevations: Array<number>;
    latitudes: Array<number>;
    longitudes: Array<number>;
    total_distance_km: number;
    total_distance_m: number;
}

type Point = [latitude: number, longitude: number];

// Dynamic imports for react-leaflet components
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false },
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false },
);

// SVG component style options
const trailOptions = { color: "#3888fb", weight: 4 };
const markerOptions = { color: "#e2ecf2", opacity: 1, fillColor: "#3888fb", fill: true, fillOpacity: 1};

// Custom centering function
const SetMapCenter: React.FC<SetMapCenterProps> = ({ center, initial }) => {
    const map = useMap();
    useEffect(() => {
        if (!initial) {
            map.setView(center, 15);
        } else {
            map.setView(center);
        }
    }, [center, initial]);

    return null;
};

export default function MapViewer({ trailData, pointIndex, ref }) {
    const [initial, setInitial] = useState(true);
    const [data, setData] = useState([]);
    const [center, setCenter] = useState<Point>([0, 0]);
    const [markerPoint, setMarkerPoint] = useState<Point | null>(null);

    // Rendering trail component
    useEffect(() => {
        try {
            if (trailData) {
                setData(
                    trailData.cumulative_distances_m.map(
                        (distance: number, index: number) => [
                            trailData.latitudes[index],
                            trailData.longitudes[index],
                        ],
                    ),
                );
                setCenter([
                    trailData.latitudes[
                        Math.floor(trailData.latitudes.length / 2)
                    ],
                    trailData.longitudes[
                        Math.floor(trailData.longitudes.length / 2)
                    ],
                ]);
                setInitial(false);
            }
        } catch (error) {
            console.error(error);
        }
    }, [trailData]);

    // Changes marker position when chart point updates
    useEffect(() => {
        try {
            // Make sure updated point isn't null
            if (pointIndex !== null) {
                if (!trailData) return;
                setMarkerPoint([
                    trailData.latitudes[pointIndex],
                    trailData.longitudes[pointIndex],
                ]);
            }
        } catch (error) {
            console.log(error);
        }
    }, [pointIndex]);

    const MapResizeFix = () => {
        const map = useMap();
        useEffect(() => {
            map.invalidateSize();
        }, [map]);
        return null;
    };

    // Simply return the TSX directly - no render() needed
    return (
        <div
            className="map_container"
            style={{ height: "500px", width: "100%" }}
        >
            <MapContainer
                center={center}
                zoom={1}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="rounded-md"
            >
                <SetMapCenter center={center} initial={initial} />
                <MapResizeFix /> 

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline pathOptions={trailOptions} positions={data} />
                <CircleMarker
                    center={!markerPoint ? [0, 0] : markerPoint}
                    radius={5}
                    pathOptions={!markerPoint ? {opacity: 0, fillOpacity: 0} : markerOptions}
                />
            </MapContainer>
        </div>
    );
}
