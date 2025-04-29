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

export function SystemHealthChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate sample data
    const generateData = () => {
      const newData = [];
      for (let i = 0; i < 24; i++) {
        newData.push({
          name: `${i}h`,
          systemHealth: 95 + Math.random() * 5,
          blockchainStatus: 98 + Math.random() * 2,
          fogNodePerformance: 90 + Math.random() * 8,
          networkLatency: 15 + Math.random() * 10,
        });
      }
      return newData;
    };

    setData(generateData());
  }, []);

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
            <YAxis
              className="text-xs text-muted-foreground"
              domain={[0, 100]}
            />
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
                              {entry.name === "networkLatency"
                                ? `${entry.value}ms`
                                : `${entry.value}%`}
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
              dataKey="systemHealth"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="System Health"
            />
            <Line
              type="monotone"
              dataKey="blockchainStatus"
              stroke="#10b981"
              strokeWidth={2}
              name="Blockchain Status"
            />
            <Line
              type="monotone"
              dataKey="fogNodePerformance"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Fog Node Performance"
            />
            <Line
              type="monotone"
              dataKey="networkLatency"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Network Latency (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
