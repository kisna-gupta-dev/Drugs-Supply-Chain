import { useContract } from "./useContract";

export async function ETHfromUSD(usdAmount: number) {
    const {getContractRead} = useContract('drugsupplychain');
    const contract = await getContractRead();
    const ETH = await contract.calculateEthfromUSD(usdAmount);
    return ETH;
}