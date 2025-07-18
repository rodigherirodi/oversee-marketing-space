
import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { 
  Search,
  Plus
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import ToolbarShortcuts from './ToolbarShortcuts';
import WorkspaceBreadcrumb from './WorkspaceBreadcrumb';

const AppLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { activeWorkspace, workspaces, setActiveWorkspace } = useWorkspace();

  const isActive = (path: string) => currentPath === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center space-x-2 px-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                O
              </div>
              <span className="font-semibold text-gray-900 text-lg">Oversee</span>
            </div>
            
            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* Workspaces Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {workspaces.map((workspace) => (
                    <SidebarMenuItem key={workspace.id}>
                      <SidebarMenuButton 
                        onClick={() => setActiveWorkspace(workspace)}
                        isActive={activeWorkspace.id === workspace.id}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${workspace.color}`}>
                          <workspace.icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{workspace.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Plus className="w-4 h-4" />
                      <span>Novo workspace</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Navigation Section - Conditional based on active workspace */}
            {activeWorkspace.pages.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Navegação</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {activeWorkspace.pages.map((page) => (
                      <SidebarMenuItem key={page.name}>
                        <SidebarMenuButton asChild isActive={isActive(page.path)}>
                          <NavLink to={page.path}>
                            <page.icon className="w-4 h-4" />
                            <span>{page.name}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Empty state for workspaces without pages */}
            {activeWorkspace.pages.length === 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>Navegação</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-6 text-center text-sm text-gray-500">
                    <p>Este workspace ainda não possui páginas configuradas.</p>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <WorkspaceBreadcrumb />
            </div>
            <ToolbarShortcuts />
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
