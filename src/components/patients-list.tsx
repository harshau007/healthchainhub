"use client";

import { PatientCard } from "@/components/patient-card";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BackButton } from "./back-button";

interface PatientsListProps {
  patients: Patient[];
}

export function PatientsList({ patients }: PatientsListProps) {
  const pathname = usePathname();
  const isPatientsPage = pathname.startsWith("/patients");

  return (
    <section className="space-y-6">
      {isPatientsPage && (
        <div className="px-4 sm:px-6 lg:px-8">
          <BackButton label="Back to Dashboard" />
        </div>
      )}

      <header className="flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Patients Overview</h2>
        {!isPatientsPage && (
          <Link href="/patients">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 hover:cursor-pointer"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
        {patients.map((patient) => (
          <Link
            key={patient.id}
            href={`/patients/${patient.id}`}
            className="block"
          >
            <PatientCard patient={patient} />
          </Link>
        ))}
      </div>
    </section>
  );
}
