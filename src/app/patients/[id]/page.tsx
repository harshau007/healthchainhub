import { BackButton } from "@/components/back-button";
import { PatientDetailsPage } from "@/components/patient-details-page";
import { PatientDetailsSkeleton } from "@/components/patient-details-skeleton";
import { Suspense } from "react";

type PatientPageProps = Promise<{
  id: string;
}>;

export default async function PatientPage(props: { params: PatientPageProps }) {
  const { id } = await props.params;
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <BackButton label="Back" />
        <Suspense fallback={<PatientDetailsSkeleton />}>
          <PatientDetailsPage patientId={id} />
        </Suspense>
      </div>
    </main>
  );
}
