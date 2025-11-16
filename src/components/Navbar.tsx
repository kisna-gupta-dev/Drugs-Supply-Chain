import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Package } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Drug Supply Chain</h1>
            <p className="text-xs text-muted-foreground">Blockchain Management System</p>
          </div>
        </div>
        <ConnectButton />
      </div>
    </nav>
  );
}
