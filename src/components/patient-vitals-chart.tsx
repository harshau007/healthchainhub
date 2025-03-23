"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Patient } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface PatientVitalsChartProps {
  patient: Patient;
}

export function PatientVitalsChart({ patient }: PatientVitalsChartProps) {
  const data = [
    {
      name: "Heart Rate",
      value: patient.vitalSigns.heartRate,
      fill: "var(--color-heart)",
    },
    {
      name: "Temperature",
      value: patient.vitalSigns.temperature * 10, // Scale for visibility
      fill: "var(--color-temp)",
    },
    {
      name: "Respiratory",
      value: patient.vitalSigns.respiratoryRate,
      fill: "var(--color-resp)",
    },
    {
      name: "O2 Saturation",
      value: patient.vitalSigns.oxygenSaturation,
      fill: "var(--color-oxygen)",
    },
  ];

  return (
    <ChartContainer
      config={{
        heart: {
          label: "Heart Rate",
          color: "hsl(0, 84%, 60%)", // red-500
        },
        temp: {
          label: "Temperature",
          color: "hsl(45, 93%, 47%)", // amber-500
        },
        resp: {
          label: "Respiratory Rate",
          color: "hsl(262, 83%, 58%)", // purple-500
        },
        oxygen: {
          label: "Oxygen Saturation",
          color: "hsl(221, 83%, 53%)", // blue-500
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
