"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { ArrowRight, Fuel } from "lucide-react";

interface TransactionModalProps {
    isOpen: boolean;
    txDetails: {
        to?: string;
        amount?: string;
        functionName?: string;
        dataHash?: string;
    };
    onConfirm: () => void;
    onReject: () => void;
}

export function TransactionModal({
    isOpen,
    txDetails,
    onConfirm,
    onReject,
}: TransactionModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
            <DialogContent className="sm:max-w-[360px] p-0 overflow-hidden bg-background border-none shadow-2xl font-sans">
                {/* Header */}
                <div className="p-3 border-b flex items-center justify-center relative bg-[#f2f4f6] dark:bg-[#1a1c1e]">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        Sepolia test network
                    </div>
                </div>

                {/* Sender / Recipient */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                        <span className="text-xs text-muted-foreground">Account 1</span>
                    </div>
                    <ArrowRight className="text-muted-foreground h-4 w-4" />
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                            {txDetails.to ? txDetails.to.substring(0, 2) : "C"}
                        </div>
                        <span className="text-xs text-muted-foreground" title={txDetails.to}>
                            {txDetails.to ? `${txDetails.to.substring(0, 6)}...${txDetails.to.substring(38)}` : "New Contract"}
                        </span>
                    </div>
                </div>

                {/* Main Action Display */}
                <div className="px-6 py-2 text-center">
                    <h3 className="text-lg font-bold border rounded-md px-2 py-1 inline-block bg-muted/50 font-mono mb-2">
                        {txDetails.functionName || "CONTRACT INTERACTION"}
                    </h3>
                    <div className="text-2xl font-bold mt-2">
                        {txDetails.amount ? `${txDetails.amount} ETH` : "$0.00"}
                    </div>
                </div>

                {/* Data Tabs */}
                <div className="mt-2 border-t border-b">
                    <div className="flex">
                        <button className="flex-1 py-2 text-sm font-medium border-b-2 border-blue-600 text-blue-600">DETAILS</button>
                        <button className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">DATA</button>
                        <button className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">HEX</button>
                    </div>
                </div>

                {/* Gas / Total */}
                <div className="p-4 space-y-4 bg-background">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-1">
                            <span className="font-bold text-sm">Gas</span>
                            <span className="text-xs text-muted-foreground italic">(estimated)</span>
                            <Fuel className="h-3 w-3 text-muted-foreground mt-1" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold">0.002385 ETH</div>
                            <div className="text-xs text-green-600 font-medium">Very likely in &lt; 15 seconds</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Max fee: 0.002385 ETH</div>
                        </div>
                    </div>

                    <div className="h-px bg-border"></div>

                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-bold text-sm">Total</div>
                            <div className="text-xs text-muted-foreground">Amount + gas fee</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold">
                                {txDetails.amount
                                    ? (parseFloat(txDetails.amount) + 0.002385).toFixed(6) + " ETH"
                                    : "0.002385 ETH"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                                Max amount: {txDetails.amount
                                    ? (parseFloat(txDetails.amount) + 0.002385).toFixed(6) + " ETH"
                                    : "0.002385 ETH"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <DialogFooter className="p-4 border-t flex-row gap-3 justify-between">
                    <Button
                        variant="outline"
                        onClick={onReject}
                        className="flex-1 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
