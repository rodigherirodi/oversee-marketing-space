
import React, { useState } from 'react';
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  FileText, 
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Home,
  BarChart3,
  Calendar,
  Search,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  selectedWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedWorkspace, 
  onWorkspaceChange 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    workspaces: true,
    navigation: true
  });

  const workspaces = [
    { name: 'Cliente A', icon: '🏢', color: 'bg-blue-100 text-blue-700' },
    { name: 'Cliente B', icon: '🚀', color: 'bg-purple-100 text-purple-700' },
    { name: 'Projetos Internos', icon: '⚡', color: 'bg-green-100 text-green-700' },
    { name: 'Templates', icon: '📋', color: 'bg-orange-100 text-orange-700' }
  ];

  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/', active: true },
    { name: 'Tarefas', icon: CheckSquare, path: '/tasks' },
    { name: 'Projetos', icon: FolderOpen, path: '/projects' },
    { name: 'Clientes', icon: Users, path: '/clients' },
    { name: 'Comercial', icon: DollarSign, path: '/commercial' },
    { name: 'Documentos', icon: FileText, path: '/docs' },
    { name: 'Relatórios', icon: BarChart3, path: '/reports' },
    { name: 'Calendário', icon: Calendar, path: '/calendar' }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            O
          </div>
          <span className="font-semibold text-gray-900 text-lg">Oversee</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Workspaces Section */}
      <div className="px-4 pb-4">
        <button
          onClick={() => toggleSection('workspaces')}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
        >
          <span>Workspaces</span>
          {expandedSections.workspaces ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.workspaces && (
          <div className="space-y-1">
            {workspaces.map((workspace) => (
              <button
                key={workspace.name}
                onClick={() => onWorkspaceChange(workspace.name)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedWorkspace === workspace.name
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${workspace.color}`}>
                  {workspace.icon}
                </span>
                <span className="truncate">{workspace.name}</span>
              </button>
            ))}
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Novo workspace</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <div className="px-4 flex-1">
        <button
          onClick={() => toggleSection('navigation')}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
        >
          <span>Navegação</span>
          {expandedSections.navigation ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.navigation && (
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors w-full">
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </button>
      </div>
    </div>
  );
};
