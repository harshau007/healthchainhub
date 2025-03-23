"use client";

import { PatientCard } from "@/components/patient-card";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PatientsListProps {
  patients: Patient[];
}

export function PatientsList({ patients }: PatientsListProps) {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Patients Overview</h2>
        <Link href="/patients">
          <Button variant="outline" size="sm" className="gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
