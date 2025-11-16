import { motion } from 'framer-motion';
import { Package, ArrowLeftRight, Undo2, TrendingUp, PackagePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Total Batches',
    value: '156',
    change: '+12%',
    icon: Package,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Active Transfers',
    value: '23',
    change: '+5%',
    icon: ArrowLeftRight,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Return Requests',
    value: '8',
    change: '-3%',
    icon: Undo2,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Success Rate',
    value: '94.2%',
    change: '+2.1%',
    icon: TrendingUp,
    gradient: 'from-green-500 to-emerald-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your supply chain operations</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="overflow-hidden transition-all hover:shadow-elegant">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Batch #{1000 + i} transferred</p>
                    <p className="text-xs text-muted-foreground">{i} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <button className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:bg-primary/5">
                <PackagePlus className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Create New Batch</p>
                  <p className="text-xs text-muted-foreground">Register a new drug batch</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:bg-primary/5">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Transfer Batch</p>
                  <p className="text-xs text-muted-foreground">Send batch to another address</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
