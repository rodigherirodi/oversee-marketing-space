
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  UserPlus
} from 'lucide-react';

const CRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('');

  // Dados simulados do CRM
  const leads = [
    {
      id: '1',
      name: 'TechStart Ltda',
      contact: 'João Silva',
      email: 'joao@techstart.com',
      phone: '(11) 99999-9999',
      value: 85000,
      stage: 'Qualificado',
      probability: 70,
      lastContact: '2024-01-20',
      source: 'Website'
    },
    {
      id: '2',
      name: 'Inovação Digital',
      contact: 'Maria Santos',
      email: 'maria@inovacao.com',
      phone: '(11) 88888-8888',
      value: 120000,
      stage: 'Proposta',
      probability: 85,
      lastContact: '2024-01-19',
      source: 'Indicação'
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead': return 'bg-gray-100 text-gray-700';
      case 'Qualificado': return 'bg-blue-100 text-blue-700';
      case 'Proposta': return 'bg-yellow-100 text-yellow-700';
      case 'Negociação': return 'bg-orange-100 text-orange-700';
      case 'Fechado': return 'bg-green-100 text-green-700';
      case 'Perdido': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600">Gerencie leads e oportunidades de vendas</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Lead
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-gray-600">Leads Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">R$ 245.000</p>
                <p className="text-sm text-gray-600">Pipeline Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">R$ 62.500</p>
                <p className="text-sm text-gray-600">Ticket Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos os estágios</option>
          <option value="lead">Lead</option>
          <option value="qualified">Qualificado</option>
          <option value="proposal">Proposta</option>
          <option value="negotiation">Negociação</option>
          <option value="won">Fechado</option>
          <option value="lost">Perdido</option>
        </select>
      </div>

      {/* Pipeline Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Vendas</CardTitle>
          <CardDescription>Visão geral do funil de vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Lead', 'Qualificado', 'Proposta', 'Negociação', 'Fechado'].map((stage, index) => (
              <div key={stage} className="text-center">
                <div className={`w-full h-20 rounded-lg flex items-center justify-center ${getStageColor(stage)}`}>
                  <div>
                    <p className="font-semibold">{stage}</p>
                    <p className="text-sm">
                      {stage === 'Lead' && '8 leads'}
                      {stage === 'Qualificado' && '6 leads'}
                      {stage === 'Proposta' && '4 leads'}
                      {stage === 'Negociação' && '3 leads'}
                      {stage === 'Fechado' && '3 leads'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Leads e Oportunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                      <p className="text-sm text-gray-600">{lead.contact}</p>
                    </div>
                    <Badge className={getStageColor(lead.stage)}>
                      {lead.stage}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">R$ {lead.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{lead.probability}% probabilidade</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {lead.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Último contato: {new Date(lead.lastContact).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${lead.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{lead.probability}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRM;
