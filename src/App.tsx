import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { TrilhasProvider } from "@/contexts/TrilhasContext";
import { ChatProvider } from "@/contexts/ChatContext";
import Index from "./pages/Index";
import Productivity from "./pages/Productivity";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import Team from "./pages/Team";
import Briefings from "./pages/Briefings";
import Cases from "./pages/Cases";
import Access from "./pages/Access";
import Trilhas from "./pages/Trilhas";
import Cursos from "./pages/Cursos";
import Guias from "./pages/Guias";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import NotFound from "./pages/NotFound";
import CulturaAgenda from "./pages/CulturaAgenda";
import CulturaOnboarding from "./pages/CulturaOnboarding";
import CulturaPDI from "./pages/CulturaPDI";
import CulturaReconhecimento from "./pages/CulturaReconhecimento";
import CulturaManual from "./pages/CulturaManual";
import CulturaFeedback from "./pages/CulturaFeedback";
import ComercialCRM from "./pages/ComercialCRM";
import ComercialActivities from "./pages/ComercialActivities";
import ComercialPlaybooks from "./pages/ComercialPlaybooks";
import ComercialMoney from "./pages/ComercialMoney";
import GestaoGerenciamento from "./pages/GestaoGerenciamento";
import GestaoAdmin from "./pages/GestaoAdmin";
import GestaoRelatorios from "./pages/GestaoRelatorios";
import GestaoConfiguracoes from "./pages/GestaoConfiguracoes";
import GestaoAuditoria from "./pages/GestaoAuditoria";
import GestaoRH from "./pages/GestaoRH";
import GestaoFinanceiro from "./pages/GestaoFinanceiro";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <TaskProvider>
              <TrilhasProvider>
                <ChatProvider>
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={<Navigate to="/productivity" replace />} />
                    <Route
                      path="/productivity"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Productivity />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tasks"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Tasks />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/projects"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Projects />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/clients"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Clients />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/team"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Team />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/briefings"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Briefings />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cases"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Cases />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/access"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Access />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/trilhas"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Trilhas />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cursos"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Cursos />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/guias"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Guias />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cultura/agenda"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <CulturaAgenda />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cultura/onboarding"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <CulturaOnboarding />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cultura/pdi"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <CulturaPDI />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cultura/reconhecimento"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <CulturaReconhecimento />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cultura/manual"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <CulturaManual />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cultura/feedback"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <CulturaFeedback />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/comercial/crm"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <ComercialCRM />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/comercial/activities"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <ComercialActivities />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/comercial/playbooks"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <ComercialPlaybooks />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/comercial/money"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <ComercialMoney />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestao/gerenciamento"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <GestaoGerenciamento />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestao/admin"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <GestaoAdmin />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestao/relatorios"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <GestaoRelatorios />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestao/configuracoes"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <GestaoConfiguracoes />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestao/auditoria"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <GestaoAuditoria />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestao/rh"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <GestaoRH />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/gestao/financeiro"
                      element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <GestaoFinanceiro />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ChatProvider>
              </TrilhasProvider>
            </TaskProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
