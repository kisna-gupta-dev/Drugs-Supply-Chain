import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

const mockBatches = [
  { id: 1001, owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', status: 'Active' },
  { id: 1002, owner: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', status: 'Transferred' },
  { id: 1003, owner: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', status: 'Active' },
  { id: 1004, owner: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', status: 'Returned' },
  { id: 1005, owner: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', status: 'Active' },
];

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
                  {mockBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">#{batch.id}</TableCell>
                      <TableCell className="font-mono text-xs">{batch.owner}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                      </TableCell>
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
