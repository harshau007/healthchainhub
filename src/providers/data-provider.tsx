"use client";

import { detectAnomalies } from "@/lib/anomaly-detection.ts";
import { DataManager } from "@/lib/data-manager.ts";
import { useDataStore } from "@/lib/store";
import type { Anomaly, HospitalData } from "@/lib/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

interface DataContextType {
  isConnected: boolean;
  lastUpdated: Date | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useDataContext() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const { setData, data } = useDataStore();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [previousData, setPreviousData] = useState<HospitalData | null>(null);

  useEffect(() => {
    const dataManager = new DataManager();

    const cleanup = dataManager.subscribeToEvents({
      onData: (newData: any) => {
        setData(newData);
        setLastUpdated(new Date());
        setIsConnected(true);

        // Anomalies Check
        if (previousData) {
          const anomalies = detectAnomalies(previousData, newData);

          // Toast notifications for any detected anomalies
          anomalies.forEach((anomaly: Anomaly) => {
            toast[anomaly.severity](anomaly.message, {
              description: anomaly.description,
              id: `anomaly-${anomaly.id}`,
            });
          });
        }

        setPreviousData(newData);
      },
      onConnected: () => {
        setIsConnected(true);
        toast.success("Connected to data stream", {
          description: "Receiving real-time hospital data",
          id: "connection-established",
        });
      },
      onDisconnected: () => {
        setIsConnected(false);
        toast.error("Disconnected from data stream", {
          description: "Attempting to reconnect...",
          id: "connection-lost",
        });
      },
      onError: (error: Error) => {
        toast.error("Data stream error", {
          description: error.message,
          id: "connection-error",
        });
      },
    });

    return () => {
      cleanup();
    };
  }, [setData]);

  const value = {
    isConnected,
    lastUpdated,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
