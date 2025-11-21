// ...existing code...
import React, { useState } from 'react';
import { CONTRACT_ADDRESSES,CONTRACT_ABIS } from '@/lib/contracts';
import {useContract} from "@/hooks/useContract";
import { ethers } from 'ethers';
import {} from "@/lib/contracts";
type Role = 'Manufacturer' | 'Distributor' | 'Retailer';

function RolePanel({ role }: { role: Role }) {
  const [address, setAddress] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [frozen, setFrozen] = useState(false);

  // Replace 'HandlingAddress' / method names with the actual contract and methods you have
  async function getSigner() {
    if (!(window as any).ethereum) throw new Error('No web3 provider found');
    // ethers v6 uses BrowserProvider instead of ethers.providers.Web3Provider
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    await provider.send('eth_requestAccounts', []);
    return provider.getSigner();
  }

  async function callContract(method: string, ...args: any[]) {
    try {
      const signer = await getSigner();
      // Use the correct contract name from your CONTRACTS registry
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.handlingaddresses, CONTRACT_ABIS.handlingaddresses, signer);
      console.log("Calling method:", method, "with args:", args);
      // @ts-ignore call dynamic method
      const tx = await contract[method](...args);
      setStatusMsg('Transaction sent: ' + (tx.hash || 'pending'));
      if (tx && tx.wait) await tx.wait();
      setStatusMsg('Transaction confirmed');
      return tx;
    } catch (err: any) {
      setStatusMsg('Error: ' + (err.message || String(err)));
    }
  }

  return (
    <section className="rounded-xl border bg-white/5 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all duration-200">
  <h3 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
    {role}
  </h3>

  {/* Input Field */}
  <div className="mb-4">
    <div className="relative">
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder={`${role} address (0x...)`}
        className="w-full rounded-lg border border-border bg-background px-4 py-2 pl-10 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
      />
      <span className="absolute left-3 top-2.5 text-muted-foreground text-xs">
        0x
      </span>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex flex-wrap gap-3">
    <button
      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 hover:shadow-md transition-all"
      onClick={() => {
        if (role === "Manufacturer") callContract("addManufacturer", address);
        else if (role === "Distributor") callContract("addDistributor", address);
        else callContract("addRetailer", address);
      }}
    >
      Add
    </button>

    <button
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 hover:shadow-md transition-all"
      onClick={() => {
        if (role === "Manufacturer") callContract("removeManufacturer", address);
        else if (role === "Distributor") callContract("removeDistributor", address);
        else callContract("removeRetailer", address);
      }}
    >
      Remove
    </button>

    <button
      className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 hover:shadow-md transition-all"
      onClick={async () => {
        const method = frozen ? "unfreezeAddress" : "frozeAddress";
        const tx = await callContract(method, address);
        const receipt = await tx.wait();
        if (receipt.status === 1) setFrozen((s) => !s);
      }}
    >
      {frozen ? "Unfreeze" : "Freeze"}
    </button>
  </div>

  {statusMsg && (
    <p className="mt-4 text-sm text-muted-foreground">{statusMsg}</p>
  )}
</section>

  );
}

export default function OwnerOptionsPage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-6 text-2xl font-bold">Owner Options</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <RolePanel role="Manufacturer" />
        <RolePanel role="Distributor" />
        <RolePanel role="Retailer" />
      </div>
    </div>
  );
}
// ...existing code...