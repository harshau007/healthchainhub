"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface RealTimeAnalyticsChartProps {
  timeRange: string;
}

export function RealTimeAnalyticsChart({
  timeRange,
}: RealTimeAnalyticsChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate data based on time range
    const generateData = () => {
      const dataPoints =
        timeRange === "1h"
          ? 60
          : timeRange === "24h"
          ? 24
          : timeRange === "7d"
          ? 7
          : 30;

      const newData = [];
      for (let i = 0; i < dataPoints; i++) {
        const baseValue = 100;
        newData.push({
          name:
            timeRange === "1h"
              ? `${i}m`
              : timeRange === "24h"
              ? `${i}h`
              : `Day ${i + 1}`,
          responseTime: Math.floor(baseValue * 0.12 + Math.random() * 10),
          throughput: Math.floor(baseValue * 1.2 + Math.random() * 50),
          cpuUsage: Math.floor(baseValue * 0.4 + Math.random() * 20),
          memoryUsage: Math.floor(baseValue * 0.35 + Math.random() * 15),
        });
      }
      return newData;
    };

    setData(generateData());
  }, [timeRange]);

  return (
    <div className="w-full h-full">
      <ChartContainer config={{}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs text-muted-foreground" />
            <YAxis className="text-xs text-muted-foreground" />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="font-medium">{label}</div>
                      <div className="flex flex-col gap-0.5">
                        {payload.map((entry) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-1">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {entry.name}:
                              </span>
                            </div>
                            <span className="font-medium">
                              {entry.value}
                              {entry.name === "responseTime"
                                ? "ms"
                                : entry.name === "throughput"
                                ? "MB/s"
                                : "%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Response Time (ms)"
            />
            <Line
              type="monotone"
              dataKey="throughput"
              stroke="#10b981"
              strokeWidth={2}
              name="Throughput (MB/s)"
            />
            <Line
              type="monotone"
              dataKey="cpuUsage"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="CPU Usage (%)"
            />
            <Line
              type="monotone"
              dataKey="memoryUsage"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Memory Usage (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
