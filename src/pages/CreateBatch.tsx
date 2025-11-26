import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PackagePlus } from 'lucide-react';
import {useContract} from "@/hooks/useContract";
import { form } from 'viem/chains';

export default function CreateBatch() {
  const {getContractWrite} = useContract('basicmechanism');
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    manufacturer_address: '',
    batchName: '',
    quantity: 0,
    expiryDate: '',
    price: 0,
    ipfshash: '0x0000000000000000000000000000000000000000'
  });
  const ipfshash="0x0000000000000000000000000000000000000000"; //placeholder for IPFS hash
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.batchName || !formData.quantity || !formData.expiryDate || !formData.manufacturer_address) {
    return toast({
      title: 'Error',
      description: 'Please fill in all fields',
      variant: 'destructive',
    });
  }

  try {
    // Convert types
    setFormData({ manufacturer_address: formData.manufacturer_address, batchName: formData.batchName, quantity: formData.quantity, expiryDate: formData.expiryDate, price: formData.price, ipfshash:formData.ipfshash });
    const expiry = Math.floor(new Date(formData.expiryDate).getTime() / 1000);
    console.log("manufacturer_address:", formData.manufacturer_address);
    console.log("expiry:", expiry);
    console.log("price:", formData.price);
    console.log("ipfshash:", formData.ipfshash);
    
    const contract = await getContractWrite();
    const tx = await contract.createBatch(formData.manufacturer_address, expiry,formData.price, formData.ipfshash);
    await tx.wait();
    alert("Batch Created!");
  

    toast({
      title: "Success",
      description: "Batch created successfully on the blockchain",
    });
    // Reset form
    setFormData({
      manufacturer_address: '',
      batchName: '',
      quantity: 0,
      expiryDate: '',
      price: 0,
      ipfshash: ''
    });

  } catch (error) {
    toast({
      title: "Blockchain Error",
      description: error.message,
      variant: "destructive",
    });
  }
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
                  value={Number(formData.quantity)}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
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

               <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 10000"
                  value={Number(formData.price)}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
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
