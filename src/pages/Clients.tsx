import React, { useState } from 'react';
import { Plus, Grid, List, Search, Filter, Users, Mail, Phone, Building, TrendingUp, X, Star, Heart, UserPlus, Flame } from 'lucide-react';
import { mockClients, mockProjects, mockTasks } from '../data/mockData';
import ClientProfile from '../components/ClientProfile';

const Clients = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'cases'>('active');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filters.status || client.status === filters.status;
    const matchesTab = activeTab === 'active' ? client.status === 'active' :
                      activeTab === 'history' ? client.status === 'inactive' || client.status === 'churn' :
                      activeTab === 'cases' ? client.tags.includes('Case') : true;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getClientStats = (clientId: string) => {
    const clientProjects = mockProjects.filter(project => project.clientId === clientId);
    const clientTasks = mockTasks.filter(task => task.clientId === clientId);
    const completedTasks = clientTasks.filter(task => task.status === 'done').length;
    const totalTasks = clientTasks.length;
    
    return {
      projectCount: clientProjects.length,
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'onboarding': return 'bg-blue-100 text-blue-800';
      case 'churn': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'onboarding': return 'Onboarding';
      case 'churn': return 'Perdido';
      default: return status;
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const isNewClient = (client: any) => {
    const daysSinceCreated = Math.floor((Date.now() - new Date(client.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCreated <= 30;
  };

  return (
    <div className="flex space-x-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">Gerencie seus clientes e relacionamentos</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cases'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cases
            </button>
          </nav>
        </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="border border-gray-200 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Filtros</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      value={filters.status || ''}
                      onChange={(e) => setFilters({...filters, status: e.target.value || undefined})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todos</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="onboarding">Onboarding</option>
                      <option value="churn">Perdido</option>
                    </select>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <button
                      onClick={() => setFilters({})}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Limpar filtros
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Clients Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => {
              const stats = getClientStats(client.id);

              return (
                <div 
                  key={client.id} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  {/* Client Cover */}
                  <div 
                    className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative"
                    style={{ 
                      backgroundImage: client.cover ? `url(${client.cover})` : `linear-gradient(135deg, ${client.color}40, ${client.color}80)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      {isNewClient(client) && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Novo
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {getStatusLabel(client.status)}
                      </span>
                    </div>
                  </div>

                  {/* Client Content */}
                  <div className="p-4">
                    {/* Avatar and Name */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: client.color }}
                      >
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-500">
                          Desde {new Date(client.startDate).getFullYear()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mb-3">
                      <button className="flex-1 bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                        {client.segment || 'Segmento'}
                      </button>
                      <button className="flex-1 bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                        {getStatusLabel(client.status)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Projetos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tarefas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => {
                  const stats = getClientStats(client.id);

                  return (
                  <tr key={client.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClient(client)}>
                    <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: client.color }}
                          >
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{client.name}</div>
                            {client.phone && (
                              <div className="text-sm text-gray-600">{client.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{client.company || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{client.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(client.status)}`}>
                          {getStatusLabel(client.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{stats.projectCount}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{stats.completedTasks}/{stats.totalTasks}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-green-600">
                          {client.contractValue ? `R$ ${(client.contractValue / 1000).toFixed(0)}k` : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>

      {/* Sidebar with Metrics */}
      <div className="w-80 space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Produtividade do time</p>
              <p className="text-2xl font-bold text-gray-900">68/mês</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Projetos pausados</p>
              <p className="text-2xl font-bold text-gray-900">12/50</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Nível de satisfação</p>
              <p className="text-2xl font-bold text-gray-900">8/10</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Clientes em onboarding</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Profile Modal */}
      {selectedClient && (
        <ClientProfile 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}
    </div>
  );
};

export default Clients;