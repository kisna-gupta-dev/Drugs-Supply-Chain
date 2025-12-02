import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import {useContract} from "@/hooks/useContract";
import { ethers } from 'ethers';
import { useAccount } from "wagmi";



export default function Batches() {

   
  const StatusEnum: Record<number, string> = {
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
  
  const { address, isConnected } = useAccount();
  const [ownerInput, setOwnerInput] = useState("");
  const [ownerBatches, setOwnerBatches] = useState([]);
  const { getContractRead } = useContract("basicmechanism");
  const searchOwnerBatches = async () => {

  try {
    // if (!ownerInput) return;
    const contract = await getContractRead();
    // 1. Get all batch IDs for this owner
    const batchIds: string[] = await contract.getOwnerBatches(address);

    // 2. For each batchId, load full batch struct + decode enum
    const detailedBatches = await Promise.all(
      batchIds.map(async (batchId) => {
        const batch = await contract.batchIdToBatch(batchId);
        let owner = ownerInput;
        if(batch.statusEnum == "0" || batch.statusEnum == "7"){
          owner = batch.manufacturer;
        }else if(batch.statusEnum == "1" || batch.statusEnum == "2" || batch.statusEnum == "6" || batch.statusEnum == "5" || batch.statusEnum == "8"){
          owner = batch.distributor;
        }
        else{
          owner = batch.retailer;
        }
        return {
          batchId,
          status: StatusEnum[batch.statusEnum],  // convert enum number → name
          owner: owner
        };
      })
    );

    setOwnerBatches(detailedBatches);

  } catch (err) {
    console.error(err);
    }
  };
  
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ownerBatches.length / itemsPerPage);

  const currentItems = ownerBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  useEffect(() => {
    if(isConnected){
      searchOwnerBatches();
    }})
  
  
    return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Batch Registry</CardTitle>
                <CardDescription>Complete list of all blockchain-registered batches</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
  
            <div className="rounded-lg border border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {currentItems.map((batch, i) => (
                    <div
                      key={i}
                      className="border rounded-xl p-4 bg-card shadow hover:shadow-md transition-all"
                    >
                      <p className="text-xs text-muted-foreground">Batch ID</p>
                      <p className="font-mono font-semibold break-all">{batch.batchId}</p>

                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="font-mono text-sm truncate">
                          {batch.owner.slice(0, 6)}...{batch.owner.slice(-4)}
                        </p>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span className="text-sm font-semibold">{batch.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1 ? "bg-primary text-white" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            &gt;
          </button>
        </div>

      </motion.div>
    </div>
  );
}
