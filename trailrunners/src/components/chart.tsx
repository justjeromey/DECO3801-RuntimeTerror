import { useEffect, useRef, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    zoomPlugin,
);

interface Trail {
    cumulative_distances_km: Array<number>;
    cumulative_distances_m: Array<number>;
    elevations: Array<number>;
    latitudes: Array<number>;
    longitudes: Array<number>;
    total_distance_km: number;
    total_distance_m: number;
}

interface DataPoint {
    distance: number;
    elevation: number;
}

interface ChartData {
    labels: string;
    datasets: [
        {
            label: string;
            data: Array<number>;
            boarderColor: string;
        },
    ];
}
export const options = {
    responsive: true,
    interactions: {
        mode: "nearest",
        intersect: false,
        axis: "x",
    },
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
        tooltip: {
            callbacks: {
                // Custom tooltip options
                title: (context) => {
                    return ""; // Hide title
                },
                beforeBody: (context) => {
                    const dataPoint = context[0].parsed;
                    return [
                        `Distance: ${dataPoint.x.toFixed(2)} m`,
                        `Elevation: ${dataPoint.y.toFixed(2)} m`,
                    ];
                },
                label: (context) => {
                    return ""; // Hide label
                },
            },
        },
        zoom: {
            pan: {
                enabled: true,
                mode: "xy",
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: "xy",
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.05)", // Sets the x-axis grid color
            },
            title: {
                display: true,
                text: "Distance (m)",
            },
            ticks: {
                // Tick settings to reduce amount of clutter
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
                // Show label only if it's a whole number
                callback: function(value, index, values) {
                    if (Math.floor(value) === value) {
                        return value;
                    }
                },
            },
        },
        y: {
            beginAtZero: true, // Start the y-axis at 0
            grid: {
                color: "rgba(255, 255, 255, 0.05)", // Sets the x-axis grid color
            },
            title: {
                display: true,
                text: "Elevation (m)",
            },
        },
    },
};

export default function ChartViewer({ trailData }) {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const chartRef = useRef(null);

    // Check if trail data has changed
    useEffect(() => {
        if (trailData) {
            try {
                setChartData({
                    labels: trailData.cumulative_distances_m,
                    datasets: [
                        {
                            label: "Elevation (m)",
                            data: trailData.elevations,
                            borderColor: "#69a742",
                            borderWidth: 1,
                            pointRadius: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error(`Chart creation failed: ${error}`);
            }
        }
    }, [trailData]);

    const handleZoomReset = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    return (
        <div className="chart_container flex flex-col justify-between">
            {chartData !== null ? (
                <Line data={chartData} options={options} ref={chartRef} />
            ) : (
                <div className="text-center pt-20">Loading...</div>
            )}
            <button
                type="button"
                id="reset_zoom"
                onClick={handleZoomReset}
                className="mt-3 cursor-pointer max-w-[10rem] bg-accent-2 border border-secondary p-1 px-3 rounded-lg hover:brightness-110 active:brightness-90"
            >
                Reset zoom
            </button>
        </div>
    );
}
