"use client";

import { PatientDetails } from "@/components/patient-details";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDataStore } from "@/lib/store";
import { AlertTriangle } from "lucide-react";
import { PatientDetailsSkeleton } from "./patient-details-skeleton";

interface PatientDetailsPageProps {
  patientId: number;
}

export function PatientDetailsPage({ patientId }: PatientDetailsPageProps) {
  const { data } = useDataStore();

  if (!data) {
    return <PatientDetailsSkeleton />;
  }

  const patient = data.patients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Patient not found</AlertTitle>
        <AlertDescription>
          The patient with ID {patientId} could not be found.
        </AlertDescription>
      </Alert>
    );
  }

  return <PatientDetails patient={patient} />;
}
