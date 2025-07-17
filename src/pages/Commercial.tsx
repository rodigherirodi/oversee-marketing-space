
import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Commercial = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const opportunities = [
    {
      id: '1',
      title: 'Website E-commerce - Loja Virtual',
      client: 'Cliente Prospect A',
      value: 45000,
      status: 'proposal',
      probability: 70,
      expectedClose: '2024-02-15',
      stage: 'Proposta Enviada',
      responsible: 'João Silva',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'App Mobile - Delivery',
      client: 'Cliente Prospect B',
      value: 80000,
      status: 'negotiation',
      probability: 85,
      expectedClose: '2024-01-30',
      stage: 'Negociação',
      responsible: 'Maria Santos',
      createdAt: '2024-01-05'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comercial</h1>
          <p className="text-gray-600">Gerencie oportunidades e pipeline de vendas</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar oportunidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="lead">Lead</option>
          <option value="qualified">Qualificado</option>
          <option value="proposal">Proposta</option>
          <option value="negotiation">Negociação</option>
          <option value="won">Ganho</option>
          <option value="lost">Perdido</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pipeline Total</h3>
          <p className="text-2xl font-bold text-gray-900">R$ 125.000</p>
          <p className="text-sm text-green-600 mt-1">+15% vs mês anterior</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Oportunidades Ativas</h3>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-sm text-blue-600 mt-1">3 em negociação</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Taxa de Conversão</h3>
          <p className="text-2xl font-bold text-gray-900">68%</p>
          <p className="text-sm text-green-600 mt-1">+5% vs mês anterior</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Ticket Médio</h3>
          <p className="text-2xl font-bold text-gray-900">R$ 62.500</p>
          <p className="text-sm text-gray-600 mt-1">Últimos 6 meses</p>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Oportunidades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oportunidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probabilidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estágio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{opportunity.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opportunity.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {opportunity.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${opportunity.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{opportunity.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opportunity.status === 'negotiation' ? 'bg-orange-100 text-orange-700' :
                      opportunity.status === 'proposal' ? 'bg-blue-100 text-blue-700' :
                      opportunity.status === 'won' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {opportunity.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(opportunity.expectedClose).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opportunity.responsible}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Commercial;
