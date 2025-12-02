"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import batchDetails from "@/hooks/batch-details";
import { useContract } from "@/hooks/useContract";
import { motion } from "framer-motion";

export default function Marketplace() {
  const { getContractRead } = useContract("drugsupplychain");

  const [batches, setBatches] = useState<string[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(details.length / itemsPerPage);

  const currentItems = details.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Load all batch IDs + details
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const contract = await getContractRead();
        const allBatches = await contract.allBatchIds();
                console.log("Loading batches for marketplace...", allBatches);

        setBatches(allBatches);
        const loaded = await Promise.all(
          allBatches.map(async (batchId: string) => {
            const data = await batchDetails(batchId.toString());
            return {
              batchId,
              ...data,
            };
          })
        );

        setDetails(loaded);
      } catch (err) {
        console.error("Error loading batches:", err);
      }
    };

    loadBatches();
  }, []);

  return (
    <div className="p-8 space-y-6">

      {/* Heading Section */}
      <div>
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Purchase batches directly from manufacturers or distributors.</p>
      </div>

      {/* Horizontal Card Grid */}
      <div className="grid grid-cols-1 gap-6">
        {currentItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="flex flex-row items-center justify-between p-6 shadow hover:shadow-lg transition-all">

              {/* Left Section */}
              <div className="space-y-2 w-2/3">
                <h2 className="text-lg font-semibold text-primary">
                  Batch ID: <span className="font-mono">{item.batchId}</span>
                </h2>

                <p className="text-sm">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className="font-semibold">{item.status}</span>
                </p>

                <p className="text-sm">
                  <span className="text-muted-foreground">Owner:</span>{" "}
                  <span className="font-mono">
                    {item.owner.slice(0, 6)}...{item.owner.slice(-4)}
                  </span>
                </p>

                <p className="text-sm">
                  <span className="text-muted-foreground">Price:</span>{" "}
                  <span className="font-semibold">{item.price} USD</span>
                </p>

                <p className="text-sm">
                  <span className="text-muted-foreground">Expiry:</span>{" "}
                  <span className="font-semibold">{item.expiry}</span>
                </p>
              </div>

              {/* Right Section */}
              <Button className="h-12 px-6 text-md font-semibold">
                Buy
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          &lt;
        </Button>

        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}
