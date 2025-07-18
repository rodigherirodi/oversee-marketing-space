import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Target,
  CheckSquare, 
  FolderOpen, 
  Users, 
  UserCheck,
  Factory,
  GraduationCap,
  Heart,
  DollarSign,
  BarChart3,
  FileText,
  Award,
  Key,
  LucideIcon
} from 'lucide-react';

export interface WorkspacePage {
  name: string;
  path: string;
  icon: LucideIcon;
}

export interface Workspace {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  pages: WorkspacePage[];
}

const workspaces: Workspace[] = [
  {
    id: 'operacao',
    name: 'Operação',
    icon: Factory,
    color: 'bg-blue-100 text-blue-700',
    pages: [
      { name: 'Produtividade', path: '/', icon: Target },
      { name: 'Tarefas', path: '/tasks', icon: CheckSquare },
      { name: 'Projetos', path: '/projects', icon: FolderOpen },
      { name: 'Clientes', path: '/clients', icon: Users },
      { name: 'Time', path: '/team', icon: UserCheck },
      { name: 'Briefings', path: '/briefings', icon: FileText },
      { name: 'Cases', path: '/cases', icon: Award },
      { name: 'Acessos', path: '/access', icon: Key }
    ]
  },
  {
    id: 'academy',
    name: 'Academy',
    icon: GraduationCap,
    color: 'bg-purple-100 text-purple-700',
    pages: []
  },
  {
    id: 'cultura',
    name: 'Cultura',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    pages: []
  },
  {
    id: 'comercial',
    name: 'Comercial',
    icon: DollarSign,
    color: 'bg-green-100 text-green-700',
    pages: []
  },
  {
    id: 'gestao',
    name: 'Gestão',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-700',
    pages: []
  }
];

interface WorkspaceContextType {
  activeWorkspace: Workspace;
  setActiveWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
  getCurrentPage: (pathname: string) => WorkspacePage | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  // Default to "Operação" workspace
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(workspaces[0]);

  const getCurrentPage = (pathname: string): WorkspacePage | null => {
    return activeWorkspace.pages.find(page => page.path === pathname) || null;
  };

  return (
    <WorkspaceContext.Provider 
      value={{ 
        activeWorkspace, 
        setActiveWorkspace, 
        workspaces, 
        getCurrentPage 
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
