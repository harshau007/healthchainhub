import { HospitalMetricsChart } from "@/components/hospital-metrics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HospitalMetrics } from "@/lib/types";
import { BedIcon, Clock, DollarSign, Stethoscope, Users } from "lucide-react";

interface HospitalMetricsSectionProps {
  metrics: HospitalMetrics;
}

export function HospitalMetricsSection({
  metrics,
}: HospitalMetricsSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Hospital Metrics</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <BedIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.bedOccupancyRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              ICU: {metrics.icuOccupancyRate}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageWaitTime} min
            </div>
            <p className="text-xs text-muted-foreground">
              Emergency: {metrics.emergencyResponseTime} min
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 dark:border-l-green-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalPatientsAdmitted}
            </div>
            <p className="text-xs text-muted-foreground">
              Appointments: {metrics.totalAppointments}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.billingSummary.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending: ${metrics.billingSummary.pendingBills.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="col-span-1 overflow-hidden border-t-4 border-t-indigo-500 dark:border-t-indigo-400">
          <CardHeader>
            <CardTitle>Hospital Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <HospitalMetricsChart metrics={metrics} />
          </CardContent>
        </Card>

        <Card className="col-span-1 overflow-hidden border-t-4 border-t-rose-500 dark:border-t-rose-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Staff Overview</CardTitle>
            <Stethoscope className="h-4 w-4 text-rose-500 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Staff to Patient Ratio</p>
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
      </div>
    </section>
  );
}
