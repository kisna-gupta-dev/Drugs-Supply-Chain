import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftRight, Badge, Package, Wallet } from 'lucide-react';
import batchDetails from "@/hooks/batch-details";
import {useContract} from "@/hooks/useContract";
import {ETHfromUSD} from "@/hooks/convertETHfromUSD";
export default function Transfers() {
  
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

  interface BatchInfo {
  batchId: string;
  price: any;
  productPrice: any;
  owner: any;
  expiry: string;
  status: string;
}
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    batchId: '',
    productPrice: '',
  });
  const [batchId, setBatchId] = useState("");
  const [batchData, setBatchData] = useState<BatchInfo | null>(null);
  const { getContractWrite } = useContract("basicmechanism");
  const validateWalletAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.batchId || !formData.productPrice) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    const contract = await getContractWrite();
    const details = await batchDetails(formData.batchId);
    if(details.status === "Manufactured" || details.status === "Returned to Manufacturer"){
      console.log(details);
      console.log("Buying from Manufacturer", formData.batchId, formData.productPrice, details.price); 
      const tx = await contract.buyBatchDistributor(formData.batchId, formData.productPrice, { value: await ETHfromUSD(details.price) });
      await tx.wait();
      console.log("Batch purchased from Manufacturer:", tx);
    }
    else if(details.status === "Owned by Distributor" || details.status === "Reselling to Distributor" || details.status === "Returned to Distributor"){
      console.log("ETH from USD:", await ETHfromUSD(details.price));
       const tx = await contract.buyBatchRetailer(formData.batchId, { value: await ETHfromUSD(details.productPrice) });
      await tx.wait();
    }
    toast({
      title: 'Purchase Initiated',
      description: 'Batch purchase transaction submitted to blockchain',
    });
    
    setFormData({ batchId: '', productPrice: '' });

    
  };
  const fetch = async (batchId) => {
    try {
      const details = await batchDetails(batchId);
      console.log("Fetched batch details:", details);
      setBatchData(details);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch batch details',
        variant: 'destructive',
      });
      setBatchData(null);
    }
  }
  return (
   <div className="space-y-8">
  {/* Header */}
  <div className="space-y-2">
    <h1 className="text-3xl font-bold text-foreground">Buy Batch</h1>
    <p className="text-muted-foreground">Purchase batch ownership via crypto payment</p>
  </div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    {/* Left Card (Buy Form) */}
    <Card className="shadow-sm hover:shadow-md transition-shadow border-border/60">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow">
            <ArrowLeftRight className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Buy Batch</CardTitle>
            <CardDescription>Enter product details and purchase batch</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch ID */}
          <div className="space-y-2">
            <Label htmlFor="batchId">Batch ID</Label>
            <Input
              id="batchId"
              placeholder="0x1234...abcd"
              className="font-mono"
              value={formData.batchId}
              onChange={(e) =>
                setFormData({ ...formData, batchId: e.target.value })
              }
            />
          </div>

          {/* Product Price */}
          <div className="space-y-2">
            <Label htmlFor="productPrice">Product Price (USD) for Distributors Only</Label>
            <div className="relative">
              <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="productPrice"
                placeholder="0.00"
                className="pl-10 font-mono"
                value={formData.productPrice}
                onChange={(e) =>
                  setFormData({ ...formData, productPrice: e.target.value })
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Price of a single product unit (in USD)
            </p>
          </div>

          {/* Info Box */}
          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold">Crypto Only</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on real-time ETH/USD price via Chainlink.
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-sm py-2">
            Buy Batch
          </Button>
        </form>
      </CardContent>
    </Card>

    {/* Right Card (Batch Lookup) */}
    <Card className="shadow-sm hover:shadow-md transition-shadow border-border/60">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Batch Details</CardTitle>
            <CardDescription>Enter batch ID to view metadata</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="searchBatchId">Search Batch ID</Label>
          <Input
            id="searchBatchId"
            placeholder="0x1234...abcd"
            className="font-mono"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          />
          <Button onClick={async () => await fetch(batchId)} className="w-full mt-2">
            Search
          </Button>
        </div>

        {/* Result Box */}
        {batchData && (
          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold">{batchData.price.toString()} USD</span>
            </div>
          
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Product Price (USD)</span>
              <span className="font-semibold">{batchData.productPrice.toString()} USD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-mono text-xs">{batchData.owner.toString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expiry</span>
              <span className="font-medium">
                {new Date(Number(batchData.expiry) * 1000).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"})}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              {batchData.status}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
      </motion.div>
    </div>
  );
}
