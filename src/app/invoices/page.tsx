"use client";

import { InvoiceManager } from "@/components/invoice-manager";
import { useAuth } from "@/providers/auth-provider";
import { Redirect } from "@/components/redirect";

export default function InvoicesPage() {
    const { loggedIn } = useAuth();

    if (!loggedIn) {
        return <Redirect to="/" />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Invoices & Payments</h1>
            <InvoiceManager />
        </div>
    );
}
