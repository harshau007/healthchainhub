"use client";
import Dashboard from "@/components/dashboard";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { Suspense } from "react";

export default function Home() {
  const { role } = useAuth();
  return (
    <main className="min-h-screen bg-background">
      {role === "Doctor" && (
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      )}
    </main>
  );
}
