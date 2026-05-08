import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/app/DashboardPage";
import PlanPage from "./pages/app/PlanPage";
import InboxPage from "./pages/app/InboxPage";
import SendPage from "./pages/app/SendPage";
import ApiKeysPage from "./pages/app/ApiKeysPage";
import AdminPage from "./pages/app/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="send" element={<SendPage />} />
            <Route path="api-keys" element={<ApiKeysPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
