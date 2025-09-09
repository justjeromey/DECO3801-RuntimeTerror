import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Polyline } from 'react-leaflet';
import { useState } from 'react';
import { useMap } from 'react-leaflet/hooks';

interface SetMapCenterProps {
    center: [number, number];
    initial: boolean;
}

// Dynamic imports for react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

// Add the line style options
const limeOptions = { color: '#0044ffff', weight: 3 };

const SetMapCenter: React.FC<SetMapCenterProps> = ({center, initial}) => {
    const map = useMap();
    useEffect(() => {
        if (!initial) {
            map.setView(center, 13);
        } else {
            map.setView(center);
        }

    }, [center, initial]);

    return null;
}

export default function MapViewer({ trailData }) {
    const [initial, setInitial] = useState(true);
    const [data, setData] = useState([]);
    const [center, setCenter] = useState([0,0]);

    useEffect(() => {
        try {
            if (trailData) {
                setData(
                    trailData.cumulative_distances_m.map(
                        (distance: number, index: number) => ([
                            trailData.latitudes[index],
                            trailData.longitudes[index],
                        ]),
                    ),
                );
                setCenter([
                    trailData.latitudes[Math.floor(trailData.latitudes.length / 2)],
                    trailData.longitudes[Math.floor(trailData.longitudes.length / 2)],
                ]);
                setInitial(false);
            }
        } catch (error) {
            console.error(error);
        }
    }, [trailData]);

    // Simply return the JSX directly - no render() needed
    return (
        <div className="map_container" style={{ height: '500px', width: '100%' }}>
            <MapContainer 
                center={center} 
                zoom={1} 
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="rounded-md"
            >
                <SetMapCenter center={center} initial={initial}/>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline pathOptions={limeOptions} positions={data} />
            </MapContainer>
        </div>
    );
}
