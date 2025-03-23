"use client";

import { PatientDetailsSkeleton } from "@/components/patient-details-skeleton";
import { PatientsList } from "@/components/patients-list";
import { useDataStore } from "@/lib/store";

export default function Page() {
  const { data } = useDataStore();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!data ? (
        <PatientDetailsSkeleton />
      ) : (
        <PatientsList patients={data.patients} />
      )}
    </div>
  );
}
