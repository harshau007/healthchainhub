"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { blockchainClient } from "@/lib/blockchain/client";
import { useSimulation } from "@/components/blockchain/simulation-provider";

// Re-using same types for compatibility
type Role = "Patient" | "Doctor" | "Admin";
export type RoleOnChain = "None" | "Patient" | "Doctor" | "Admin";

interface AuthContextType {
  address: string | null;
  isRegistered: boolean;
  role: RoleOnChain | null;
  loggedIn: boolean;
  connectWallet: () => Promise<void>;
  signup: (role: Role) => Promise<void>;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  address: null,
  isRegistered: false,
  role: null,
  loggedIn: false,
  connectWallet: async () => { },
  signup: async () => { },
  login: async () => { },
  logout: () => { },
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [role, setRole] = useState<RoleOnChain | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const { requestConnection, sendTransaction } = useSimulation();

  // Load session from localStorage on mount
  useEffect(() => {
    const savedAddr = localStorage.getItem("hch_wallet_address");
    const savedLogin = localStorage.getItem("hch_logged_in");

    if (savedAddr) {
      setAddress(savedAddr);
      if (savedLogin === "true") {
        setLoggedIn(true);
      }
    }
  }, []);

  // Update on-chain status when address changes
  useEffect(() => {
    async function checkChain() {
      if (!address) {
        setIsRegistered(false);
        setRole(null);
        return;
      }
      try {
        const reg = await blockchainClient.isRegistered(address);
        setIsRegistered(reg);
        if (reg) {
          const rNum = await blockchainClient.getRole(address);
          const roleStr: RoleOnChain = ["None", "Patient", "Doctor", "Admin"][rNum] as RoleOnChain;
          setRole(roleStr);
        } else {
          setRole(null);
        }
      } catch (e) {
        console.error("Error checking chain status:", e);
      }
    }
    checkChain();
  }, [address]);

  async function connectWallet() {
    try {
      // Trigger the simulated MetaMask pop-up which now returns the selected address
      const selectedAddress = await requestConnection();

      setAddress(selectedAddress);
      localStorage.setItem("hch_wallet_address", selectedAddress);

    } catch (error) {
      console.log("User rejected connection:", error);
    }
  }

  async function signup(roleChoice: "Patient" | "Doctor" | "Admin") {
    if (!address) {
      alert("Connect wallet first");
      return;
    }
    const roleIndex = roleChoice === "Doctor" ? 2 : 1;
    try {
      // Wrap the registration in a transaction modal
      await sendTransaction(
        () => blockchainClient.register(address, roleIndex),
        {
          functionName: "REGISTER USER",
          to: "HealthcareAuth Contract"
        }
      );

      setIsRegistered(true);
      setRole(roleChoice);
      alert("Registration successful!");
    } catch (e: any) {
      // User might have rejected, or actual error
      console.error("Signup failed or rejected", e);
      if (e.message !== "User rejected transaction") {
        alert(e.message || "Signup failed");
      }
    }
  }

  async function login() {
    if (!address) return;
    if (!isRegistered) {
      alert("Not registered!");
      return;
    }
    // Simulation: Login usually requires a signature, but for now we just accept it if connected
    setLoggedIn(true);
    localStorage.setItem("hch_logged_in", "true");
  }

  function logout() {
    localStorage.removeItem("hch_wallet_address");
    localStorage.removeItem("hch_logged_in");
    setAddress(null);
    setIsRegistered(false);
    setRole(null);
    setLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
        address,
        isRegistered,
        role,
        loggedIn,
        connectWallet,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
