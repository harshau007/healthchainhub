"use client";

import {
  BrowserProvider,
  Contract,
  ethers,
  randomBytes,
  verifyMessage,
  type Signer,
} from "ethers";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import HealthcareAuthAbi from "../../blockchain/artifacts/contracts/HealthcareAuth.sol/HealthcareAuth.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
type Role = "Patient" | "Doctor";
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
  connectWallet: async () => {},
  signup: async () => {},
  login: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [role, setRole] = useState<RoleOnChain | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // 1) On mount: if window.ethereum exists, create BrowserProvider
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const _provider = new BrowserProvider(window.ethereum as any);
      setProvider(_provider);
    }
  }, []);

  // 2) When provider is ready, request accounts → set signer & address
  useEffect(() => {
    if (!provider) return;
    provider
      .send("eth_accounts", [])
      .then(async (accounts: string[]) => {
        if (accounts.length > 0) {
          const _signer = await provider.getSigner();
          setSigner(_signer);
          return _signer.getAddress();
        }
        return null;
      })
      .then((addr: string | null) => {
        if (addr) {
          setAddress(addr);
        }
      })
      .catch(() => {
        // Not yet connected
      });
  }, [provider]);

  // 3) When signer updates, instantiate the contract
  useEffect(() => {
    if (!signer) return;
    if (!ethers.isAddress(CONTRACT_ADDRESS)) {
      console.error("CONTRACT_ADDRESS is missing or invalid.");
      return;
    }
    const _contract = new Contract(
      CONTRACT_ADDRESS,
      HealthcareAuthAbi.abi,
      signer
    );
    setContract(_contract);
  }, [signer]);

  // 4) Whenever address or contract changes, check isRegistered & role
  useEffect(() => {
    async function checkOnChain() {
      if (!contract || !address) {
        setIsRegistered(false);
        setRole(null);
        return;
      }
      try {
        const reg: boolean = await contract.isRegistered(address);
        setIsRegistered(reg);

        if (reg) {
          // Fetch Role enum (0=None,1=Patient,2=Doctor,3=Admin)
          const r: number = await contract.getRole(address);
          const roleStr: RoleOnChain = ["None", "Patient", "Doctor", "Admin"][
            r
          ] as RoleOnChain;
          setRole(roleStr);
        } else {
          setRole(null);
        }
      } catch (e) {
        console.error("Error checking registration/role:", e);
        setIsRegistered(false);
        setRole(null);
      }
    }
    checkOnChain();
  }, [contract, address]);

  // 5) connectWallet()
  async function connectWallet() {
    if (!provider) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const accounts: string[] = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        const _signer = await provider.getSigner();
        setSigner(_signer);
        const addr = await _signer.getAddress();
        setAddress(addr);
      }
    } catch (err) {
      console.error("User rejected connection", err);
    }
  }

  // 6) signup(role)
  async function signup(roleChoice: "Patient" | "Doctor") {
    if (!contract) {
      alert("Wallet not connected!");
      return;
    }
    const roleIndex = roleChoice === "Doctor" ? 2 : 1;
    try {
      const tx = await contract.register(roleIndex);
      await tx.wait();
      setIsRegistered(true);
      setRole(roleChoice);
      alert("Registration successful!");
    } catch (e: any) {
      console.error("Signup TX failed:", e);
      alert(e.reason || "Error during signup");
    }
  }

  // 7) login(): challenge/response → sets loggedIn=true
  async function login() {
    if (!signer || !contract || !address) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      const nonceBytes = randomBytes(16);
      const signature: string = await signer.signMessage(nonceBytes);
      const recoveredAddr = verifyMessage(nonceBytes, signature);
      if (recoveredAddr.toLowerCase() !== address.toLowerCase()) {
        alert("Signature mismatch—login failed.");
        return;
      }
      const reg: boolean = await contract.isRegistered(address);
      if (!reg) {
        alert("Address not registered on-chain yet!");
        return;
      }
      setLoggedIn(true);
      alert("Login successful!");
    } catch (e: any) {
      console.error("Login error:", e);
      alert(e.reason || "Login failed");
    }
  }

  // 8) logout(): clear everything
  function logout() {
    setAddress(null);
    setSigner(null);
    setContract(null);
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
