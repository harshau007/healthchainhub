"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface PredictiveAnalyticsChartProps {
  timeRange: string;
}

export function PredictiveAnalyticsChart({
  timeRange,
}: PredictiveAnalyticsChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate data based on time range
    const generateData = () => {
      const dataPoints =
        timeRange === "1h"
          ? 12
          : timeRange === "24h"
          ? 24
          : timeRange === "7d"
          ? 7
          : 30;

      const newData = [];

      // Historical data
      for (let i = 0; i < dataPoints; i++) {
        newData.push({
          name:
            timeRange === "1h"
              ? `${i * 5}m`
              : timeRange === "24h"
              ? `${i}h`
              : `Day ${i + 1}`,
          readmissionRate: 12 + Math.random() * 4,
          resourceUtilization: 80 + Math.random() * 10,
          treatmentEfficacy: 90 + Math.random() * 5,
          type: "historical",
        });
      }

      // Predictive data (next 30% of time range)
      const predictionPoints = Math.max(3, Math.floor(dataPoints * 0.3));
      const lastHistorical = newData[newData.length - 1];

      for (let i = 1; i <= predictionPoints; i++) {
        const trend = Math.random() > 0.5 ? 1 : -1;
        newData.push({
          name:
            timeRange === "1h"
              ? `${(dataPoints + i) * 5}m`
              : timeRange === "24h"
              ? `+${i}h`
              : `+Day ${i}`,
          readmissionRate:
            lastHistorical.readmissionRate + trend * Math.random() * 2,
          resourceUtilization: Math.min(
            100,
            lastHistorical.resourceUtilization + trend * Math.random() * 5
          ),
          treatmentEfficacy: Math.min(
            100,
            lastHistorical.treatmentEfficacy + trend * Math.random() * 2
          ),
          type: "prediction",
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
          <AreaChart
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
                  const isPrediction = payload[0].payload.type === "prediction";
                  return (
                    <ChartTooltipContent>
                      <div className="font-medium">
                        {label} {isPrediction && "(Predicted)"}
                      </div>
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
                            <span className="font-medium">{entry.value}%</span>
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
            <defs>
              <linearGradient id="colorReadmission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorResource" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTreatment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="readmissionRate"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReadmission)"
              name="Readmission Rate"
              strokeDasharray="dash"
            />
            <Area
              type="monotone"
              dataKey="resourceUtilization"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorResource)"
              name="Resource Utilization"
              strokeDasharray="dash"
            />
            <Area
              type="monotone"
              dataKey="treatmentEfficacy"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTreatment)"
              name="Treatment Efficacy"
              strokeDasharray="dash"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
