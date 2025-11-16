import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Undo2 } from 'lucide-react';

export default function Returns() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    batchId: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.batchId || !formData.reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Return Request Submitted',
      description: 'Your return request has been recorded on the blockchain',
    });
    
    setFormData({ batchId: '', reason: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Returns & Refunds</h1>
        <p className="text-muted-foreground">Request a batch return with reason</p>
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
                <Undo2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Return Request</CardTitle>
                <CardDescription>Submit a return request for a batch</CardDescription>
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
                <Label htmlFor="reason">Reason for Return</Label>
                <Textarea
                  id="reason"
                  placeholder="Describe the reason for returning this batch..."
                  rows={6}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Provide detailed information about why you're returning this batch
                </p>
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <strong>Note:</strong> Return requests are immutable once submitted to the blockchain.
                  Please ensure all information is accurate.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Request Return
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
