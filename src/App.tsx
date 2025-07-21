
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { TrilhasProvider } from "@/contexts/TrilhasContext";
import AppLayout from "./components/AppLayout";
import Productivity from "./pages/Productivity";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Team from "./pages/Team";
import Briefings from "./pages/Briefings";
import Cases from "./pages/Cases";
import Access from "./pages/Access";
import Trilhas from "./pages/Trilhas";
import TrilhaDetail from "./pages/TrilhaDetail";
import Cursos from "./pages/Cursos";
import Guias from "./pages/Guias";
import Chat from "./pages/Chat";
import Agenda from "./pages/cultura/Agenda";
import Onboarding from "./pages/cultura/Onboarding";
import NotFound from "./pages/NotFound";
import Gerenciamento from "./pages/gestao/Gerenciamento";
import Admin from "./pages/gestao/Admin";
import CRM from "./pages/comercial/CRM";
import Playbooks from "./pages/comercial/Playbooks";
import Money from "./pages/comercial/Money";

console.log('Creating QueryClient...');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

console.log('App component rendering...');

const App: React.FC = () => {
  console.log('App render function called');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <WorkspaceProvider>
            <TrilhasProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Productivity />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:id" element={<ProjectDetail />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/:id" element={<ClientProfile />} />
                  <Route path="team" element={<Team />} />
                  <Route path="briefings" element={<Briefings />} />
                  <Route path="cases" element={<Cases />} />
                  <Route path="access" element={<Access />} />
                  <Route path="trilhas" element={<Trilhas />} />
                  <Route path="trilhas/:id" element={<TrilhaDetail />} />
                  <Route path="cursos" element={<Cursos />} />
                  <Route path="guias" element={<Guias />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="cultura/agenda" element={<Agenda />} />
                  <Route path="cultura/onboarding" element={<Onboarding />} />
                  <Route path="comercial/crm" element={<CRM />} />
                  <Route path="comercial/playbooks" element={<Playbooks />} />
                  <Route path="comercial/money" element={<Money />} />
                  <Route path="gestao/gerenciamento" element={<Gerenciamento />} />
                  <Route path="gestao/admin" element={<Admin />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TrilhasProvider>
          </WorkspaceProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
