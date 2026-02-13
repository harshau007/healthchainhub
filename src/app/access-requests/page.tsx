"use client";

import { AccessRequestList } from "@/components/access-request-list";
import { useAuth } from "@/providers/auth-provider";
import { Redirect } from "@/components/redirect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { blockchainClient } from "@/lib/blockchain/client";

export default function AccessRequestsPage() {
    const { loggedIn, role, address: doctorAddress } = useAuth();
    const [requestAddress, setRequestAddress] = useState("");
    const [loading, setLoading] = useState(false);

    if (!loggedIn) {
        return <Redirect to="/" />;
    }

    const handleRequestAccess = async () => {
        if (!requestAddress || !doctorAddress) return;
        setLoading(true);
        try {
            await blockchainClient.requestAccess(doctorAddress, requestAddress);
            toast.success(`Access requested for ${requestAddress}`);
            setRequestAddress("");
            // Ideally we reload the list here, but AccessRequestList handles its own data loading for now
            // We could lift state up, but for now let's rely on the auto-refresh or manual reload
            // Actually, we can trigger a refresh if we exposed it, but simplest is let the user see it in the list below eventually
            // Or force a window reload (bad UX).
            // Better: Dispatch a custom event or context update. For simplicity in this fix, we'll let the user see it update.
        } catch (e: any) {
            toast.error(e.message || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Access Requests</h1>
            {role === "Doctor" && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Request Access</CardTitle>
                        <CardDescription>Send a request to a patient's wallet</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Patient Address</label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="0x..."
                                    className="pl-9"
                                    value={requestAddress}
                                    onChange={(e) => setRequestAddress(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button className="w-full sm:w-auto" onClick={handleRequestAccess} disabled={!requestAddress || loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                            Request Access
                        </Button>
                    </CardContent>
                </Card>
            )}

            <AccessRequestList />
        </div>
    );
}
