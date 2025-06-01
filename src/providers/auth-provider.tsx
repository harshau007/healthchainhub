"use client";

import {
  BrowserProvider,
  Contract,
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

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
type Role = "Patient" | "Doctor";

interface AuthContextType {
  address: string | null;
  isRegistered: boolean;
  loggedIn: boolean;
  connectWallet: () => Promise<void>;
  signup: (role: Role) => Promise<void>;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  address: null,
  isRegistered: false,
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
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  // 1. On mount: if window.ethereum exists, create a BrowserProvider
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const _provider = new BrowserProvider(window.ethereum as any);
      setProvider(_provider);
    }
  }, []);

  // 2. Whenever provider changes (user connected), get signer + address
  useEffect(() => {
    if (!provider) return;

    provider
      .send("eth_accounts", [])
      .then(async (accounts: string[]) => {
        if (accounts.length > 0) {
          const _signer = provider.getSigner();
          setSigner(await _signer);
          return (await _signer).getAddress();
        }
        return null;
      })
      .then((addr: string | null) => {
        if (addr) {
          setAddress(addr);
        }
      })
      .catch(() => {
        // Not connected yet
      });
  }, [provider]);

  // 3. Once we have a signer, instantiate the contract
  useEffect(() => {
    if (!signer) return;
    const _contract = new Contract(
      CONTRACT_ADDRESS,
      HealthcareAuthAbi.abi,
      signer
    );
    setContract(_contract);
  }, [signer]);

  // 4. Check on-chain registration whenever address or contract changes
  useEffect(() => {
    async function checkRegistration() {
      if (!contract || !address) {
        setIsRegistered(false);
        return;
      }
      try {
        const reg: boolean = await contract.isRegistered(address);
        setIsRegistered(reg);
      } catch (e) {
        console.error("Error calling isRegistered:", e);
        setIsRegistered(false);
      }
    }
    checkRegistration();
  }, [contract, address]);

  // 5. connectWallet(): prompts MetaMask
  async function connectWallet() {
    if (!provider) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const accounts: string[] = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        const _signer = provider.getSigner();
        setSigner(await _signer);
        const addr = await (await _signer).getAddress();
        setAddress(addr);
      }
    } catch (err) {
      console.error("User rejected connection", err);
    }
  }

  // 6. signup(role): calls `register(roleIndex)` on-chain
  async function signup(role: Role) {
    if (!contract) {
      alert("Wallet not connected!");
      return;
    }
    const roleIndex = role === "Doctor" ? 2 : 1;
    try {
      const tx = await contract.register(roleIndex);
      await tx.wait();
      setIsRegistered(true);
      alert("Registration successful!");
    } catch (e: any) {
      console.error("Signup TX failed:", e);
      alert(
        "Error during signup—make sure you aren’t already registered and you have gas!"
      );
    }
  }

  // 7. login(): challenge/response → sets `loggedIn = true` if successful
  async function login() {
    if (!signer || !contract || !address) {
      alert("Please connect your wallet first.");
      return;
    }

    // a) Generate a random 16-byte nonce
    const nonceBytes = randomBytes(16);

    // b) Ask the user to sign it
    let signature: string;
    try {
      signature = await signer.signMessage(nonceBytes);
    } catch (e: any) {
      console.error("User refused to sign:", e);
      return;
    }

    // c) Recover the address from the signature
    const recoveredAddr = verifyMessage(nonceBytes, signature);
    if (recoveredAddr.toLowerCase() !== address.toLowerCase()) {
      alert("Signature mismatch—login failed.");
      return;
    }

    // d) On-chain check: isRegistered?
    try {
      const reg: boolean = await contract.isRegistered(address);
      if (!reg) {
        alert("Address not registered on-chain yet!");
        return;
      }

      // ✅ Login succeeded:
      setLoggedIn(true);
      alert("Login successful!");
    } catch (e: any) {
      console.error("Error during on-chain check:", e);
      alert("Error checking on-chain registration.");
    }
  }

  function logout() {
    setAddress(null);
    setSigner(null);
    setContract(null);
    setIsRegistered(false);
    setLoggedIn(false);
    // (Optionally clear localStorage or other session data here)
  }

  return (
    <AuthContext.Provider
      value={{
        address,
        isRegistered,
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
