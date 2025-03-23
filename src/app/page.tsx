import Dashboard from "@/components/dashboard";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
