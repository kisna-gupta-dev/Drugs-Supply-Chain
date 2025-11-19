"use client";

import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "../lib/contracts";

export function useContract(contractName: keyof typeof CONTRACT_ADDRESSES) {
  
  if (typeof window === "undefined") return { getContractRead: () => null, getContractWrite: async () => null };

  const provider = new ethers.BrowserProvider(window.ethereum);

  const getSigner = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return provider.getSigner(); // ethers v6 auto-selects 1st account
  };

  const getContractRead = () => {
    return new ethers.Contract(
      CONTRACT_ADDRESSES[contractName] as string,
      CONTRACT_ABIS[contractName],
      provider
    );
  };

  const getContractWrite = async () => {
    const signer = await getSigner();
    return new ethers.Contract(
      CONTRACT_ADDRESSES[contractName] as string,
      CONTRACT_ABIS[contractName],
      signer
    );
  };

  return { getContractRead, getContractWrite };
}
