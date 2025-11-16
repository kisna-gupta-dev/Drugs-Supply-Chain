import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PackagePlus } from 'lucide-react';

export default function CreateBatch() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    manufacturer_address: '',
    batchName: '',
    quantity: '',
    expiryDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.batchName || !formData.quantity || !formData.expiryDate || !formData.manufacturer_address) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Batch created successfully on the blockchain',
    });
    
    setFormData({manufacturer_address: '', batchName: '', quantity: '', expiryDate: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Batch</h1>
        <p className="text-muted-foreground">Register a new drug batch on the blockchain</p>
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
                <PackagePlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>New Batch Information</CardTitle>
                <CardDescription>Enter the details of the drug batch</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="batchName">Batch Name</Label>
                <Input
                  id="batchName"
                  placeholder="e.g., Paracetamol-500mg-LOT123"
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer_address">Manufacturer Address</Label>
                <Input
                  id="manufacturer_address"
                  placeholder="e.g., 0x213...abcd"
                  value={formData.manufacturer_address}
                  onChange={(e) => setFormData({ ...formData, manufacturer_address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 10000"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Batch
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
