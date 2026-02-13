"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blockchainClient } from "@/lib/blockchain/client";
import { useAuth } from "@/providers/auth-provider";
import { DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";
import { Invoice } from "@/lib/blockchain/types";
import { Badge } from "@/components/ui/badge";
import { useSimulation } from "@/components/blockchain/simulation-provider";

export function InvoiceManager() {
    const { address, role } = useAuth();
    const { sendTransaction } = useSimulation();
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    // Create Invoice State (Doctor only)
    const [targetPatient, setTargetPatient] = useState("");
    const [amount, setAmount] = useState("");
    const [service, setService] = useState("");
    const [creating, setCreating] = useState(false);

    const loadInvoices = useCallback(async () => {
        if (!address) return;
        try {
            const list = await blockchainClient.getInvoices(address);
            setInvoices(list.sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) {
            console.error(e);
        }
    }, [address]);

    useEffect(() => {
        if (address) loadInvoices();
    }, [address, loadInvoices]);

    const handleCreateInvoice = async () => {
        if (!address || !targetPatient || !amount || !service) return;
        setCreating(true);
        try {
            await blockchainClient.createInvoice(address, targetPatient, amount, service);
            toast.success("Invoice created");
            setTargetPatient("");
            setAmount("");
            setService("");
            loadInvoices();
        } catch (e: any) {
            toast.error(e.message || "Failed to create invoice");
        } finally {
            setCreating(false);
        }
    };

    const handlePay = async (inv: Invoice) => {
        try {
            await sendTransaction(
                () => blockchainClient.payInvoice(inv.id),
                {
                    to: inv.provider,
                    amount: inv.amount,
                    functionName: "PAY INVOICE"
                }
            );
            toast.success("Invoice Paid!");
            loadInvoices();
        } catch (e: any) {
            toast.error(e.message || "Payment failed");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payments & Invoices
                </CardTitle>
                <CardDescription>
                    {role === "Doctor" ? "Manage patient billing" : "View and pay medical bills"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {role === "Doctor" && (
                    <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                        <h4 className="font-medium text-sm">Create New Invoice</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input placeholder="Patient Address (0x...)" value={targetPatient} onChange={e => setTargetPatient(e.target.value)} />
                            <Input placeholder="Amount (ETH)" value={amount} onChange={e => setAmount(e.target.value)} />
                            <Input className="md:col-span-2" placeholder="Service Description (e.g. Consultation)" value={service} onChange={e => setService(e.target.value)} />
                        </div>
                        <Button onClick={handleCreateInvoice} disabled={creating || !targetPatient}>
                            <Plus className="w-4 h-4 mr-2" /> Create Invoice
                        </Button>
                    </div>
                )}

                <div className="space-y-3">
                    <h4 className="font-medium text-sm">Invoice History</h4>
                    {invoices.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-4">No invoices found</div>
                    ) : (
                        invoices.map(inv => (
                            <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                                <div>
                                    <div className="font-medium">{inv.service}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {role === "Doctor" ? `Patient: ${inv.patient.substring(0, 6)}...` : `Provider: ${inv.provider.substring(0, 6)}...`}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{new Date(inv.timestamp).toLocaleDateString()}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="font-bold">{inv.amount} ETH</div>
                                    {inv.status === "Pending" ? (
                                        role === "Patient" ? (
                                            <Button size="sm" onClick={() => handlePay(inv)}>Pay Now</Button>
                                        ) : (
                                            <Badge variant="outline">Unpaid</Badge>
                                        )
                                    ) : (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Paid
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
