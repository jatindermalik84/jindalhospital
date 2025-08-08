import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Login } from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Settings } from "./pages/Settings";
import { CompanyMaster } from "./pages/settings/CompanyMaster";
import { BuildingMaster } from "./pages/settings/BuildingMaster";
import { BranchMaster } from "./pages/settings/BranchMaster";
import { MenuMaster } from "./pages/settings/MenuMaster";
import { RoleMaster } from "./pages/settings/RoleMaster";
import { StaffTypeMaster } from "./pages/settings/StaffTypeMaster";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            >
              <Route path="company" element={<CompanyMaster />} />
              <Route path="buildings" element={<BuildingMaster />} />
              <Route path="branches" element={<BranchMaster />} />
              <Route path="menus" element={<MenuMaster />} />
              <Route path="roles" element={<RoleMaster />} />
              <Route path="staff-types" element={<StaffTypeMaster />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
