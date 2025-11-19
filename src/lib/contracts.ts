import BasicMechanism from "../abis/BasicMechanism.json";
import DrugSupplyChain from "../abis/DrugSupplyChain.json";
import Escrow from "../abis/Escrow.json";
import HandlingAddresses from "../abis/HandlingAddresses.json";
import HandlingRequests from "../abis/HandlingRequests.json";
import ResellMechanism from "../abis/ResellMechanism.json";
import UpKeep from "../abis/upKeep.json";

export const CONTRACT_ADDRESSES = {
  basicmechanism: import.meta.env.VITE_BASIC_MECHANISM_CONTRACT_ADDRESS,
  drugsupplychain: import.meta.env.VITE_DRUG_SUPPLY_CHAIN_CONTRACT_ADDRESS,
  escrow: import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS,
  handlingaddresses: import.meta.env.VITE_HANDLING_ADDRESSES_CONTRACT_ADDRESS,
  handlingrequests: import.meta.env.VITE_HANDLING_REQUESTS_CONTRACT_ADDRESS,
  resellmechanism: import.meta.env.VITE_RESELL_MECHANISM_CONTRACT_ADDRESS,
  upkeep: import.meta.env.VITE_UPKEEP_CONTRACT_ADDRESS,
};

export const CONTRACT_ABIS = {
  basicmechanism: BasicMechanism.abi,
  drugsupplychain: DrugSupplyChain.abi,
  escrow: Escrow.abi,
  handlingaddresses: HandlingAddresses.abi,
  handlingrequests: HandlingRequests.abi,
  resellmechanism: ResellMechanism.abi,
  upkeep: UpKeep.abi,
};
