"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blockchainClient } from "@/lib/blockchain/client";
import { useAuth } from "@/providers/auth-provider";
import { Users, Check } from "lucide-react";
import { toast } from "sonner";

export function BeneficiaryCard() {
    const { address } = useAuth();
    const [beneficiary, setBeneficiary] = useState<string>("");
    const [newBeneficiary, setNewBeneficiary] = useState("");
    const [loading, setLoading] = useState(false);

    const loadBeneficiary = useCallback(async () => {
        if (!address) return;
        try {
            const b = await blockchainClient.getBeneficiary(address);
            if (b && b !== "0x0000000000000000000000000000000000000000") {
                setBeneficiary(b);
            }
        } catch (e) {
            console.error(e);
        }
    }, [address]);

    useEffect(() => {
        if (address) {
            loadBeneficiary();
        }
    }, [address, loadBeneficiary]);

    const handleAdd = async () => {
        if (!newBeneficiary || !address) return;
        setLoading(true);
        try {
            await blockchainClient.addBeneficiary(address, newBeneficiary);
            setBeneficiary(newBeneficiary);
            setNewBeneficiary("");
            toast.success("Beneficiary added successfully");
        } catch (e: any) {
            toast.error(e.message || "Failed to add beneficiary");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Trusted Beneficiary
                </CardTitle>
                <CardDescription>
                    Delegate access to a trusted family member or agent
                </CardDescription>
            </CardHeader>
            <CardContent>
                {beneficiary ? (
                    <div className="p-3 bg-muted/50 rounded-lg border flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <Check className="h-5 w-5" />
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-medium">Active Beneficiary</div>
                            <div className="text-xs text-muted-foreground font-mono truncate">
                                {beneficiary}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Beneficiary Address</label>
                            <Input
                                placeholder="0x..."
                                value={newBeneficiary}
                                onChange={(e) => setNewBeneficiary(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleAdd} disabled={loading || !newBeneficiary}>
                            {loading ? "Adding..." : "Add Beneficiary"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
