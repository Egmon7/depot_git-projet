import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LegislativeProvider } from "@/contexts/LegislativeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProposeBill from "./pages/bills/ProposeBill";
import MyBills from "./pages/bills/MyBills";
import PlenaryVoting from "./pages/plenary/PlenaryVoting";
import DeputiesList from "./components/deputies/DeputiesList";
import NotificationCenter from "./pages/NotificationCenter";
import DocumentCenter from "./pages/DocumentCenter";
import Profile from "./pages/Profile";
import ConferenceDashboard from "./pages/dashboard/ConferenceDashboard";
import Statistics from "./pages/Statistics";
import BillsManagement from "./pages/bills/BillsManagement";
import SessionManagement from "./pages/plenary/SessionManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <LegislativeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/propose-bill"
                  element={
                    <ProtectedRoute requiredRole={["depute"]}>
                      <DashboardLayout>
                        <ProposeBill />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/my-bills"
                  element={
                    <ProtectedRoute requiredRole={["depute"]}>
                      <DashboardLayout>
                        <MyBills />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/voting"
                  element={
                    <ProtectedRoute requiredRole={["depute"]}>
                      <DashboardLayout>
                        <PlenaryVoting />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/deputies"
                  element={
                    <ProtectedRoute requiredRole={["president", "rapporteur"]}>
                      <DashboardLayout>
                        <DeputiesList />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/notifications"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <NotificationCenter />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/documents"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DocumentCenter />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Profile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/conference"
                  element={
                    <ProtectedRoute requiredRole={["president"]}>
                      <DashboardLayout>
                        <ConferenceDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/stats"
                  element={
                    <ProtectedRoute requiredRole={["president"]}>
                      <DashboardLayout>
                        <Statistics />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/bills-management"
                  element={
                    <ProtectedRoute requiredRole={["president"]}>
                      <DashboardLayout>
                        <BillsManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/sessions"
                  element={
                    <ProtectedRoute requiredRole={["president"]}>
                      <DashboardLayout>
                        <SessionManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LegislativeProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
