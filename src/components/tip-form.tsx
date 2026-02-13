"use client";

import { useState } from "react";
import { blockchainClient } from "@/lib/blockchain/client";
import { useAuth } from "@/providers/auth-provider";
import { useSimulation } from "@/components/blockchain/simulation-provider";

export function TipForm() {
  const { address } = useAuth();
  const { sendTransaction } = useSimulation();

  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("0.001");
  const [message, setMessage] = useState<string>("Thanks!");

  async function handleTip() {
    if (!address) {
      alert("Please connect wallet first");
      return;
    }
    if (!toAddress.startsWith("0x")) {
      alert("Invalid address");
      return;
    }
    try {
      await sendTransaction(
        () => blockchainClient.tip(address, toAddress, amount, message),
        {
          to: toAddress,
          amount: amount,
          functionName: "SEND TRADING TIP"
        }
      );
      alert("Tip sent!");
    } catch (e: any) {
      console.log("Tip failed or rejected", e);
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
