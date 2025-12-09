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
import InitialBalance from "./pages/InitialBalance";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} handle={{ title: "Trang chủ" }} />
            <Route path="/add" element={<AddTransaction />} handle={{ title: "Thêm giao dịch" }} />
            <Route path="/statistics" element={<Statistics />} handle={{ title: "Thống kê" }} />
            <Route path="/goals" element={<Goals />} handle={{ title: "Mục tiêu" }} />
            <Route path="/settings" element={<Settings />} handle={{ title: "Cài đặt" }} />
            <Route path="/settings/budgets" element={<Settings />} handle={{ title: "Cài đặt" }} />
            <Route path="/transactions" element={<Transactions />} handle={{ title: "Giao dịch" }} />
            <Route path="/initial-balance" element={<InitialBalance />} handle={{ title: "Quản lý số dư" }} />
            <Route path="/search" element={<Search />} handle={{ title: "Tìm kiếm" }} />
            <Route path="/notifications" element={<Notifications />} handle={{ title: "Thông báo" }} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
