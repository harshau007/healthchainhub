"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blockchainClient } from "@/lib/blockchain/client";
import { useAuth } from "@/providers/auth-provider";
import { Bell, Check, X } from "lucide-react";
import { toast } from "sonner";
import { AccessRequest } from "@/lib/blockchain/types";
import { Badge } from "@/components/ui/badge";

export function AccessRequestList() {
    const { address, role } = useAuth();
    const [requests, setRequests] = useState<AccessRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const loadRequests = useCallback(async () => {
        if (!address) return;
        try {
            const reqs = await blockchainClient.getAccessRequests(address);
            // Sort by timestamp desc
            setRequests(reqs.sort((a, b) => b.timestamp - a.timestamp));
        } catch (e) {
            console.error(e);
        }
    }, [address]);

    useEffect(() => {
        if (address) {
            loadRequests();
        }
    }, [address, loadRequests]);

    const handleRespond = async (requestId: string, status: "Approved" | "Rejected") => {
        setLoading(true);
        try {
            await blockchainClient.respondToAccessRequest(requestId, status);
            toast.success(`Request ${status}`);
            loadRequests();
        } catch (e: any) {
            toast.error(e.message || "Action failed");
        } finally {
            setLoading(false);
        }
    };



    // Filter: If I am patient, I see requests TO me. If I am doctor, I see requests FROM me.
    const myPendingRequests = requests.filter(r =>
        (role === "Patient" && r.to.toLowerCase() === address?.toLowerCase() && r.status === "Pending") ||
        (role === "Doctor" && r.from.toLowerCase() === address?.toLowerCase())
    );

    if (myPendingRequests.length === 0) return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Access Requests
                </CardTitle>
                <CardDescription>
                    {role === "Patient" ? "No pending requests to approve." : "No active access requests found."}
                </CardDescription>
            </CardHeader>
        </Card>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Access Requests
                </CardTitle>
                <CardDescription>
                    {role === "Patient" ? "Approve access to your records" : "Status of your requests"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {myPendingRequests.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                        <div className="space-y-1">
                            <div className="font-medium text-sm flex items-center gap-2">
                                {role === "Patient" ? `Dr. Requesting Access` : `Request to Patient`}
                                <Badge variant={req.status === "Pending" ? "outline" : (req.status === "Approved" ? "default" : "destructive")}>
                                    {req.status}
                                </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                                {role === "Patient" ? `From: ${req.from.substring(0, 8)}...` : `To: ${req.to.substring(0, 8)}...`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(req.timestamp).toLocaleDateString()}
                            </div>
                        </div>

                        {role === "Patient" && req.status === "Pending" && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleRespond(req.id, "Rejected")} disabled={loading}>
                                    <X className="w-4 h-4 text-red-500" />
                                </Button>
                                <Button size="sm" onClick={() => handleRespond(req.id, "Approved")} disabled={loading}>
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
