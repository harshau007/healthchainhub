"use client";

import { ethers } from "ethers";
import { useState } from "react";
import HealthcareAuthPlusAbi from "../../blockchain/artifacts/contracts/HealthcareAuth.sol/HealthcareAuth.json";

export function TipForm() {
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("0.001");
  const [message, setMessage] = useState<string>("Thanks!");

  async function handleTip() {
    if (!ethers.isAddress(toAddress)) {
      alert("Invalid address");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS || "",
        HealthcareAuthPlusAbi.abi,
        await signer
      );
      const tx = await contract.tip(toAddress, message, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Tip sent!");
    } catch (e: any) {
      console.error(e);
      alert("Error sending tip");
    }
  }

  return (
    <div className="max-w-sm space-y-3">
      <h3 className="text-lg font-semibold">Send a Tip</h3>
      <input
        type="text"
        placeholder="Doctor Address"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <button
        onClick={handleTip}
        className="w-full px-4 py-2 bg-yellow-600 text-white rounded"
      >
        Tip
      </button>
    </div>
  );
}
