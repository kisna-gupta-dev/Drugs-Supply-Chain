import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftRight, Badge, Package, Wallet } from 'lucide-react';
import batchDetails from "@/hooks/batch-details";
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
  owner: any;
  expiry: string;
  status: string;
}
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    batchId: '',
    receiverAddress: '',
  });
  const [batchId, setBatchId] = useState("");
  const [batchData, setBatchData] = useState<BatchInfo | null>(null);

  const validateWalletAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.batchId || !formData.receiverAddress) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (!validateWalletAddress(formData.receiverAddress)) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid wallet address (0x...)',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Transfer Initiated',
      description: 'Batch transfer transaction submitted to blockchain',
    });
    
    setFormData({ batchId: '', receiverAddress: '' });

    
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transfer / Purchase</h1>
        <p className="text-muted-foreground">Transfer batch ownership via crypto payment</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='flex gap-6'
      >
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <ArrowLeftRight className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Transfer Batch</CardTitle>
                <CardDescription>Send batch to another wallet address</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="batchId">Batch ID</Label>
                <Input
                  id="batchId"
                  placeholder="e.g., 1001"
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiverAddress">Receiver Wallet Address</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="receiverAddress"
                    placeholder="0x..."
                    className="pl-10 font-mono text-sm"
                    value={formData.receiverAddress}
                    onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be a valid Ethereum address starting with 0x
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium text-foreground">Crypto Only</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Transaction will be processed on the blockchain using your connected wallet
                </p>
              </div>

              <Button type="submit" className="w-full">
                Transfer / Purchase Batch
              </Button>
            </form>
          </CardContent>
          </Card>
        <Card className="max-w-2xl">
  <CardHeader>
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
        <Package className="h-6 w-6 text-white" />
      </div>
      <div>
        <CardTitle>Batch Details</CardTitle>
        <CardDescription>Search a batch ID and view its metadata</CardDescription>
      </div>
    </div>
  </CardHeader>

  <CardContent>
    <div className="space-y-6">

      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="searchBatchId">Batch ID</Label>
        <Input
          id="searchBatchId"
          placeholder="Enter batch ID (bytes32 or hex)"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="font-mono"
        />
        <Button onClick={() => fetch(batchId)} className="w-full mt-2">
          Search Batch
        </Button>
      </div>

      {/* Result Box */}
      {batchData && (
        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Price</span>
            <span className="font-semibold">{batchData.price.toString()} ETH</span>
          </div>

          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Manufacturer</span>
            <span className="font-mono text-xs">{batchData.owner.toString().slice(0,6)}...{batchData.owner.toString().slice(-4)}</span>
          </div>

          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Expiry</span>
            <span className="font-medium">{new Date(Number(batchData.expiry) * 1000).toLocaleDateString()}</span>
          </div>

          <div className="text-sm flex justify-between">
            <span className="text-muted-foreground">Status</span>
              {batchData.status}
          </div>
        </div>
      )}
      </div>
    </CardContent>
    </Card>

      </motion.div>
    </div>
  );
}
