// ...existing code...
import { Contract, Provider, Signer } from "ethers";
import BasicMechanism from ".././abis/BasicMechanism.json";
import DrugSupplyChain from ".././abis/DrugSupplyChain.json";
import Escrow from ".././abis/Escrow.json";
import HandlingAddresses from ".././abis/HandlingAddresses.json";
import HandlingRequests from ".././abis/HandlingRequests.json";
import ResellMechanism from ".././abis/ResellMechanism.json";
import upKeep from ".././abis/upKeep.json";
require("dotenv").config();

export const CONTRACT_ADDRESSES = {
    basicmechainsm: process.env.BASIC_MECHANISM_CONTRACT_ADDRESS,
    drugsupplychain: process.env.DRUG_SUPPLY_CHAIN_CONTRACT_ADDRESS,
    escrow: process.env.ESCROW_CONTRACT_ADDRESS,
    handlingaddresses: process.env.HANDLING_ADDRESSES_CONTRACT_ADDRESS,
    handlingrequests: process.env.HANDLING_REQUESTS_CONTRACT_ADDRESS,
    resellmechanism: process.env.RESELL_MECHANISM_CONTRACT_ADDRESS,
    upkeep: process.env.UPKEEP_CONTRACT_ADDRESS,
};

export const CONTRACT_ABIS ={
    basicmechainsm: BasicMechanism.abi,
    drugsupplychain: DrugSupplyChain.abi,
    escrow: Escrow.abi,
    handlingaddresses: HandlingAddresses.abi,
    handlingrequests: HandlingRequests.abi,
    resellmechanism: ResellMechanism.abi,
    upkeep: upKeep.abi,
}
