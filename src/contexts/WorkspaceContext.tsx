import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  LucideIcon,
  Map,
  BookOpen,
  FileQuestion,
  Calendar,
  UserPlus,
  TrendingUp,
  Trophy,
  BookMarked,
  MessageSquare,
  UserCircle,
  BookText,
  Coins,
  Gauge,
  Settings,
  PieChart,
  Cog,
  FileCheck,
  UserCog,
  Calculator,
  Activity
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
    pages: [
      { name: 'Trilhas', path: '/trilhas', icon: Map },
      { name: 'Cursos', path: '/cursos', icon: BookOpen },
      { name: 'Guias', path: '/guias', icon: FileQuestion }
    ]
  },
  {
    id: 'cultura',
    name: 'Cultura',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    pages: [
      { name: 'Agenda & Eventos', path: '/cultura/agenda', icon: Calendar },
      { name: 'Onboarding', path: '/cultura/onboarding', icon: UserPlus },
      { name: 'PDI', path: '/cultura/pdi', icon: TrendingUp },
      { name: 'Reconhecimento', path: '/cultura/reconhecimento', icon: Trophy },
      { name: 'Manual da Cultura', path: '/cultura/manual', icon: BookMarked },
      { name: 'Feedback', path: '/cultura/feedback', icon: MessageSquare }
    ]
  },
  {
    id: 'comercial',
    name: 'Comercial',
    icon: DollarSign,
    color: 'bg-green-100 text-green-700',
    pages: [
      { name: 'CRM', path: '/comercial/crm', icon: UserCircle },
      { name: 'Atividades', path: '/comercial/activities', icon: Activity },
      { name: 'Playbooks', path: '/comercial/playbooks', icon: BookText },
      { name: 'Money', path: '/comercial/money', icon: Coins }
    ]
  },
  {
    id: 'gestao',
    name: 'Gestão',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-700',
    pages: [
      { name: 'Gerenciamento', path: '/gestao/gerenciamento', icon: Gauge },
      { name: 'Admin', path: '/gestao/admin', icon: Settings },
      { name: 'Relatórios', path: '/gestao/relatorios', icon: PieChart },
      { name: 'Configurações', path: '/gestao/configuracoes', icon: Cog },
      { name: 'Auditoria', path: '/gestao/auditoria', icon: FileCheck },
      { name: 'RH', path: '/gestao/rh', icon: UserCog },
      { name: 'Financeiro', path: '/gestao/financeiro', icon: Calculator }
    ]
  }
];

// Mapeamento de workspaces para páginas padrão
const defaultPages = {
  'operacao': '/',
  'academy': '/trilhas',
  'cultura': '/cultura/agenda',
  'comercial': '/comercial/crm',
  'gestao': '/gestao/gerenciamento'
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(workspaces[0]);

  // Determinar workspace ativo baseado na rota atual
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Encontrar o workspace baseado na rota atual
    for (const workspace of workspaces) {
      const isWorkspacePage = workspace.pages.some(page => page.path === currentPath);
      if (isWorkspacePage) {
        setActiveWorkspace(workspace);
        return;
      }
    }
  }, [location.pathname]);

  // Função para trocar workspace e navegar para página padrão
  const handleWorkspaceChange = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    const defaultPath = defaultPages[workspace.id as keyof typeof defaultPages];
    if (defaultPath && location.pathname !== defaultPath) {
      navigate(defaultPath);
    }
  };

  const getCurrentPage = (pathname: string): WorkspacePage | null => {
    return activeWorkspace.pages.find(page => page.path === pathname) || null;
  };

  return (
    <WorkspaceContext.Provider 
      value={{ 
        activeWorkspace, 
        setActiveWorkspace: handleWorkspaceChange, 
        workspaces, 
        getCurrentPage 
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
