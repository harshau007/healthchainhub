"use client";

import { HospitalMetricsSection } from "@/components/hospital-metrics-section";
import { PatientsList } from "@/components/patients-list";
import { useDataStore } from "@/lib/store";
import { DashboardSkeleton } from "./dashboard-skeleton";

export default function Dashboard() {
  const { data } = useDataStore();

  if (!data) {
    return <DashboardSkeleton />;
  }

  const patientsToShow =
    data.patients.length > 3 ? data.patients.slice(0, 3) : data.patients;

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold md:text-3xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
          Hospital Dashboard
        </h1>
      </div>
      <HospitalMetricsSection metrics={data.hospitalMetrics} />
      <PatientsList patients={patientsToShow} />
    </div>
  );
}
