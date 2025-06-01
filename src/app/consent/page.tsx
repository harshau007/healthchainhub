// app/consent/page.tsx
"use client";

import { useAuth } from "@/providers/auth-provider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import HealthcareAuthPlusAbi from "../../../blockchain/artifacts/contracts/HealthcareAuth.sol/HealthcareAuth.json";

// Mock list of consumer addresses with display names:
const MOCK_CONSUMERS = [
  {
    name: "Dr. Alice",
    address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  },
  {
    name: "Dr. Bob",
    address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
  },
  {
    name: "LabCorp",
    address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
  },
];

export default function ConsentPage() {
  const { address: patientAddress, role, loggedIn } = useAuth();

  const [selectedConsumer, setSelectedConsumer] = useState<string>(
    MOCK_CONSUMERS[0].address
  );
  const [status, setStatus] = useState<string>("");

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // On mount: instantiate provider, signer, and contract
  useEffect(() => {
    setStatus("Checking wallet and contract…");
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const _provider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(_provider);
      _provider
        .send("eth_requestAccounts", [])
        .then(async () => {
          const _signer = await _provider.getSigner();
          setSigner(_signer);

          const contractAddress =
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
          if (!ethers.isAddress(contractAddress)) {
            setStatus(
              "Error: NEXT_PUBLIC_CONTRACT_ADDRESS is missing or invalid."
            );
            return;
          }

          const _contract = new ethers.Contract(
            contractAddress,
            HealthcareAuthPlusAbi.abi,
            _signer
          );
          setContract(_contract);
          setStatus("");
        })
        .catch((err) => {
          console.error("Wallet connection error:", err);
          setStatus("Unable to connect wallet.");
        });
    } else {
      setStatus("MetaMask (or other wallet) not detected.");
    }
  }, []);

  // When login changes, adjust status
  useEffect(() => {
    if (!loggedIn) {
      setStatus("Please log in to manage consent.");
    } else {
      setStatus("");
    }
  }, [loggedIn]);

  async function handleGrant() {
    if (!loggedIn || role !== "Patient") {
      setStatus("Only a logged-in Patient may grant consent.");
      return;
    }
    if (!contract || !patientAddress) {
      setStatus("Contract or patient address not ready.");
      return;
    }
    if (!ethers.isAddress(selectedConsumer)) {
      setStatus("Invalid consumer address.");
      return;
    }
    setStatus("Granting consent…");
    try {
      const tx = await contract.grantConsent(selectedConsumer);
      await tx.wait();
      setStatus(`Consent granted to ${selectedConsumer}`);
    } catch (e: any) {
      console.error("Grant error:", e);
      setStatus(e.reason || "Error granting consent.");
    }
  }

  async function handleRevoke() {
    if (!loggedIn || role !== "Patient") {
      setStatus("Only a logged-in Patient may revoke consent.");
      return;
    }
    if (!contract || !patientAddress) {
      setStatus("Contract or patient address not ready.");
      return;
    }
    if (!ethers.isAddress(selectedConsumer)) {
      setStatus("Invalid consumer address.");
      return;
    }
    setStatus("Revoking consent…");
    try {
      const tx = await contract.revokeConsent(selectedConsumer);
      await tx.wait();
      setStatus(`Consent revoked for ${selectedConsumer}`);
    } catch (e: any) {
      console.error("Revoke error:", e);
      setStatus(e.reason || "Error revoking consent.");
    }
  }

  async function checkConsent() {
    if (!loggedIn || role !== "Patient") {
      setStatus("Only a logged-in Patient may check consent.");
      return;
    }
    if (!contract || !patientAddress) {
      setStatus("Contract or patient address not ready.");
      return;
    }
    if (!ethers.isAddress(selectedConsumer)) {
      setStatus("Invalid consumer address.");
      return;
    }
    setStatus("Checking consent…");
    try {
      const has: boolean = await contract.hasConsent(
        patientAddress,
        selectedConsumer
      );
      setStatus(
        `Consent status for ${selectedConsumer}: ${
          has ? "Granted" : "Not granted"
        }`
      );
    } catch (e: any) {
      console.error("Check error:", e);
      setStatus(e.reason || "Error checking consent.");
    }
  }

  if (!loggedIn) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Manage Consent</h2>
        <p className="text-red-600">{status}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-md">
      <h2 className="text-2xl font-bold">Manage Consent</h2>
      <div>
        <label className="block mb-1">Patient Address:</label>
        <input
          type="text"
          value={patientAddress || ""}
          readOnly
          className="w-full border rounded px-3 py-2 mb-2"
        />
      </div>

      <div>
        <label className="block mb-1">Select Consumer:</label>
        <select
          value={selectedConsumer}
          onChange={(e) => setSelectedConsumer(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {MOCK_CONSUMERS.map((c) => (
            <option key={c.address} value={c.address}>
              {c.name} ({c.address.slice(0, 6)}…{c.address.slice(-4)})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleGrant}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Grant Consent
        </button>
        <button
          onClick={handleRevoke}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Revoke Consent
        </button>
        <button
          onClick={checkConsent}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Check Consent
        </button>
      </div>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
