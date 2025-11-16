import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftRight, Wallet } from 'lucide-react';

export default function Transfers() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    batchId: '',
    receiverAddress: '',
  });

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
      </motion.div>
    </div>
  );
}
