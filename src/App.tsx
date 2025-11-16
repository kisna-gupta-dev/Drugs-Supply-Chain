import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "./providers";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CreateBatch from "./pages/CreateBatch";
import Batches from "./pages/Batches";
import Transfers from "./pages/Transfers";
import Returns from "./pages/Returns";
import NotFound from "./pages/NotFound";
import OwnerOptionsPage from "./pages/ownerOptions";
const App = () => (
  <Providers>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create-batch" element={<CreateBatch />} />
                <Route path="/batches" element={<Batches />} />
                <Route path="/transfers" element={<Transfers />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/ownerOptions" element={<OwnerOptionsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </Providers>
);

export default App;
