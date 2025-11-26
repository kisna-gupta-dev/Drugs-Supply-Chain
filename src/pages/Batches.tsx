import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { useState } from 'react';
import {useContract} from "@/hooks/useContract";
import { ethers } from 'ethers';


const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
    case 'Transferred':
      return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
    case 'Returned':
      return 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};


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
const [ownerInput, setOwnerInput] = useState("");
const [ownerBatches, setOwnerBatches] = useState([]);
const { getContractRead } = useContract("basicmechanism");
const searchOwnerBatches = async () => {
  try {
    if (!ownerInput) return;
    const contract = await getContractRead();
    // 1. Get all batch IDs for this owner
    const batchIds: string[] = await contract.getOwnerBatches(ownerInput);

    // 2. For each batchId, load full batch struct + decode enum
    const detailedBatches = await Promise.all(
      batchIds.map(async (batchId) => {
        const batch = await contract.batchIdToBatch(batchId);
        console.log("Fetched batch:", batchId, batch.statusEnum);
        return {
          batchId,
          status: StatusEnum[batch.statusEnum],   // convert enum number → name
        };
      })
    );

    setOwnerBatches(detailedBatches);

  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Batches</h1>
        <p className="text-muted-foreground">View all registered drug batches</p>
      </div>

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
            <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Search BatchId by Owner Address"
              value={ownerInput}
              onChange={(e) => setOwnerInput(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <button
              onClick={searchOwnerBatches}
              className="rounded bg-primary px-4 py-2 text-white"
              >Search
            </button>
            </div>
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Owner Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownerBatches.map((batch, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{batch.batchId}</TableCell>
                      <TableCell>{ownerInput}</TableCell>
                      <TableCell>{batch.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
