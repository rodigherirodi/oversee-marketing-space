
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { TrilhasProvider } from "@/contexts/TrilhasContext";
import { ChatProvider } from "@/contexts/ChatContext";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Team = lazy(() => import("./pages/Team"));
const Clients = lazy(() => import("./pages/Clients"));
const ClientProfile = lazy(() => import("./pages/ClientProfile"));
const CRM = lazy(() => import("./pages/comercial/CRM"));
const LeadDetail = lazy(() => import("./pages/comercial/LeadDetail"));
const Activities = lazy(() => import("./pages/comercial/Activities"));
const Money = lazy(() => import("./pages/comercial/Money"));
const Playbooks = lazy(() => import("./pages/comercial/Playbooks"));
const Trilhas = lazy(() => import("./pages/Trilhas"));
const TrilhaDetail = lazy(() => import("./pages/TrilhaDetail"));
const Cursos = lazy(() => import("./pages/Cursos"));
const Guias = lazy(() => import("./pages/Guias"));
const Briefings = lazy(() => import("./pages/Briefings"));
const Cases = lazy(() => import("./pages/Cases"));
const Onboarding = lazy(() => import("./pages/cultura/Onboarding"));
const Agenda = lazy(() => import("./pages/cultura/Agenda"));
const Productivity = lazy(() => import("./pages/Productivity"));
const AnalyticalDashboard = lazy(() => import("./pages/AnalyticalDashboard"));
const Gerenciamento = lazy(() => import("./pages/gestao/Gerenciamento"));
const Admin = lazy(() => import("./pages/gestao/Admin"));
const Access = lazy(() => import("./pages/Access"));
const Chat = lazy(() => import("./pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <TaskProvider>
            <TrilhasProvider>
              <ChatProvider>
                <Toaster />
                <BrowserRouter>
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>}>
                    <Routes>
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Index />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Dashboard />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/tasks" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Tasks />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/projects" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Projects />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/projects/:id" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <ProjectDetail />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/team" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Team />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/clients" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Clients />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/clients/:id" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <ClientProfile />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/comercial/crm" element={
                        <ProtectedRoute requiredWorkspace="comercial">
                          <AuthenticatedLayout>
                            <CRM />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/comercial/leads/:id" element={
                        <ProtectedRoute requiredWorkspace="comercial">
                          <AuthenticatedLayout>
                            <LeadDetail />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/comercial/activities" element={
                        <ProtectedRoute requiredWorkspace="comercial">
                          <AuthenticatedLayout>
                            <Activities />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/comercial/money" element={
                        <ProtectedRoute requiredWorkspace="comercial">
                          <AuthenticatedLayout>
                            <Money />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/comercial/playbooks" element={
                        <ProtectedRoute requiredWorkspace="comercial">
                          <AuthenticatedLayout>
                            <Playbooks />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/trilhas" element={
                        <ProtectedRoute requiredWorkspace="academy">
                          <AuthenticatedLayout>
                            <Trilhas />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/trilhas/:id" element={
                        <ProtectedRoute requiredWorkspace="academy">
                          <AuthenticatedLayout>
                            <TrilhaDetail />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cursos" element={
                        <ProtectedRoute requiredWorkspace="academy">
                          <AuthenticatedLayout>
                            <Cursos />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/guias" element={
                        <ProtectedRoute requiredWorkspace="academy">
                          <AuthenticatedLayout>
                            <Guias />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/briefings" element={
                        <ProtectedRoute requiredWorkspace="academy">
                          <AuthenticatedLayout>
                            <Briefings />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cases" element={
                        <ProtectedRoute requiredWorkspace="academy">
                          <AuthenticatedLayout>
                            <Cases />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cultura/onboarding" element={
                        <ProtectedRoute requiredWorkspace="cultura">
                          <AuthenticatedLayout>
                            <Onboarding />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/cultura/agenda" element={
                        <ProtectedRoute requiredWorkspace="cultura">
                          <AuthenticatedLayout>
                            <Agenda />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/productivity" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Productivity />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/analytics" element={
                        <ProtectedRoute requiredRole="manager">
                          <AuthenticatedLayout>
                            <AnalyticalDashboard />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/gestao/gerenciamento" element={
                        <ProtectedRoute requiredWorkspace="gestao">
                          <AuthenticatedLayout>
                            <Gerenciamento />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/gestao/admin" element={
                        <ProtectedRoute requiredRole="admin">
                          <AuthenticatedLayout>
                            <Admin />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/access" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Access />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/chat" element={
                        <ProtectedRoute>
                          <AuthenticatedLayout>
                            <Chat />
                          </AuthenticatedLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </ChatProvider>
            </TrilhasProvider>
          </TaskProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
