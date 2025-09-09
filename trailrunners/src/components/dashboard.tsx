import React from 'react';

interface TrailData {
    altitudeChange: number;
    altitudeMin: number;
    altitudeMax: number;
    altitudeStart: number;
    altitudeEnd: number;
    grade: number;
    gradeMax: number;
    gradeMin: number;
    distanceClimb: number;
    distanceDown: number;
    distanceFlat: number;
    avgTime: string;
    avgReverseTime: string;
    total_distance_km: number;
    total_distance_m: number;
    cumulative_distances_km: number[];
    cumulative_distances_m: number[];
    elevations: number[];
    latitudes: number[];
    longitudes: number[];
}

interface DashboardProps {
    trailData?: TrailData;
}

const StatCard = ({ label, value, unit = '', color = 'blue' }: { label: string; value: number | string; unit?: string; color?: string }) => (
    <span className="bg-white rounded-xl shadow-lg p-4 inline-block hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        <span className="text-gray-500 text-sm font-medium block mb-1 uppercase tracking-wider">{label}</span>
        <span className={`text-2xl font-bold block text-${color}-600`}>
            {typeof value === 'number' ? value.toFixed(1) : value}
            {unit && <span className="text-sm ml-1 text-gray-500">{unit}</span>}
        </span>
    </span>
);

const Dashboard: React.FC<DashboardProps> = ({ trailData }) => {
    if (!trailData) return null;

    const {
        altitudeChange,
        altitudeMin,
        altitudeMax,
        altitudeStart,
        altitudeEnd,
        grade,
        gradeMax,
        gradeMin,
        distanceClimb,
        distanceDown,
        distanceFlat,
        avgTime,
        avgReverseTime,
        total_distance_km,
        elevations = [],
        latitudes = [],
        longitudes = [],
    } = trailData;

    // Calculate some useful stats from the arrays only if they exist
    const lastElevation = elevations?.length ? elevations[elevations.length - 1] : 0;
    const centerLat = latitudes?.length ? latitudes.reduce((a, b) => a + b, 0) / latitudes.length : 0;
    const centerLong = longitudes?.length ? longitudes.reduce((a, b) => a + b, 0) / longitudes.length : 0;

    return (
        <span className="inline-grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            <StatCard label="Altitude Change" value={altitudeChange} unit="m" color="blue" />
            <StatCard label="Altitude Min" value={altitudeMin} unit="m" color="blue" />
            <StatCard label="Altitude Max" value={altitudeMax} unit="m" color="blue" />
            <StatCard label="Altitude Start" value={altitudeStart} unit="m" color="blue" />
            <StatCard label="Altitude End" value={altitudeEnd} unit="m" color="blue" />
            <StatCard label="Grade" value={grade} unit="%" color="green" />
            <StatCard label="Grade Max" value={gradeMax} unit="%" color="green" />
            <StatCard label="Grade Min" value={gradeMin} unit="%" color="green" />
            <StatCard label="Distance Climb" value={distanceClimb} unit="km" color="purple" />
            <StatCard label="Distance Down" value={distanceDown} unit="m" color="purple" />
            <StatCard label="Distance Flat" value={distanceFlat} unit="m" color="purple" />
            <StatCard label="Avg Time" value={avgTime} color="orange" />
            <StatCard label="Avg Reverse Time" value={avgReverseTime} color="orange" />
            <StatCard label="Total Distance" value={total_distance_km} unit="km" color="purple" />
            <StatCard label="Final Elevation Change" value={lastElevation} unit="m" color="blue" />
            <StatCard label="Center Latitude" value={centerLat} unit="°" color="green" />
            <StatCard label="Center Longitude" value={centerLong} unit="°" color="green" />
            <StatCard label="Total Points" value={elevations?.length || 0} color="orange" />
        </span>
    );
};

export default Dashboard;