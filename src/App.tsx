import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardView } from "@/components/views/DashboardView";
import { IngestView } from "@/components/views/IngestView";
import { ApiKeysView } from "@/components/views/ApiKeysView";
import { ApiUsageView } from "@/components/views/ApiUsageView";
import { PlaygroundView } from "@/components/views/PlaygroundView";
import { DocumentsView } from "@/components/views/DocumentsView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />

          {/* ── Protected app shell ── */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard"  element={<DashboardView />} />
            <Route path="ingest"     element={<IngestView />} />
            <Route path="documents"  element={<DocumentsView />} />
            <Route path="api-keys"   element={<ApiKeysView />} />
            <Route path="usage"      element={<ApiUsageView />} />
            <Route path="playground" element={<PlaygroundView />} />
          </Route>

          {/* Legacy redirects so old /dashboard bookmarks still work */}
          <Route path="/dashboard"  element={<Navigate to="/app/dashboard"  replace />} />
          <Route path="/ingest"     element={<Navigate to="/app/ingest"     replace />} />
          <Route path="/documents"  element={<Navigate to="/app/documents"  replace />} />
          <Route path="/api-keys"   element={<Navigate to="/app/api-keys"   replace />} />
          <Route path="/usage"      element={<Navigate to="/app/usage"      replace />} />
          <Route path="/playground" element={<Navigate to="/app/playground" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
