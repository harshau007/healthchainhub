"use client";

import { useAuth } from "@/providers/auth-provider";
import { ethers } from "ethers";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import HealthcareAuthPlusAbi from "../../../blockchain/artifacts/contracts/HealthcareAuth.sol/HealthcareAuth.json";

export default function UploadPage() {
  const { address: userAddress, role, loggedIn } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [recordType, setRecordType] = useState<string>("LabReport");
  const [patientAddressInput, setPatientAddressInput] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // 1) Initialize provider, signer, contract
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setStatus("MetaMask not detected.");
      return;
    }
    const _provider = new ethers.BrowserProvider((window as any).ethereum);
    setProvider(_provider);
    _provider
      .send("eth_requestAccounts", [])
      .then(async () => {
        const _signer = await _provider.getSigner();
        setSigner(_signer);

        const contractAddress = process.env.CONTRACT_ADDRESS || "";
        if (!ethers.isAddress(contractAddress)) {
          setStatus("Invalid contract address in env.");
          return;
        }
        const _contract = new ethers.Contract(
          contractAddress,
          HealthcareAuthPlusAbi.abi,
          _signer
        );
        setContract(_contract);
      })
      .catch((err) => {
        console.error("Wallet connection error:", err);
        setStatus("Unable to connect wallet.");
      });
  }, []);

  // 2) If Patient, auto-fill their own address
  useEffect(() => {
    if (loggedIn && role === "Patient" && userAddress) {
      setPatientAddressInput(userAddress);
    }
  }, [loggedIn, role, userAddress]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!loggedIn) {
      setStatus("You must be logged in.");
      return;
    }
    if (!contract || !signer) {
      setStatus("Wallet or contract not ready.");
      return;
    }

    const patientAddress =
      role === "Doctor" ? patientAddressInput.trim() : userAddress || "";

    if (!ethers.isAddress(patientAddress)) {
      setStatus("Invalid patient address.");
      return;
    }
    if (!file) {
      setStatus("Please select a file.");
      return;
    }

    // 3) If Doctor, check on-chain consent
    if (role === "Doctor") {
      try {
        setStatus("Checking consent on-chain…");
        const has: boolean = await contract.hasConsent(
          patientAddress,
          userAddress
        );
        if (!has) {
          setStatus("Cannot upload: The patient has not granted you consent.");
          return;
        }
      } catch (e: any) {
        console.error("Consent check error:", e);
        setStatus(e.reason || "Error checking consent.");
        return;
      }
    }

    // 4) Pinata upload
    setStatus("Uploading to Pinata…");
    const formData = new FormData();
    formData.append("patientAddress", patientAddress);
    formData.append("recordType", recordType);
    formData.append("file", file);

    let ipfsCid: string;
    let dataHash: string;
    try {
      const res = await fetch("/api/fog/add-record", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) {
        setStatus(`Pinata error: ${json.error || "Unknown error"}`);
        return;
      }
      ipfsCid = json.ipfsCid;
      dataHash = json.dataHash;
      setStatus("Pinned to IPFS: " + ipfsCid + ". Now sending on-chain…");
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus("Failed to upload to Pinata.");
      return;
    }

    // 5) On-chain call
    try {
      const tx = await contract.addHealthRecord(
        patientAddress,
        dataHash,
        recordType,
        { value: ethers.parseEther("0.001") }
      );
      setStatus("Transaction submitted: " + tx.hash);
      await tx.wait();
      setStatus("Transaction confirmed: " + tx.hash);
      localStorage.setItem(`cid:${dataHash}`, ipfsCid);
    } catch (e: any) {
      console.error("Contract error:", e);
      setStatus(e.reason || "On-chain call failed.");
    }
  }

  if (!loggedIn) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Upload Health Record</h2>
        <p className="text-red-600">You must be logged in to upload.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Health Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {role === "Doctor" && (
          <div>
            <label className="block mb-1">Patient Address:</label>
            <input
              type="text"
              value={patientAddressInput}
              onChange={(e) => setPatientAddressInput(e.target.value)}
              placeholder="0x..."
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}
        {role === "Patient" && (
          <div>
            <label className="block mb-1">Your Address:</label>
            <input
              type="text"
              value={patientAddressInput}
              readOnly
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="block mb-1">Record Type:</label>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option>LabReport</option>
            <option>Imaging</option>
            <option>Diagnosis</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">File:</label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.json"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          disabled={!file}
        >
          Upload & Register On-Chain
        </button>
      </form>
      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
