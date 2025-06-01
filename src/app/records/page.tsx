"use client";

import { useAuth } from "@/providers/auth-provider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import HealthcareAuthPlusAbi from "../../../blockchain/artifacts/contracts/HealthcareAuth.sol/HealthcareAuth.json";

interface RecordMeta {
  dataHash: string;
  timestamp: number;
  recordType: string;
}

export default function RecordsPage() {
  const { address: userAddress, role, loggedIn } = useAuth();

  // Whose records to fetch
  const [patientAddressInput, setPatientAddressInput] = useState<string>("");

  const [recordCount, setRecordCount] = useState<number>(0);
  const [records, setRecords] = useState<RecordMeta[]>([]);
  const [status, setStatus] = useState<string>("");

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // 1) Instantiate Ethereum provider, signer, contract
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
        const _signer = _provider.getSigner();
        setSigner(await _signer);

        const contractAddress = process.env.CONTRACT_ADDRESS || "";
        if (!ethers.isAddress(contractAddress)) {
          setStatus("Invalid contract address in env.");
          return;
        }
        const _contract = new ethers.Contract(
          contractAddress,
          HealthcareAuthPlusAbi.abi,
          await _signer
        );
        setContract(_contract);
      })
      .catch((err) => {
        console.error("Wallet connection error:", err);
        setStatus("Unable to connect wallet.");
      });
  }, []);

  // 2) If Patient, auto-set patientAddressInput = their own
  useEffect(() => {
    if (loggedIn && role === "Patient" && userAddress) {
      setPatientAddressInput(userAddress);
      fetchRecords(userAddress);
    }
  }, [loggedIn, role, userAddress, contract]);

  // 3) Fetch records helper
  async function fetchRecords(addressToFetch: string) {
    if (!contract) {
      setStatus("Contract not initialized.");
      return;
    }
    if (!ethers.isAddress(addressToFetch)) {
      setStatus("Invalid patient address.");
      setRecords([]);
      setRecordCount(0);
      return;
    }

    try {
      setStatus("Fetching record count…");
      const countBigInt: bigint = await contract.getRecordCount(addressToFetch);
      const count = Number(countBigInt);
      setRecordCount(count);

      if (count === 0) {
        setRecords([]);
        setStatus("No records found.");
        return;
      }

      setStatus(`Found ${count} record${count !== 1 ? "s" : ""}. Fetching…`);
      const recs: RecordMeta[] = [];

      for (let i = 0; i < count; i++) {
        const [dataHash, tsBigInt, recordType] = await contract.getHealthRecord(
          addressToFetch,
          i
        );
        recs.push({
          dataHash: dataHash as string,
          timestamp: Number(tsBigInt as bigint),
          recordType: recordType as string,
        });
      }

      setRecords(recs);
      setStatus("");
    } catch (e: any) {
      console.error("Error fetching records:", e);
      setStatus(e.reason || "Failed to fetch records.");
      setRecords([]);
      setRecordCount(0);
    }
  }

  // 4) Doctor clicks “Fetch Records”
  function handleFetchClick() {
    if (!patientAddressInput) {
      setStatus("Enter a patient address.");
      return;
    }
    if (!ethers.isAddress(patientAddressInput)) {
      setStatus("Invalid address.");
      return;
    }
    fetchRecords(patientAddressInput);
  }

  // 5) View record via IPFS gateway
  function viewRecord(dataHash: string) {
    const storedCid = localStorage.getItem(`cid:${dataHash}`);
    const ipfsCid = storedCid || dataHash;
    window.open(`https://gateway.pinata.cloud/ipfs/${ipfsCid}`, "_blank");
  }

  // 6) Rendering
  if (!loggedIn) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">View Health Records</h2>
        <p className="text-red-600">You must be logged in to view records.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Health Records</h2>

      {/* If user is Doctor: show input + button */}
      {role === "Doctor" && (
        <div className="max-w-md mb-4">
          <label className="block mb-1">Patient Address:</label>
          <input
            type="text"
            value={patientAddressInput}
            onChange={(e) => setPatientAddressInput(e.target.value)}
            placeholder="0x..."
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <button
            onClick={handleFetchClick}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Fetch Records
          </button>
        </div>
      )}

      {/* If user is Patient: show read-only their own address */}
      {role === "Patient" && (
        <div className="mb-4">
          <label className="block mb-1">Your Address:</label>
          <input
            type="text"
            value={patientAddressInput}
            readOnly
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}

      {status && (
        <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
          {status}
        </p>
      )}

      {recordCount > 0 && !status && (
        <p className="mb-2">
          {role === "Doctor" ? "Patient has" : "You have"} {recordCount} record
          {recordCount !== 1 ? "s" : ""}.
        </p>
      )}

      <ul className="space-y-2">
        {records.map((rec, idx) => (
          <li key={idx} className="border rounded p-3">
            <p>
              <strong>Type:</strong> {rec.recordType}
            </p>
            <p>
              <strong>Added:</strong>{" "}
              {new Date(rec.timestamp * 1000).toLocaleString()}
            </p>
            <button
              onClick={() => viewRecord(rec.dataHash)}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
            >
              View on IPFS
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
