import { defineChain } from "viem";

export const ganache = defineChain({
  id: 1337, // or 5777 depending on your Ganache
  name: "Ganache",
  network: "ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:7545"],
    },
    public: {
      http: ["http://127.0.0.1:7545"],
    },
  },
  testnet: true,
});
