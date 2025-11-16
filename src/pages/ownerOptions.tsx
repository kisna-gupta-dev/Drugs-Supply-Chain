// ...existing code...
import React, { useState } from 'react';
import { getContract } from '@/lib/contracts';
import { ethers } from 'ethers';

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
      const contract = getContract('HandlingAddress', signer);
      // @ts-ignore call dynamic method
      const tx = await contract[method](...args);
      setStatusMsg('Transaction sent: ' + (tx.hash || 'pending'));
      if (tx && tx.wait) await tx.wait();
      setStatusMsg('Transaction confirmed');
    } catch (err: any) {
      setStatusMsg('Error: ' + (err.message || String(err)));
    }
  }

  return (
    <section className="rounded-lg border p-4 bg-card">
      <h3 className="mb-3 text-lg font-semibold">{role}</h3>

      <div className="mb-3 flex gap-2">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={`${role} address (0x...)`}
          className="flex-1 rounded border px-3 py-2"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
          onClick={() => {
            // Replace 'addAddress' with your contract method name for adding
            callContract('addManufacturer', address, role);
          }}
        >
          Add
        </button>

        <button
          className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          onClick={() => {
            // Replace 'removeAddress' with your contract method name for removing
            callContract('removeAddress', address, role);
          }}
        >
          Remove
        </button>

        <button
          className="rounded bg-yellow-600 px-3 py-2 text-sm text-white hover:bg-yellow-700"
          onClick={async () => {
            // Replace 'setFrozen' / 'freezeAddress' with your method(s). Example toggles:
            const method = frozen ? 'unfreezeAddress' : 'freezeAddress';
            await callContract(method, address, role);
            setFrozen((s) => !s);
          }}
        >
          {frozen ? 'Unfreeze' : 'Freeze'}
        </button>
      </div>

      {statusMsg && <p className="mt-3 text-sm text-muted-foreground">{statusMsg}</p>}
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