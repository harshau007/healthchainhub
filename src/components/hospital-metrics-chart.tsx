"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { HospitalMetrics } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface HospitalMetricsChartProps {
  metrics: HospitalMetrics;
}

export function HospitalMetricsChart({ metrics }: HospitalMetricsChartProps) {
  const data = [
    {
      name: "Bed Occupancy",
      value: metrics.bedOccupancyRate,
      fill: "var(--color-bed)",
    },
    {
      name: "ICU Occupancy",
      value: metrics.icuOccupancyRate,
      fill: "var(--color-icu)",
    },
    {
      name: "Wait Time",
      value: metrics.averageWaitTime,
      fill: "var(--color-wait)",
    },
    {
      name: "Emergency",
      value: metrics.emergencyResponseTime,
      fill: "var(--color-emergency)",
    },
  ];

  return (
    <ChartContainer
      config={{
        bed: {
          label: "Bed Occupancy",
          color: "hsl(221, 83%, 53%)", // blue-500
        },
        icu: {
          label: "ICU Occupancy",
          color: "hsl(45, 93%, 47%)", // amber-500
        },
        wait: {
          label: "Wait Time",
          color: "hsl(142, 71%, 45%)", // green-500
        },
        emergency: {
          label: "Emergency Response",
          color: "hsl(280, 67%, 63%)", // purple-500
        },
      }}
      className="h-full w-full"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
