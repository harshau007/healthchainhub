"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Wallet } from "lucide-react";
import { useState } from "react";

interface ConnectModalProps {
    isOpen: boolean;
    onConnect: (address: string) => void;
    onCancel: () => void;
}

const DEMO_ACCOUNTS = [
    {
        name: "Patient (Harsh)",
        address: "0x257f01d8a0d459def4cb0fa69a2cd7241d9568bc",
        role: "Patient",
        color: "from-green-400 to-emerald-600",
    },
    {
        name: "Dr. Alice (Cardiologist)",
        address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        role: "Doctor",
        color: "from-blue-400 to-indigo-600",
    },
    {
        name: "Admin",
        address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        role: "Admin",
        color: "from-purple-400 to-pink-600",
    },
    {
        name: "New User (Unregistered)",
        address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
        role: "None",
        color: "from-gray-400 to-gray-600",
    }
];

export function ConnectModal({ isOpen, onConnect, onCancel }: ConnectModalProps) {
    const [selectedAccount, setSelectedAccount] = useState<string>(DEMO_ACCOUNTS[0].address);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-background border-none shadow-2xl">
                <div className="bg-[#f2f4f6] dark:bg-[#1e1e20] p-6 flex flex-col items-center border-b">
                    <div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg mb-4 ring-4 ring-background">
                        <div className="text-3xl">🦊</div>
                    </div>
                    <DialogTitle className="text-xl font-bold text-center">
                        Connect with MetaMask
                    </DialogTitle>
                    {/* <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 bg-background/50 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Simulation Mode
                    </div> */}
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Account</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                            Demo Mode
                        </span>
                    </div>

                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                        {DEMO_ACCOUNTS.map((acc) => (
                            <div
                                key={acc.address}
                                className={`relative group border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all duration-200 ${selectedAccount === acc.address
                                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-500/20"
                                        : "hover:bg-muted/50 hover:border-muted-foreground/30"
                                    }`}
                                onClick={() => setSelectedAccount(acc.address)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${acc.color} flex items-center justify-center text-white shadow-sm`}>
                                        <Wallet className="w-5 h-5 opacity-80" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm flex items-center gap-2">
                                            {acc.name}
                                            {acc.role !== "None" && (
                                                <span className="text-[10px] font-normal border border-current px-1.5 rounded-full opacity-60">
                                                    {acc.role}
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {acc.address.substring(0, 6)}...{acc.address.substring(38)}
                                        </span>
                                    </div>
                                </div>
                                {selectedAccount === acc.address && (
                                    <div className="bg-blue-500 text-white rounded-full p-1 animate-in zoom-in spin-in-90 duration-300">
                                        <Check className="h-3 w-3" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-[11px] text-center text-muted-foreground mt-4 px-4 leading-relaxed">
                        By connecting a wallet, you agree to HealthChainHub's Terms of Service and acknowledge that this is a simulation.
                    </div>
                </div>

                <DialogFooter className="p-4 bg-muted/20 border-t flex-row gap-3 justify-end">
                    <Button variant="ghost" onClick={onCancel} className="flex-1 rounded-full font-medium hover:bg-background/80">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onConnect(selectedAccount)}
                        className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold"
                    >
                        Connect
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
