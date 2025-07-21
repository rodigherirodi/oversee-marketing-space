
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Search,
  Filter,
  Settings,
  BarChart3,
  List,
  Kanban,
  Download
} from 'lucide-react';
import { CRMKanbanBoard } from '@/components/crm/CRMKanbanBoard';
import { CRMListView } from '@/components/crm/CRMListView';
import { CRMMetricsComponent } from '@/components/crm/CRMMetrics';
import { mockLeads, defaultPipeline, mockMetrics } from '@/data/crmMockData';
import { Lead } from '@/types/crm';

const CRM = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = !filterStage || lead.stage === filterStage;
    
    return matchesSearch && matchesStage;
  });

  const handleLeadMove = (leadId: string, newStage: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              stage: newStage, 
              updatedAt: new Date(),
              probability: defaultPipeline.stages.find(s => s.id === newStage)?.probability || lead.probability
            }
          : lead
      )
    );
  };

  const handleLeadEdit = (lead: Lead) => {
    console.log('Edit lead:', lead);
    // TODO: Implementar modal de edição
  };

  const handleLeadView = (lead: Lead) => {
    console.log('View lead:', lead);
    // TODO: Implementar modal de visualização
  };

  const handleLeadDelete = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
  };

  const handleAddLead = (stage: string) => {
    console.log('Add lead to stage:', stage);
    // TODO: Implementar modal de criação de lead
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Avançado</h1>
          <p className="text-gray-600">Gerencie leads e oportunidades com inteligência</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Métricas Compactas */}
      <CRMMetricsComponent metrics={mockMetrics} />

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome, empresa ou email..."
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
              {defaultPipeline.stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Mais Filtros
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={view === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('kanban')}
              >
                <Kanban className="w-4 h-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('list')}
              >
                <List className="w-4 h-4 mr-2" />
                Lista
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-600">Pipeline:</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {defaultPipeline.name}
            </Badge>
            <span className="text-xs text-gray-500">
              {filteredLeads.length} de {leads.length} leads
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal com Scroll Limitado */}
      <div className="min-h-[600px] max-h-[calc(100vh-350px)]">
        {view === 'kanban' ? (
          <div className="h-full overflow-x-auto overflow-y-hidden">
            <CRMKanbanBoard
              leads={filteredLeads}
              pipeline={defaultPipeline}
              onLeadMove={handleLeadMove}
              onLeadEdit={handleLeadEdit}
              onLeadView={handleLeadView}
              onLeadDelete={handleLeadDelete}
              onAddLead={handleAddLead}
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <CRMListView
              leads={filteredLeads}
              onLeadEdit={handleLeadEdit}
              onLeadView={handleLeadView}
              onLeadDelete={handleLeadDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CRM;
