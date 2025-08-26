import { useEffect, useState } from "react";
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

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

// A custom tool tip display
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="brightness-110 p-5 bg-primary border border-secondary rounded-lg shadow-xl">
        <p>{`Distance: ${label.toFixed(2)} m`}</p> 
        <p>{`Elevation: ${payload[0].value.toFixed(2)} m`}</p>
      </div>
    );
  }

  return null;
};

export default function ChartViewer({trailData}) {
    const [chartData, setChartData] = useState<Array<DataPoint>>([]);

    // Check if trail data has changed
    useEffect(() => {
        if (trailData) {
            try {
                setChartData(
                    trailData.cumulative_distances_m.map(
                        (distance: number, index: number) => ({
                            distance: distance,
                            elevation: trailData.elevations[index],
                        }),
                    ),
                );
                if (!chartData) {
                    throw new Error("Chart is empty");
                }
            } catch (error) {
                console.error(`Chart creation failed: ${error}`);
            }
        }
    }, [trailData]);

    return (
        <div className="container">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={400}
                    data={chartData}
                    className="p-2"
                    margin={{ top: 0, right: 0, bottom: 20, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="distance">
                        <Label
                            value="Distance (m)"
                            position="bottom"
                            style={{ textAnchor: "middle" }}
                        />
                    </XAxis>
                    <YAxis type="number">
                        <Label
                            value="Elevation (m)"
                            position="left"
                            angle={-90}
                            style={{ textAnchor: "middle" }}
                        />
                    </YAxis>
                    <Tooltip content={CustomTooltip}/>
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="elevation"
                        stroke="#69a742"
                        activeDot={{ r: 3 }}
                        dot={false}
                        legendType="none"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
