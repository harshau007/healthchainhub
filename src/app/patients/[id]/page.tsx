import { BackButton } from "@/components/back-button";
import { PatientDetailsPage } from "@/components/patient-details-page";
import { PatientDetailsSkeleton } from "@/components/patient-details-skeleton";
import { Suspense } from "react";

interface PatientPageProps {
  params: {
    id: string;
  };
}

export default function PatientPage({ params }: PatientPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <BackButton href="/" label="Back to Dashboard" />
        <Suspense fallback={<PatientDetailsSkeleton />}>
          <PatientDetailsPage patientId={Number.parseInt(params.id)} />
        </Suspense>
      </div>
    </main>
  );
}
