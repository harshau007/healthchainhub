"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ConnectModal } from "./connect-modal";
import { TransactionModal } from "./transaction-modal";

interface TxDetails {
    to?: string;
    amount?: string;
    functionName?: string;
    dataHash?: string;
}

interface SimulationContextType {
    requestConnection: () => Promise<string>; // Returns the selected address
    sendTransaction: (
        txFn: () => Promise<any>,
        details?: TxDetails
    ) => Promise<any>;
}

const SimulationContext = createContext<SimulationContextType | undefined>(
    undefined
);

export function SimulationProvider({ children }: { children: ReactNode }) {
    // Connect Modal State
    const [isConnectOpen, setIsConnectOpen] = useState(false);
    const [connectResolver, setConnectResolver] = useState<{
        resolve: (address: string) => void;
        reject: (reason?: any) => void;
    } | null>(null);

    // Transaction Modal State
    const [isTxOpen, setIsTxOpen] = useState(false);
    const [txDetails, setTxDetails] = useState<TxDetails>({});
    const [txResolver, setTxResolver] = useState<{
        resolve: (val: any) => void;
        reject: (reason?: any) => void;
        txFn: () => Promise<any>;
    } | null>(null);

    const requestConnection = () => {
        return new Promise<string>((resolve, reject) => {
            setConnectResolver({ resolve, reject });
            setIsConnectOpen(true);
        });
    };

    const handleConnect = (address: string) => {
        if (connectResolver) {
            connectResolver.resolve(address);
            setConnectResolver(null);
        }
        setIsConnectOpen(false);
    };

    const handleConnectCancel = () => {
        if (connectResolver) {
            connectResolver.reject(new Error("User rejected connection"));
            setConnectResolver(null);
        }
        setIsConnectOpen(false);
    };

    const sendTransaction = (
        txFn: () => Promise<any>,
        details: TxDetails = {}
    ) => {
        return new Promise<any>((resolve, reject) => {
            setTxDetails(details);
            setTxResolver({ resolve, reject, txFn });
            setIsTxOpen(true);
        });
    };

    const handleTxConfirm = async () => {
        setIsTxOpen(false);
        if (txResolver) {
            try {
                const result = await txResolver.txFn();
                txResolver.resolve(result);
            } catch (error) {
                txResolver.reject(error);
            } finally {
                setTxResolver(null);
            }
        }
    };

    const handleTxReject = () => {
        setIsTxOpen(false);
        if (txResolver) {
            txResolver.reject(new Error("User rejected transaction"));
            setTxResolver(null);
        }
    };

    return (
        <SimulationContext.Provider value={{ requestConnection, sendTransaction }}>
            {children}
            <ConnectModal
                isOpen={isConnectOpen}
                onConnect={handleConnect}
                onCancel={handleConnectCancel}
            />
            <TransactionModal
                isOpen={isTxOpen}
                txDetails={txDetails}
                onConfirm={handleTxConfirm}
                onReject={handleTxReject}
            />
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error("useSimulation must be used within a SimulationProvider");
    }
    return context;
}
