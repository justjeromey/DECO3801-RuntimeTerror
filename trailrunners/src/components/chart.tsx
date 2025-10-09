/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    segment_stats?: Array<{
        gain: number;
        hillcount: number;
        rolling_x: Array<number>;
        rolling_y: Array<number>;
        grade: number;
    }>;
    segment_x_positions?: Array<number>;
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
    e: React.MouseEvent<HTMLCanvasElement>;
    active: Array<import("chart.js").ActiveElement>;
}

export default function ChartViewer({
    trailData,
    setPointIndex,
}: ChartViewerProps) {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [prevPoint, setPrevPoint] = useState(0);
    const chartRef = useRef(null);

    // Configuration for number of segments - change this to adjust segment count
    const FORCE_FRONTEND_SEGMENTS = true; // Set to true to use frontend calculation with custom segment count
    const FRONTEND_SEGMENT_COUNT = 20; // Number of segments when using frontend calculation (20 is optimal for performance)
    const MAX_DATASETS = 10; // Limit the number of visual datasets for performance

    // Function to determine difficulty level and color based on gradient
    const getGradientDifficulty = useCallback((grade: number) => {
        const absGrade = Math.abs(grade);
        if (absGrade < 0.05)
            return { level: "Easy", color: "rgba(34, 197, 94, 0.3)" }; // Green
        if (absGrade < 0.1)
            return { level: "Moderate", color: "rgba(234, 179, 8, 0.3)" }; // Yellow
        if (absGrade < 0.15)
            return { level: "Hard", color: "rgba(249, 115, 22, 0.3)" }; // Orange
        return { level: "Very Hard", color: "rgba(239, 68, 68, 0.3)" }; // Red
    }, []);

    // Function to calculate all segments with detailed metadata for tooltip data
    const calculateAllSegments = useCallback((trailData: Trail) => {
        const distances = trailData.cumulative_distances_m;
        const elevations = trailData.elevations;
        const numSegments = FRONTEND_SEGMENT_COUNT;
        const segmentLength = trailData.total_distance_m / numSegments;
        
        const allSegments = [];

        // Calculate all segments for tooltip data
        for (let i = 0; i < numSegments; i++) {
            const startDistance = i * segmentLength;
            const endDistance = (i + 1) * segmentLength;

            // Find indices for this segment
            let startIndex = 0;
            let endIndex = distances.length - 1;

            for (let j = 0; j < distances.length; j++) {
                if (distances[j] >= startDistance) {
                    startIndex = j;
                    break;
                }
            }

            if (i === numSegments - 1) {
                endIndex = distances.length - 1;
            } else {
                for (let j = distances.length - 1; j >= 0; j--) {
                    if (distances[j] <= endDistance) {
                        endIndex = j;
                        break;
                    }
                }
            }

            // Calculate gradient for this segment
            const elevationChange = elevations[endIndex] - elevations[startIndex];
            const distanceChange = distances[endIndex] - distances[startIndex];
            const gradient = distanceChange > 0 ? elevationChange / distanceChange : 0;

            const difficulty = getGradientDifficulty(gradient);

            allSegments.push({
                index: i,
                startDistance,
                endDistance,
                startIndex,
                endIndex,
                gradient,
                difficulty,
                elevationGain: Math.max(0, elevationChange)
            });
        }

        return allSegments;
    }, [FRONTEND_SEGMENT_COUNT, getGradientDifficulty]);

    // Create efficient visual segments (fewer datasets for performance)
    const createVisualSegments = useCallback((allSegments: any[], trailData: Trail) => {
        const distances = trailData.cumulative_distances_m;
        const elevations = trailData.elevations;
        const visualDatasets = [];

        // Group segments by difficulty for visual representation
        const segmentGroups: { [key: string]: any[] } = {};
        allSegments.forEach(segment => {
            const key = segment.difficulty.level;
            if (!segmentGroups[key]) segmentGroups[key] = [];
            segmentGroups[key].push(segment);
        });

        // Create datasets for each difficulty group
        Object.entries(segmentGroups).forEach(([difficultyLevel, segments]) => {
            const difficulty = segments[0].difficulty;

            const segmentData = distances.map((distance, index) => {
                // Check if this point belongs to any segment in this difficulty group
                const belongsToGroup = segments.some(segment => {
                    if (index >= segment.startIndex - 1 && index <= segment.endIndex) {
                        return true;
                    }

                    if (index >= segment.startIndex && index <= segment.endIndex) {
                        return true;
                    }
                } 
                );

                return belongsToGroup ? elevations[index] : null;
            });

            visualDatasets.push({
                label: `${difficultyLevel} Segments`,
                data: segmentData,
                backgroundColor: difficulty.color,
                borderColor: difficulty.color.replace('0.3', '0.8'),
                borderWidth: 0,
                pointRadius: 0,
                fill: 'origin',
                order: 2,
            });
        });

        return visualDatasets;
    }, []);

    // Fallback function for when backend segment data is not available
    const calculateFallbackSegments = useCallback((trailData: Trail) => {
        const segments = [];
        const distances = trailData.cumulative_distances_m;
        const elevations = trailData.elevations;
        const numSegments = FRONTEND_SEGMENT_COUNT;
        const segmentLength = trailData.total_distance_m / numSegments;

        for (let i = 0; i < numSegments; i++) {
            const startDistance = i * segmentLength;
            const endDistance = (i + 1) * segmentLength;

            // Find indices for this segment with improved logic
            let startIndex = 0;
            let endIndex = distances.length - 1; // Default to last index for final segment

            // Find the first point at or after startDistance
            for (let j = 0; j < distances.length; j++) {
                if (distances[j] >= startDistance) {
                    startIndex = j;
                    break;
                }
            }

            // For the last segment, include all remaining points
            if (i === numSegments - 1) {
                endIndex = distances.length - 1;
            } else {
                // Find the last point at or before endDistance
                for (let j = distances.length - 1; j >= 0; j--) {
                    if (distances[j] <= endDistance) {
                        endIndex = j;
                        break;
                    }
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
                borderColor: difficulty.color.replace("0.3", "0.8"),
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
    }, [FRONTEND_SEGMENT_COUNT, getGradientDifficulty]);

    // Function to create gradient segments using backend data
    const calculateGradientSegments = useCallback((trailData: Trail) => {
        // Always use efficient calculation for many segments
        if (FRONTEND_SEGMENT_COUNT > MAX_DATASETS || FORCE_FRONTEND_SEGMENTS) {
            const allSegments = calculateAllSegments(trailData);
            
            // Store segments for tooltip use
            (window as any).currentSegments = allSegments;
            
            return createVisualSegments(allSegments, trailData);
        }

        // Use original method for small number of segments
        if (!trailData.segment_stats || !trailData.segment_x_positions) {
            console.warn('Backend segment data not available, using fallback calculation');
            return calculateFallbackSegments(trailData);
        }

        const segments = [];
        const distances = trailData.cumulative_distances_m;
        const elevations = trailData.elevations;

        for (let i = 0; i < trailData.segment_stats.length; i++) {
            const stat = trailData.segment_stats[i];
            const difficulty = getGradientDifficulty(stat.grade);
            
            // Find start and end positions for this segment
            const startDistance = i === 0 ? 0 : trailData.segment_x_positions[i - 1] * 1000;
            const endDistance = trailData.segment_x_positions[i] * 1000;
            
            // Find corresponding indices in the main data with improved logic
            let startIndex = 0;
            let endIndex = distances.length - 1; // Default to last index for final segment
            
            // Find the first point at or after startDistance
            for (let j = 0; j < distances.length; j++) {
                if (distances[j] >= startDistance) {
                    startIndex = j;
                    break;
                }
            }
            
            // Find the last point at or before endDistance (except for last segment)
            if (i < trailData.segment_stats.length - 1) {
                for (let j = distances.length - 1; j >= 0; j--) {
                    if (distances[j] <= endDistance) {
                        endIndex = j;
                        break;
                    }
                }
            }
            
            // Create data points for this segment
            const segmentData = distances.map((distance, index) => {
                if (index >= startIndex && index <= endIndex) {
                    return elevations[index];
                }
                return null;
            });

            segments.push({
                label: `${difficulty.level} (${(stat.grade * 100).toFixed(1)}%)`,
                data: segmentData,
                backgroundColor: difficulty.color,
                borderColor: difficulty.color.replace('0.3', '0.8'),
                borderWidth: 0,
                pointRadius: 0,
                fill: 'origin',
                order: 2,
                gradient: stat.grade,
                startDistance: startDistance,
                endDistance: endDistance,
                elevationGain: stat.gain
            });
        }

        return segments;
    }, [FRONTEND_SEGMENT_COUNT, MAX_DATASETS, FORCE_FRONTEND_SEGMENTS, calculateAllSegments, createVisualSegments, calculateFallbackSegments, getGradientDifficulty]);

    // Efficient function to get current segment info for tooltip
    const getCurrentSegmentInfo = (currentDistance: number) => {
        const allSegments = (window as any).currentSegments;
        if (!allSegments) return null;

        // Binary search or linear search for the segment containing currentDistance
        for (const segment of allSegments) {
            if (currentDistance >= segment.startDistance && currentDistance <= segment.endDistance) {
                return {
                    gradient: segment.gradient,
                    elevationGain: segment.elevationGain,
                    startDistance: segment.startDistance,
                    endDistance: segment.endDistance
                };
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
    }, [trailData, calculateGradientSegments]);

    // useMemo to preserve options unless trailData changes
    const options = useMemo(() => {
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
            transitions: {
                zoom: {
                    animation: {
                        duration: 0,
                    },
                },
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
                        title: (
                            context: import("chart.js").TooltipItem<"line">[],
                        ) => {
                            return ""; // Hide title
                        },
                        beforeBody: (
                            context: import("chart.js").TooltipItem<"line">[],
                        ) => {
                            // Custom tooltip options
                            const dataPoint = context[0].parsed as {
                                x: number;
                                y: number;
                            };
                            const lines = [
                                `Distance: ${(dataPoint.x / 1000).toFixed(2)} km`,
                                `Distance: ${dataPoint.x.toFixed(2)} m`,
                                `Elevation: ${dataPoint.y.toFixed(2)} m`,
                            ];

                            // Add gradient information if available
                            const currentSegment = getCurrentSegmentInfo(
                                dataPoint.x,
                            );
                            if (currentSegment) {
                                const difficulty = getGradientDifficulty(
                                    currentSegment.gradient,
                                );
                                lines.push(
                                    `Gradient: ${(currentSegment.gradient * 100).toFixed(1)}%`,
                                );
                                lines.push(`Difficulty: ${difficulty.level}`);
                                lines.push(
                                    `Elevation Gain: ${currentSegment.elevationGain.toFixed(1)}m`,
                                );
                            }

                            return lines;
                        },
                        label: (
                            context: import("chart.js").TooltipItem<"line">,
                        ) => {
                            return ""; // Hide label
                        },
                    },
                    position: "nearest",
                    caretPadding: 30,
                    caretSize: 0,
                    yAlign: "center",
                    xAlign: "right",
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x" as const,
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: "x" as const,
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
    }, [calculateGradientSegments, prevPoint, setPointIndex, trailData]);

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
                    <Line data={chartData} options={options} ref={chartRef} />
                    {trailData && 
                        ((trailData.segment_stats && trailData.segment_stats.length > 0) || 
                         (trailData.elevations && trailData.elevations.length > 0)) && (
                            <div className="mt-4 mb-4 p-3 bg-background rounded-lg">
                                <h4 className="text-sm font-medium mb-2">
                                    Gradient Difficulty Legend
                                </h4>
                                <div className="flex flex-wrap gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{
                                                backgroundColor:
                                                    "rgba(34, 197, 94, 0.6)",
                                            }}
                                        ></div>
                                        <span>Easy (&lt;5%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{
                                                backgroundColor:
                                                    "rgba(234, 179, 8, 0.6)",
                                            }}
                                        ></div>
                                        <span>Moderate (5-10%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{
                                                backgroundColor:
                                                    "rgba(249, 115, 22, 0.6)",
                                            }}
                                        ></div>
                                        <span>Hard (10-15%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{
                                                backgroundColor:
                                                    "rgba(239, 68, 68, 0.6)",
                                            }}
                                        ></div>
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
