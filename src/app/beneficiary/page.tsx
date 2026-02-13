"use client";

import { BeneficiaryCard } from "@/components/beneficiary-card";
import { useAuth } from "@/providers/auth-provider";
import { Redirect } from "@/components/redirect";

export default function BeneficiaryPage() {
    const { role, loggedIn } = useAuth();

    if (!loggedIn) {
        return <Redirect to="/" />;
    }

    if (role !== "Patient") {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    Access Denied. Only patients can manage beneficiaries.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Manage Beneficiary</h1>
            <BeneficiaryCard />
        </div>
    );
}
