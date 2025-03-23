"use client";

import { HospitalMetricsChart } from "@/components/hospital-metrics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HospitalMetrics } from "@/lib/types";
import { BedIcon, Clock, DollarSign, Stethoscope, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createSwapy } from "swapy";

interface HospitalMetricsSectionProps {
  metrics: HospitalMetrics;
}

interface DashboardItem {
  id: string;
  slotType: "metric" | "graph";
}

const slotTypes: ("metric" | "graph")[] = [
  "metric",
  "metric",
  "metric",
  "metric",
  "graph",
  "graph",
];

export function HospitalMetricsSection({
  metrics,
}: HospitalMetricsSectionProps) {
  const [items, setItems] = useState<DashboardItem[]>([
    { id: "bedOccupancy", slotType: "metric" },
    { id: "waitTime", slotType: "metric" },
    { id: "patients", slotType: "metric" },
    { id: "revenue", slotType: "metric" },
    { id: "hospitalPerformance", slotType: "graph" },
    { id: "staffOverview", slotType: "graph" },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const swapyRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {});
      swapyRef.current.onSwap((event: any) => {
        const { sourceIndex, destinationIndex } = event;
        setItems((prevItems) => {
          const updated = [...prevItems];
          const [removed] = updated.splice(sourceIndex, 1);
          updated.splice(destinationIndex, 0, removed);
          return updated.map((item, idx) => ({
            ...item,
            slotType: slotTypes[idx],
          }));
        });
      });
    }
    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  const getContent = (id: string, slotType: "metric" | "graph") => {
    switch (id) {
      case "bedOccupancy":
        return slotType === "metric" ? (
          <Card className="flex flex-col h-full border-l-4 border-l-blue-500 dark:border-l-blue-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Bed Occupancy
              </CardTitle>
              <BedIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">
                {metrics.bedOccupancyRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                ICU: {metrics.icuOccupancyRate}%
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col h-full overflow-hidden border-t-4 border-t-blue-500 dark:border-t-blue-400">
            <CardHeader>
              <CardTitle>Bed Occupancy</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full">
                <HospitalMetricsChart metrics={metrics} />
              </div>
            </CardContent>
          </Card>
        );

      case "waitTime":
        return slotType === "metric" ? (
          <Card className="flex flex-col h-full border-l-4 border-l-amber-500 dark:border-l-amber-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">
                {metrics.averageWaitTime} min
              </div>
              <p className="text-xs text-muted-foreground">
                Emergency: {metrics.emergencyResponseTime} min
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col h-full overflow-hidden border-t-4 border-t-amber-500 dark:border-t-amber-400">
            <CardHeader>
              <CardTitle>Wait Time</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full">
                <HospitalMetricsChart metrics={metrics} />
              </div>
            </CardContent>
          </Card>
        );

      case "patients":
        return slotType === "metric" ? (
          <Card className="flex flex-col h-full border-l-4 border-l-green-500 dark:border-l-green-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-green-500 dark:text-green-400" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">
                {metrics.totalPatientsAdmitted}
              </div>
              <p className="text-xs text-muted-foreground">
                Appointments: {metrics.totalAppointments}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col h-full overflow-hidden border-t-4 border-t-green-500 dark:border-t-green-400">
            <CardHeader>
              <CardTitle>Patients</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full">
                <HospitalMetricsChart metrics={metrics} />
              </div>
            </CardContent>
          </Card>
        );

      case "revenue":
        return slotType === "metric" ? (
          <Card className="flex flex-col h-full border-l-4 border-l-purple-500 dark:border-l-purple-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500 dark:text-purple-400" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">
                ${metrics.billingSummary.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending: ${metrics.billingSummary.pendingBills.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col h-full overflow-hidden border-t-4 border-t-purple-500 dark:border-t-purple-400">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full">
                <HospitalMetricsChart metrics={metrics} />
              </div>
            </CardContent>
          </Card>
        );

      case "hospitalPerformance":
        return slotType === "graph" ? (
          <Card className="flex flex-col h-full overflow-hidden border-t-4 border-t-indigo-500 dark:border-t-indigo-400">
            <CardHeader>
              <CardTitle>Hospital Performance</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full">
                <HospitalMetricsChart metrics={metrics} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col h-full border-l-4 border-l-indigo-500 dark:border-l-indigo-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Stethoscope className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">85%</div> {/* Placeholder */}
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>
        );

      case "staffOverview":
        return slotType === "graph" ? (
          <Card className="flex flex-col h-full overflow-hidden border-t-4 border-t-rose-500 dark:border-t-rose-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Staff Overview</CardTitle>
              <Stethoscope className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Staff to Patient Ratio
                    </p>
                    <p className="text-sm font-medium">
                      {metrics.staffToPatientRatio}
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-rose-500 dark:bg-rose-400"
                      style={{
                        width: `${Math.min(
                          metrics.staffToPatientRatio * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Bed Occupancy</p>
                    <p className="text-sm font-medium">
                      {metrics.bedOccupancyRate}%
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                      style={{ width: `${metrics.bedOccupancyRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">ICU Occupancy</p>
                    <p className="text-sm font-medium">
                      {metrics.icuOccupancyRate}%
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-amber-500 dark:bg-amber-400"
                      style={{ width: `${metrics.icuOccupancyRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col h-full border-l-4 border-l-rose-500 dark:border-l-rose-400">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Staff Ratio</CardTitle>
              <Stethoscope className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">
                {metrics.staffToPatientRatio}
              </div>
              <p className="text-xs text-muted-foreground">Staff:Patients</p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const getSlotClass = (slotType: "metric" | "graph") => {
    return slotType === "metric" ? "lg:col-span-1" : "lg:col-span-2";
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Hospital Metrics</h2>
      <div
        ref={containerRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-swapy-slot={item.id}
            className={`cursor-move min-h-[300px] ${getSlotClass(
              item.slotType
            )}`}
          >
            <div data-swapy-item={item.id} className="h-full">
              {getContent(item.id, item.slotType)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
