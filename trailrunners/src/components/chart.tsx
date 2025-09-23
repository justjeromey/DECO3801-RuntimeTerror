import { useEffect, useMemo, useRef, useState } from "react";
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
import { useDebouncedCallback } from "use-debounce";

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
    labels: Array<number>;
    datasets: Array<{
        label?: string;
        data: Array<number | null>;
        borderColor: string;
        borderWidth?: number;
        pointRadius?: number;
        pointHoverRadius?: number;
        pointHitRadius?: number;
        backgroundColor?: string;
        fill?: boolean | string;
        order?: number;
    }>;
}

interface ChartViewerProps {
    trailData: Trail;
    setPointIndex: (index: number) => void;
}

interface optionsProps {
    e: React.MouseEvent<HTMLCanvasElement>
    active: Array<import("chart.js").ActiveElement>;
}


export default function ChartViewer({ trailData, setPointIndex }: ChartViewerProps) {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [prevPoint, setPrevPoint] = useState(0);
    const chartRef = useRef(null);

    // Function to determine difficulty level and color based on gradient
    const getGradientDifficulty = (grade: number) => {
        const absGrade = Math.abs(grade);
        if (absGrade < 0.05) return { level: "Easy", color: "rgba(34, 197, 94, 0.3)" }; // Green
        if (absGrade < 0.1) return { level: "Moderate", color: "rgba(234, 179, 8, 0.3)" }; // Yellow
        if (absGrade < 0.15) return { level: "Hard", color: "rgba(249, 115, 22, 0.3)" }; // Orange
        return { level: "Very Hard", color: "rgba(239, 68, 68, 0.3)" }; // Red
    };

    // Function to calculate gradient segments from existing elevation data
    const calculateGradientSegments = (trailData: Trail) => {
        const segments = [];
        const distances = trailData.cumulative_distances_m;
        const elevations = trailData.elevations;
        const numSegments = 5;
        const segmentLength = trailData.total_distance_m / numSegments;

        for (let i = 0; i < numSegments; i++) {
            const startDistance = i * segmentLength;
            const endDistance = (i + 1) * segmentLength;

            // Find indices for this segment
            let startIndex = 0;
            let endIndex = distances.length - 1;

            for (let j = 0; j < distances.length; j++) {
                if (distances[j] >= startDistance && startIndex === 0) {
                    startIndex = j;
                }
                if (distances[j] <= endDistance) {
                    endIndex = j;
                }
            }

            // Calculate gradient for this segment
            const elevationChange = elevations[endIndex] - elevations[startIndex];
            const distanceChange = distances[endIndex] - distances[startIndex];
            const gradient = distanceChange > 0 ? elevationChange / distanceChange : 0;

            const difficulty = getGradientDifficulty(gradient);

            // Create data points for this segment
            const segmentData = distances.map((distance, index) => {
                if (index >= startIndex && index <= endIndex) {
                    return elevations[index];
                }
                return null;
            });

            segments.push({
                label: `${difficulty.level} (${(gradient * 100).toFixed(1)}%)`,
                data: segmentData,
                backgroundColor: difficulty.color,
                borderColor: difficulty.color.replace('0.3', '0.8'),
                borderWidth: 0,
                pointRadius: 0,
                fill: 'origin',
                order: 2,
                gradient: gradient,
                startDistance: startDistance,
                endDistance: endDistance,
                elevationGain: Math.max(0, elevationChange)
            });
        }

        return segments;
    };

    // Function to get current segment info for tooltip
    const getCurrentSegmentInfo = (currentDistance: number, gradientSegments: any[]) => {
        for (const segment of gradientSegments) {
            if (currentDistance >= segment.startDistance && currentDistance <= segment.endDistance) {
                return segment;
            }
        }
        return null;
    };

    // Check if trail data has changed
    useEffect(() => {
        if (trailData) {
            try {
                const gradientSegments = calculateGradientSegments(trailData);
                
                // Parse new trail data
                setChartData({
                    // X axis data
                    labels: trailData.cumulative_distances_m,
                    datasets: [
                        ...gradientSegments,
                        {
                            label: "Elevation Profile",
                            // Y axis data
                            data: trailData.elevations,
                            // Styling choices
                            borderColor: "#69a742",
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 6,
                            pointHitRadius: 30,
                            fill: false,
                            order: 1, // Render on top
                        },
                    ],
                });
            } catch (error) {
                console.error(`Chart creation failed: ${error}`);
            }
        }
    }, [trailData]);

    // useMemo to preserve options unless trailData changes
    const options = useMemo(() => {
        const gradientSegments = trailData ? calculateGradientSegments(trailData) : [];
        
        return {
            // A on hover function that updates a parent value
            onHover: (e, active) => {
                // Making sure the active array isn't empty
                if (active.length <= 0) return;
                if (!active[0]) return;
                    
                // If a valid coordinate is returned, set the value to the index
                const pointIndex = active[0].index;
                if (prevPoint != pointIndex) {
                setPointIndex(pointIndex);
                }
            },
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
                    intersect: false,
                    callbacks: {
                        title: (context: import("chart.js").TooltipItem<"line">[]) => {
                            return ""; // Hide title
                        },
                        beforeBody: (context: import("chart.js").TooltipItem<"line">[]) => {
                            // Custom tooltip options
                            const dataPoint = context[0].parsed as { x: number; y: number };
                            const lines = [
                                `Distance: ${(dataPoint.x / 1000).toFixed(2)} km`,
                                `Distance: ${dataPoint.x.toFixed(2)} m`,
                                `Elevation: ${dataPoint.y.toFixed(2)} m`,
                            ];

                            // Add gradient information if available
                            const currentSegment = getCurrentSegmentInfo(dataPoint.x, gradientSegments);
                            if (currentSegment) {
                                const difficulty = getGradientDifficulty(currentSegment.gradient);
                                lines.push(`Gradient: ${(currentSegment.gradient * 100).toFixed(1)}%`);
                                lines.push(`Difficulty: ${difficulty.level}`);
                                lines.push(`Elevation Gain: ${currentSegment.elevationGain.toFixed(1)}m`);
                            }

                            return lines;
                        },
                        label: (context: import("chart.js").TooltipItem<"line">) => {
                            return ""; // Hide label
                        },
                    },
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x' as const,
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: 'x' as const,
                    },
                },
            },
            scales: {
                x: {
                    type: "linear" as const, // Use the x axis as numbers
                    bounds: "data" as const,
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
                        callback: function (value, index, values) {
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
    }, [trailData]);

    // Resets the zoom via ref to the chart
    const handleZoomReset = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    return (
        <div className="chart_container">
            {chartData !== null ? (
                <>
                    <Line data={chartData} options={options} ref={chartRef}/>
                    {trailData && trailData.elevations && trailData.elevations.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Gradient Difficulty Legend</h4>
                            <div className="flex flex-wrap gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded" style={{backgroundColor: "rgba(34, 197, 94, 0.6)"}}></div>
                                    <span>Easy (&lt;5%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded" style={{backgroundColor: "rgba(234, 179, 8, 0.6)"}}></div>
                                    <span>Moderate (5-10%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded" style={{backgroundColor: "rgba(249, 115, 22, 0.6)"}}></div>
                                    <span>Hard (10-15%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded" style={{backgroundColor: "rgba(239, 68, 68, 0.6)"}}></div>
                                    <span>Very Hard (&gt;15%)</span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="py-10 flex justify-center items-center">
                    <p>Select a trail to start...</p>
                </div>
            )}
            <button
                type="button"
                id="reset_zoom"
                onClick={handleZoomReset}
                className="button_1"
            >
                Reset Zoom
            </button>
        </div>
    );
}
