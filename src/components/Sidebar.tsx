import { NavLink } from '@/components/NavLink';
import { LayoutDashboard, PackagePlus, Package, ArrowLeftRight, Undo2,Users } from 'lucide-react';

const navItems = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Create Batch', href: '/create-batch', icon: PackagePlus },
  { title: 'All Batches', href: '/batches', icon: Package },
  { title: 'Transfer / Purchase', href: '/transfers', icon: ArrowLeftRight },
  { title: 'Returns & Refunds', href: '/returns', icon: Undo2 },
  { title: 'Owner Options', href: '/ownerOptions', icon: Users }
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card">
      <nav className="flex h-full flex-col gap-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
