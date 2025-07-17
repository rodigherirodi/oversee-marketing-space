
import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Calendar, Plus, Filter, Search } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  probability: number;
  createdAt: string;
  expectedClose: string;
  responsible: string;
}

const Commercial = () => {
  const [leads] = useState<Lead[]>([
    {
      id: '1',
      name: 'João Silva',
      company: 'TechStart',
      email: 'joao@techstart.com',
      phone: '(11) 99999-9999',
      source: 'Website',
      status: 'qualified',
      value: 25000,
      probability: 70,
      createdAt: '2024-11-10',
      expectedClose: '2024-12-15',
      responsible: 'Ana Costa'
    },
    {
      id: '2',
      name: 'Maria Santos',
      company: 'E-commerce Plus',
      email: 'maria@ecommerceplus.com',
      phone: '(21) 88888-8888',
      source: 'Indicação',
      status: 'proposal',
      value: 45000,
      probability: 60,
      createdAt: '2024-11-05',
      expectedClose: '2024-12-01',
      responsible: 'Pedro Lima'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || lead.status === selectedStatus;
    const matchesSource = !selectedSource || lead.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'qualified': return 'bg-green-100 text-green-700';
      case 'proposal': return 'bg-yellow-100 text-yellow-700';
      case 'negotiation': return 'bg-orange-100 text-orange-700';
      case 'closed-won': return 'bg-emerald-100 text-emerald-700';
      case 'closed-lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'qualified': return 'Qualificado';
      case 'proposal': return 'Proposta';
      case 'negotiation': return 'Negociação';
      case 'closed-won': return 'Fechado - Ganho';
      case 'closed-lost': return 'Fechado - Perdido';
      default: return status;
    }
  };

  const totalValue = filteredLeads.reduce((acc, lead) => acc + lead.value, 0);
  const weightedValue = filteredLeads.reduce((acc, lead) => acc + (lead.value * lead.probability / 100), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comercial</h1>
              <p className="text-gray-600">Gerencie leads e oportunidades de negócio</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Novo Lead</span>
            </button>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-2">Total de Leads</div>
                  <div className="text-2xl font-bold text-gray-900">{filteredLeads.length}</div>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-2">Valor Total</div>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {totalValue.toLocaleString('pt-BR')}
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-2">Valor Ponderado</div>
                  <div className="text-2xl font-bold text-purple-600">
                    R$ {Math.round(weightedValue).toLocaleString('pt-BR')}
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-2">Taxa de Conversão</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round((filteredLeads.filter(l => l.status === 'closed-won').length / filteredLeads.length) * 100 || 0)}%
                  </div>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="new">Novo</option>
              <option value="qualified">Qualificado</option>
              <option value="proposal">Proposta</option>
              <option value="negotiation">Negociação</option>
              <option value="closed-won">Fechado - Ganho</option>
              <option value="closed-lost">Fechado - Perdido</option>
            </select>

            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as fontes</option>
              <option value="Website">Website</option>
              <option value="Indicação">Indicação</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Email">Email</option>
              <option value="Telefone">Telefone</option>
            </select>
          </div>
        </div>

        {/* Pipeline de Vendas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pipeline de Vendas</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {['new', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'].map(status => {
              const statusLeads = filteredLeads.filter(lead => lead.status === status);
              const statusValue = statusLeads.reduce((acc, lead) => acc + lead.value, 0);
              
              return (
                <div key={status} className="border rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {getStatusLabel(status)}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {statusLeads.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    R$ {statusValue.toLocaleString('pt-BR')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Leads</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probabilidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.company}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {lead.value.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${lead.probability}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{lead.probability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(lead.expectedClose).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.responsible}
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
