
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
  Home,
  CheckSquare, 
  FolderOpen, 
  Users, 
  UserCheck,
  Search,
  Plus,
  Factory,
  GraduationCap,
  Heart,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import ToolbarShortcuts from './ToolbarShortcuts';

const AppLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Tarefas', icon: CheckSquare, path: '/tasks' },
    { name: 'Projetos', icon: FolderOpen, path: '/projects' },
    { name: 'Clientes', icon: Users, path: '/clients' },
    { name: 'Time', icon: UserCheck, path: '/team' }
  ];

  const workspaces = [
    { name: 'Operação', icon: Factory, color: 'bg-blue-100 text-blue-700' },
    { name: 'Academy', icon: GraduationCap, color: 'bg-purple-100 text-purple-700' },
    { name: 'Cultura', icon: Heart, color: 'bg-pink-100 text-pink-700' },
    { name: 'Comercial', icon: DollarSign, color: 'bg-green-100 text-green-700' },
    { name: 'Gestão', icon: BarChart3, color: 'bg-orange-100 text-orange-700' }
  ];

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
                    <SidebarMenuItem key={workspace.name}>
                      <SidebarMenuButton>
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

            {/* Navigation Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Navegação</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <NavLink to={item.path}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
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
