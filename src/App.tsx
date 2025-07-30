
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Tasks from '@/pages/Tasks';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Team from '@/pages/Team';
import Clients from '@/pages/Clients';
import ClientProfile from '@/pages/ClientProfile';
import Trilhas from '@/pages/Trilhas';
import TrilhaDetail from '@/pages/TrilhaDetail';
import Cursos from '@/pages/Cursos';
import Briefings from '@/pages/Briefings';
import Guias from '@/pages/Guias';
import Cases from '@/pages/Cases';
import CRM from '@/pages/comercial/CRM';
import LeadDetail from '@/pages/comercial/LeadDetail';
import Activities from '@/pages/comercial/Activities';
import Money from '@/pages/comercial/Money';
import Playbooks from '@/pages/comercial/Playbooks';
import Agenda from '@/pages/cultura/Agenda';
import Onboarding from '@/pages/cultura/Onboarding';
import Gerenciamento from '@/pages/gestao/Gerenciamento';
import Admin from '@/pages/gestao/Admin';
import Chat from '@/pages/Chat';
import Access from '@/pages/Access';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import NotFound from '@/pages/NotFound';
import { TaskProvider } from '@/contexts/TaskContext';
import { TrilhasProvider } from '@/contexts/TrilhasContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import AnalyticalDashboard from './pages/AnalyticalDashboard';
import Productivity from './pages/Productivity';
import TeamMemberProfile from './pages/TeamMemberProfile';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <TrilhasProvider>
              <ChatProvider>
                <div className="min-h-screen bg-background">
                  <Toaster />
                  <Routes>
                    {/* Public routes */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/404" element={<NotFound />} />

                    {/* Protected routes */}
                    <Route path="/*" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                      <Route path="*" element={
                        <TaskProvider>
                          <AuthenticatedLayout><Outlet /></AuthenticatedLayout>
                        </TaskProvider>
                      }>
                        <Route path="" element={<Index />} />
                        <Route path="dashboard" element={<AnalyticalDashboard />} />
                        <Route path="productivity" element={<Productivity />} />
                        
                        {/* Tasks routes */}
                        <Route path="tasks" element={<Tasks />} />
                        
                        {/* Projects routes */}
                        <Route path="projects" element={<Projects />} />
                        <Route path="projects/:id" element={<ProjectDetail />} />
                        
                        {/* Team routes */}
                        <Route path="team" element={<Team />} />
                        <Route path="team/:id" element={<TeamMemberProfile />} />
                        
                        {/* Client routes */}
                        <Route path="clients" element={<Clients />} />
                        <Route path="clients/:id" element={<ClientProfile />} />
                        
                        {/* Trilhas routes */}
                        <Route path="trilhas" element={<Trilhas />} />
                        <Route path="trilhas/:id" element={<TrilhaDetail />} />
                        
                        {/* Learning routes */}
                        <Route path="cursos" element={<Cursos />} />
                        <Route path="briefings" element={<Briefings />} />
                        <Route path="guias" element={<Guias />} />
                        <Route path="cases" element={<Cases />} />
                        
                        {/* Commercial routes */}
                        <Route path="comercial/crm" element={<CRM />} />
                        <Route path="comercial/crm/:id" element={<LeadDetail />} />
                        <Route path="comercial/activities" element={<Activities />} />
                        <Route path="comercial/money" element={<Money />} />
                        <Route path="comercial/playbooks" element={<Playbooks />} />
                        
                        {/* Culture routes */}
                        <Route path="cultura/agenda" element={<Agenda />} />
                        <Route path="cultura/onboarding" element={<Onboarding />} />
                        
                        {/* Management routes */}
                        <Route path="gestao/gerenciamento" element={<Gerenciamento />} />
                        <Route path="gestao/admin" element={<Admin />} />
                        
                        {/* Communication routes */}
                        <Route path="chat" element={<Chat />} />
                        <Route path="access" element={<Access />} />
                      </Route>
                    </Route>

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </div>
              </ChatProvider>
            </TrilhasProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
