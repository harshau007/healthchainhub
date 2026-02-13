"use client";

import { useEffect, useState } from "react";
import { blockchainClient } from "@/lib/blockchain/client";
import { Transaction } from "@/lib/blockchain/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function LedgerPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const txs = await blockchainClient.getTransactions();
            setTransactions(txs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blockchain Ledger</h1>
                    <p className="text-muted-foreground mt-1">Immutable record of all network transactions</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadTransactions} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        <CardTitle>Recent Blocks & Transactions</CardTitle>
                    </div>
                    <CardDescription>Live feed of healthcare network activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tx Hash</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No transactions found on the ledger yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.hash}>
                                        <TableCell className="font-mono text-xs text-muted-foreground cursor-help" title={tx.hash}>
                                            {tx.hash.substring(0, 10)}...
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={tx.action === "EmergencyAccess" ? "destructive" : "outline"}
                                                className={`font-mono ${tx.action === "EmergencyAccess" ? "animate-pulse" : ""}`}
                                            >
                                                {tx.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs" title={tx.from}>
                                            {tx.from.substring(0, 8)}...
                                        </TableCell>
                                        <TableCell className="font-mono text-xs" title={tx.to || "N/A"}>
                                            {tx.to ? `${tx.to.substring(0, 8)}...` : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={tx.status === "Success" ? "default" : "destructive"} className="text-[10px] px-1 py-0 h-5">
                                                {tx.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
