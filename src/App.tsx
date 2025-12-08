import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AddTransaction from "./pages/AddTransaction";
import Statistics from "./pages/Statistics";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/budgets" element={<Settings />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
