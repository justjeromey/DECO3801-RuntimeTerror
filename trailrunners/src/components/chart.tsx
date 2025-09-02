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
                        `Distance: ${(dataPoint.x / 1000).toFixed(2)} km`,
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
                mode: "x",
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: "x",
            },
        },
    },
    scales: {
        x: {
            type: "linear", // Use the x axis as numbers
            bounds: "data",
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
                // Round x labels to whole number
                callback: function(value, index, values) {
                    return Math.round(value);
                },
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                color: "rgba(255, 255, 255, 0.05)", // Sets the y-axis grid color
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
                // Parse new trail data
                setChartData({
                    // X axis data
                    labels: trailData.cumulative_distances_m,
                    datasets: [
                        {
                            // Y axis data
                            data: trailData.elevations,
                            // Styling choices
                            borderColor: "#69a742",
                            borderWidth: 1,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHitRadius: 10,
                        },
                    ],
                });
            } catch (error) {
                console.error(`Chart creation failed: ${error}`);
            }
        }
    }, [trailData]);

    // Resets the zoom via ref to the chart
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
                <div className="py-10 flex justify-center items-center">
                    <p>Select a trail to start...</p>
                </div>
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
