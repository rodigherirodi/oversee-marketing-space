import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Search,
  Filter,
  Settings,
  Download,
  List,
  Kanban,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CRMKanbanBoard } from '@/components/crm/CRMKanbanBoard';
import { CRMListView } from '@/components/crm/CRMListView';
import { CRMMetricsComponent } from '@/components/crm/CRMMetrics';
import { LeadFormDialog } from '@/components/crm/LeadFormDialog';
import { CRMConfigDialog } from '@/components/crm/CRMConfigDialog';
import { mockLeads, pipelines, calculateMetrics } from '@/data/crmMockData';
import { Lead, LeadFormData } from '@/types/crm';
import { useNavigate, Link } from 'react-router-dom';

const CRM = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedPipeline, setSelectedPipeline] = useState('padrao');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [defaultStage, setDefaultStage] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string>('');

  // Get current pipeline
  const currentPipeline = pipelines.find(p => p.id === selectedPipeline) || pipelines[0];
  
  // Filter leads based on pipeline, search and stage
  const filteredLeads = leads.filter(lead => {
    // Pipeline filter
    const matchesPipeline = selectedPipeline === 'padrao' || lead.pipelineId === selectedPipeline;
    
    // Search filter
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Stage filter
    const matchesStage = !filterStage || lead.stage === filterStage;
    
    return matchesPipeline && matchesSearch && matchesStage;
  });

  // Calculate metrics for current pipeline
  const metrics = calculateMetrics(leads, selectedPipeline);

  const handleLeadMove = (leadId: string, newStage: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              stage: newStage, 
              updatedAt: new Date(),
              probability: currentPipeline.stages.find(s => s.id === newStage)?.probability || lead.probability
            }
          : lead
      )
    );
  };

  const handleLeadSubmit = (formData: LeadFormData) => {
    if (editingLead) {
      // Update existing lead
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === editingLead.id
            ? {
                ...lead,
                ...formData,
                updatedAt: new Date(),
              }
            : lead
        )
      );
      setEditingLead(undefined);
    } else {
      // Create new lead
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        ...formData,
        stage: defaultStage || 'em-contato',
        probability: currentPipeline.stages.find(s => s.id === (defaultStage || 'em-contato'))?.probability || 25,
        createdAt: new Date(),
        updatedAt: new Date(),
        score: Math.floor(Math.random() * 100) + 1,
        status: 'active',
        description: '',
        segment: '',
        relatedContacts: [{
          id: `contact-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          isPrimary: true
        }],
        oneTimeValue: formData.value,
        recurringValue: 0,
        activities: []
      };
      setLeads(prevLeads => [...prevLeads, newLead]);
    }
    setDefaultStage('');
  };

  const handleLeadEdit = (lead: Lead) => {
    setEditingLead(lead);
    setLeadFormOpen(true);
  };

  const handleLeadView = (lead: Lead) => {
    navigate(`/comercial/crm/lead/${lead.id}`);
  };

  const handleLeadDelete = (leadId: string) => {
    setLeadToDelete(leadId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteLead = () => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadToDelete));
    setDeleteDialogOpen(false);
    setLeadToDelete('');
  };

  const handleAddLead = (stage?: string) => {
    setDefaultStage(stage || '');
    setEditingLead(undefined);
    setLeadFormOpen(true);
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/comercial/activities')}
          >
            <Clock className="w-4 h-4 mr-2" />
            Atividades
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setConfigOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => handleAddLead()}
          >
            <Plus className="w-4 h-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Métricas Compactas */}
      <CRMMetricsComponent metrics={metrics} />

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

            <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecionar Pipeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padrao">Padrão (Todos)</SelectItem>
                <SelectItem value="assessoria">Assessoria</SelectItem>
                <SelectItem value="produtora">Produtora</SelectItem>
                <SelectItem value="consultoria">Consultoria</SelectItem>
              </SelectContent>
            </Select>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos os estágios</option>
              {currentPipeline.stages.map(stage => (
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
              {currentPipeline.name}
            </Badge>
            <span className="text-xs text-gray-500">
              {filteredLeads.length} de {leads.length} leads
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal com altura fixa */}
      <div className="h-[500px]">
        {view === 'kanban' ? (
          <CRMKanbanBoard
            leads={filteredLeads}
            pipeline={currentPipeline}
            onLeadMove={handleLeadMove}
            onLeadEdit={handleLeadEdit}
            onLeadDelete={handleLeadDelete}
            onAddLead={handleAddLead}
          />
        ) : (
          <CRMListView
            leads={filteredLeads}
            onLeadEdit={handleLeadEdit}
            onLeadView={handleLeadView}
            onLeadDelete={handleLeadDelete}
            onAddLead={() => handleAddLead()}
          />
        )}
      </div>

      {/* Dialogs */}
      <LeadFormDialog
        open={leadFormOpen}
        onClose={() => {
          setLeadFormOpen(false);
          setEditingLead(undefined);
          setDefaultStage('');
        }}
        onSubmit={handleLeadSubmit}
        lead={editingLead}
        defaultStage={defaultStage}
        defaultPipelineId={selectedPipeline === 'padrao' ? 'assessoria' : selectedPipeline}
      />

      <CRMConfigDialog
        open={configOpen}
        onClose={() => setConfigOpen(false)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteLead} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CRM;
