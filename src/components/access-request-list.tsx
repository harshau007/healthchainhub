"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blockchainClient } from "@/lib/blockchain/client";
import { useAuth } from "@/providers/auth-provider";
import { Bell, Check, X, AlertTriangle, Siren } from "lucide-react";
import { toast } from "sonner";
import { AccessRequest } from "@/lib/blockchain/types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

    const [emergencyPatient, setEmergencyPatient] = useState("");
    const [emergencyReason, setEmergencyReason] = useState("");
    const [emergencyOpen, setEmergencyOpen] = useState(false);

    if (role !== "Patient" && requests.length === 0) {
        // Pass through to show the "Request Access" card logic in parent, 
        // but wait, we are inside a component that MIGHT be used in isolation.
        // Actually, for Doctor, we want to show the Emergency Button.
    }

    const handleEmergencyAccess = async () => {
        if (!emergencyPatient || !emergencyReason) return;
        try {
            await blockchainClient.breakGlassAccess(address!, emergencyPatient, emergencyReason);
            toast.error("EMERGENCY ACCESS LOGGED ON LEDGER", {
                description: "Access granted. This event is permanent."
            });
            setEmergencyOpen(false);
            setEmergencyPatient("");
            setEmergencyReason("");
        } catch (e: any) {
            toast.error(e.message || "Failed");
        }
    };

    // Filter: If I am patient, I see requests TO me. If I am doctor, I see requests FROM me.
    const myPendingRequests = requests.filter(r =>
        (role === "Patient" && r.to.toLowerCase() === address?.toLowerCase() && r.status === "Pending") ||
        (role === "Doctor" && r.from.toLowerCase() === address?.toLowerCase())
    );

    if (myPendingRequests.length === 0 && role === "Doctor") return (
        <div className="space-y-6">
            <Card className="border-red-500/20 bg-red-500/5 dark:bg-red-900/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Siren className="h-5 w-5" />
                        Emergency Override
                    </CardTitle>
                    <CardDescription>
                        "Break Glass" protocol for life-threatening situations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Initiate Emergency Access
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-red-500">
                            <DialogHeader>
                                <DialogTitle className="text-red-600 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    EMERGENCY ACCESS PROTOCOL
                                </DialogTitle>
                                <DialogDescription>
                                    You are bypassing standard consent protocols. This action will be
                                    <strong> permanently recorded </strong> on the blockchain ledger as a critical security event.
                                    Misuse may result in license revocation.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Patient Address</Label>
                                    <Input placeholder="0x..." value={emergencyPatient} onChange={e => setEmergencyPatient(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Medical Justification</Label>
                                    <Textarea placeholder="Describe the immediate threat to life..." value={emergencyReason} onChange={e => setEmergencyReason(e.target.value)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setEmergencyOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={handleEmergencyAccess} disabled={!emergencyPatient || !emergencyReason}>
                                    I Understand, Grant Access
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Access Requests
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No active access requests found.
                    </div>
                </CardContent>
            </Card>
        </div>
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
