"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Patient } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface PatientLabResultsChartProps {
  patient: Patient;
}

export function PatientLabResultsChart({
  patient,
}: PatientLabResultsChartProps) {
  const data = [
    {
      name: "Blood Sugar",
      value: patient.EHR.labResults.bloodSugar,
      fill: "var(--color-sugar)",
    },
    {
      name: "Cholesterol",
      value: patient.EHR.labResults.cholesterol,
      fill: "var(--color-chol)",
    },
    {
      name: "Hemoglobin",
      value: patient.EHR.labResults.hemoglobin * 10, // Scale for visibility
      fill: "var(--color-hemo)",
    },
    {
      name: "WBC",
      value: patient.EHR.labResults.whiteBloodCellCount / 100, // Scale for visibility
      fill: "var(--color-wbc)",
    },
  ];

  return (
    <ChartContainer
      config={{
        sugar: {
          label: "Blood Sugar",
          color: "hsl(20, 90%, 50%)", // orange-500
        },
        chol: {
          label: "Cholesterol",
          color: "hsl(142, 71%, 45%)", // green-500
        },
        hemo: {
          label: "Hemoglobin",
          color: "hsl(0, 84%, 60%)", // red-500
        },
        wbc: {
          label: "WBC Count",
          color: "hsl(199, 89%, 48%)", // sky-500
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
