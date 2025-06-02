"use client";
import Dashboard from "@/components/dashboard";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import PatientDashboard from "@/components/patient-dashboard";
import { useAuth } from "@/providers/auth-provider";
import { Suspense } from "react";
import { Toaster } from "sonner";

export default function Home() {
  const { role } = useAuth();
  return (
    <main className="min-h-screen bg-background">
      {role === "Doctor" && (
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
          <Toaster richColors />
        </Suspense>
      )}

      {role === "Patient" && (
        <Suspense fallback={<DashboardSkeleton />}>
          <PatientDashboard />
        </Suspense>
      )}
    </main>
  );
}
