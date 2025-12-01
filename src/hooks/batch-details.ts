import {useContract} from "./useContract";

export const StatusEnum: Record<number, string> = {
  0: "Manufactured",
  1: "Owned by Distributor",
  2: "Ready to Sell to Retailer",
  3: "Owned by Retailer",
  4: "Return Requested by Retailer",
  5: "Return Requested by Distributor",
  6: "Returned to Distributor",
  7: "Returned to Manufacturer",
  8: "Reselling to Distributor"
};

const { getContractRead } = useContract("basicmechanism");
export default async function batchDetails(batchId: string) {
        const contract = await getContractRead();
        const batch = await contract.getBatchDetails(batchId);

        // Determine owner based on status
        let owner;
        if (batch.statusEnum == 0 || batch.statusEnum == 7) {
          owner = batch.manufacturer;
        } else if (batch.statusEnum == 1 || batch.statusEnum == 2 || batch.statusEnum == 6 || batch.statusEnum == 5 || batch.statusEnum == 8) {
          owner = batch.distributor;
        } else {
          owner = batch.retailer;
        }
       
        return {
          batchId,
          price: batch.price,
          productPrice: batch.productPrice,
          status: StatusEnum[batch.statusEnum],
          owner,
          expiry: batch.expiryDate.toString()

        };
    }
