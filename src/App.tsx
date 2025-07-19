
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WorkspaceProvider>
        <TrilhasProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TrilhasProvider>
      </WorkspaceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
