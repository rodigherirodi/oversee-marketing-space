import React, { useState } from 'react';
import { Plus, Filter, Search, TrendingUp, DollarSign, Calendar, Target, Users, X } from 'lucide-react';
import { mockCommercials, mockClients } from '../data/mockData';

const Commercial = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommercials = mockCommercials.filter(commercial => {
    const matchesSearch = commercial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (commercial.notes && commercial.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filters.status || commercial.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalValue = mockCommercials.reduce((sum, c) => sum + c.value, 0);
  const wonValue = mockCommercials.filter(c => c.status === 'won').reduce((sum, c) => sum + c.value, 0);
  const weightedValue = mockCommercials.reduce((sum, c) => sum + (c.value * c.probability / 100), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'lead': return 'Lead';
      case 'proposal': return 'Proposta';
      case 'negotiation': return 'Negociação';
      case 'won': return 'Ganho';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const commercialsByStatus = [
    { status: 'lead', count: mockCommercials.filter(c => c.status === 'lead').length, color: 'bg-blue-500' },
    { status: 'proposal', count: mockCommercials.filter(c => c.status === 'proposal').length, color: 'bg-yellow-500' },
    { status: 'negotiation', count: mockCommercials.filter(c => c.status === 'negotiation').length, color: 'bg-orange-500' },
    { status: 'won', count: mockCommercials.filter(c => c.status === 'won').length, color: 'bg-green-500' },
    { status: 'lost', count: mockCommercials.filter(c => c.status === 'lost').length, color: 'bg-red-500' }
  ];

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Comercial</h1>
          <p className="text-gray-600 mt-1">Gerencie leads, propostas e pipeline de vendas</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nova Oportunidade</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ {(totalValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Ponderado</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ {(weightedValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Negócios Fechados</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ {(wonValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Oportunidades</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mockCommercials.length}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar oportunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

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
                    <option value="lead">Lead</option>
                    <option value="proposal">Proposta</option>
                    <option value="negotiation">Negociação</option>
                    <option value="won">Ganho</option>
                    <option value="lost">Perdido</option>
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

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline por Status</h3>
          <div className="space-y-3">
            {commercialsByStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-700 capitalize">{getStatusLabel(item.status)}</span>
                </div>
                <span className="font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Oportunidades</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Oportunidade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Probabilidade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fechamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCommercials.map((commercial) => (
                  <tr key={commercial.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{commercial.title}</div>
                        <div className="text-sm text-gray-600">{commercial.source}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        R$ {(commercial.value / 1000).toFixed(0)}k
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium ${getProbabilityColor(commercial.probability)}`}>
                        {commercial.probability}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(commercial.status)}`}>
                        {getStatusLabel(commercial.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {new Date(commercial.expectedCloseDate).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commercial;