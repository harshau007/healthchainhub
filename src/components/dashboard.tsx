"use client";

import { HospitalMetricsSection } from "@/components/hospital-metrics-section";
import { PatientsList } from "@/components/patients-list";
import { useDataStore } from "@/lib/store";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState } from "react";
import { blockchainClient } from "@/lib/blockchain/client";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";


export default function Dashboard() {
  const { data } = useDataStore();
  const { address: doctorAddress } = useAuth();

  const [consentedPatients, setConsentedPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsentedPatients() {
      if (!data || !doctorAddress) return;

      const authorized = [];
      // In a real app, we'd query "getPatientsWithConsent" from indexer.
      // Here we iterate all mock patients and check on-chain consent.
      for (const p of data.patients) {
        // We assume the mock patient ID in store is compatible or we use a mapping.
        // For simulation, let's assume one of the patients matches our demo patient address
        // OR we just use their ID if it looks like an address.
        // Let's rely on a specific field or just check the known demo patient address "0x257..."
        // matching the mock patient "P001" for example.

        // Simplified: Check if we have consent from the Demo Patient Address
        // In a real scenario, the patient object should have a wallet address field.
        // Let's tentatively map the first patient to our Demo Patient.
        const pAddress = p.id === "1" ? "0x257f01d8a0d459def4cb0fa69a2cd7241d9568bc" : p.id;

        try {
          const has = await blockchainClient.hasConsent(pAddress, doctorAddress);
          if (has) {
            authorized.push(p);
          }
        } catch {
          // ignore invalid addresses
        }
      }
      setConsentedPatients(authorized);
      setLoading(false);
    }

    fetchConsentedPatients();
  }, [data, doctorAddress]);



  if (!data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your authorized patients and hospital metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Lock className="w-3 h-3" />
          <span>Secure Access Mode</span>
        </div>
      </div>

      <HospitalMetricsSection metrics={data.hospitalMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              My Patients
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{consentedPatients.length}</span>
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />)}
            </div>
          ) : consentedPatients.length > 0 ? (
            <PatientsList patients={consentedPatients} />
          ) : (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg">No Authorized Patients</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  You can only view patients who have explicitly granted you consent via their blockchain wallet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">


          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Did you know?</h3>
              <p className="text-blue-100 text-sm">
                All patient data access is inversely verifiable on the HealthChainHub blockchain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
