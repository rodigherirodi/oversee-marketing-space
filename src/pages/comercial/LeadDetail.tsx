import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  User, 
  Building2, 
  Edit,
  Trash,
  Clock,
  Tag,
  Plus,
  FileText,
  Send,
  CreditCard
} from 'lucide-react';
import { PipelineProgress } from '@/components/crm/PipelineProgress';
import { ActivityTimeline } from '@/components/crm/ActivityTimeline';
import { EditableField } from '@/components/crm/EditableField';
import { TagEditor } from '@/components/crm/TagEditor';
import { QuickActivityForm } from '@/components/crm/QuickActivityForm';
import { Lead, LeadActivity, ActivityFormData, Pipeline } from '@/types/crm';
import { mockLeads, pipelines } from '@/data/crmMockData';
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

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quickActivityForm, setQuickActivityForm] = useState<{
    open: boolean;
    type: 'call' | 'email' | 'meeting' | null;
  }>({ open: false, type: null });
  
  // Find the lead and its pipeline
  useEffect(() => {
    const foundLead = mockLeads.find(lead => lead.id === id);
    if (foundLead) {
      setLead(foundLead);
      const foundPipeline = pipelines.find(p => p.id === foundLead.pipelineId) || pipelines[0];
      setPipeline(foundPipeline);
    } else {
      navigate('/comercial/crm');
    }
  }, [id, navigate]);

  if (!lead || !pipeline) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleStageChange = (stageId: string) => {
    const updatedLead = { 
      ...lead, 
      stage: stageId,
      probability: pipeline.stages.find(s => s.id === stageId)?.probability || lead.probability,
      updatedAt: new Date()
    };
    setLead(updatedLead);
  };

  const handleFieldUpdate = (field: keyof Lead) => async (value: string | number) => {
    const updatedLead = {
      ...lead,
      [field]: value,
      updatedAt: new Date()
    };
    setLead(updatedLead);
    // In a real app, this would save to backend
  };

  const handleTagsUpdate = async (tags: string[]) => {
    const updatedLead = {
      ...lead,
      tags,
      updatedAt: new Date()
    };
    setLead(updatedLead);
  };

  const handleDeleteLead = () => {
    navigate('/comercial/crm');
  };

  const handleQuickActivity = (type: 'call' | 'email' | 'meeting') => {
    setQuickActivityForm({ open: true, type });
  };

  const handleAddActivity = (activity: ActivityFormData) => {
    const newActivity: LeadActivity = {
      id: `activity-${Date.now()}`,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      createdAt: new Date(),
      createdBy: activity.responsiblePerson,
      responsiblePerson: activity.responsiblePerson,
      dueDate: activity.dueDate,
      completed: activity.completed,
      outcome: activity.outcome
    };
    
    const updatedLead = {
      ...lead,
      activities: [newActivity, ...lead.activities],
      lastContactAt: new Date()
    };
    
    setLead(updatedLead);
  };

  const getSourceLabel = (source: string) => {
    const labels = {
      website: 'Website',
      linkedin: 'LinkedIn',
      indicacao: 'Indicação',
      evento: 'Evento',
      'cold-call': 'Cold Call',
      outro: 'Outro'
    };
    return labels[source as keyof typeof labels] || source;
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-700';
      case 'linkedin': return 'bg-indigo-100 text-indigo-700';
      case 'indicacao': return 'bg-green-100 text-green-700';
      case 'evento': return 'bg-purple-100 text-purple-700';
      case 'cold-call': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const teamMembers = [
    'Maria Santos',
    'Carlos Lima',
    'Ana Silva',
    'Pedro Mendes',
    'Lucia Costa'
  ];

  return (
    <div className="space-y-4">
      {/* Header with breadcrumb and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/comercial/crm')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <EditableField
                value={lead.name}
                onSave={handleFieldUpdate('name')}
                placeholder="Nome do lead"
                displayComponent={<h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>}
              />
              <Badge variant="outline" className="text-sm">
                <EditableField
                  value={lead.company}
                  onSave={handleFieldUpdate('company')}
                  placeholder="Empresa"
                />
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Lead criado em {formatDate(lead.createdAt)}</span>
              <Badge variant="outline" className={`text-xs ${getSourceBadgeColor(lead.source)}`}>
                {getSourceLabel(lead.source)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Quick Activity Form */}
      {quickActivityForm.open && quickActivityForm.type && (
        <QuickActivityForm
          leadId={lead.id}
          leadName={lead.name}
          activityType={quickActivityForm.type}
          teamMembers={teamMembers}
          onSubmit={handleAddActivity}
          onCancel={() => setQuickActivityForm({ open: false, type: null })}
        />
      )}

      {/* Lead pipeline progress */}
      <Card>
        <CardContent className="p-6">
          <PipelineProgress
            pipeline={pipeline}
            currentStage={lead.stage}
            onStageChange={handleStageChange}
          />
        </CardContent>
      </Card>

      {/* Main content with tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column - Lead details */}
        <div className="space-y-4 md:col-span-2">
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="activities">Atividades</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 mt-4">
              {/* Overview card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visão Geral</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <EditableField
                        value={lead.email}
                        onSave={handleFieldUpdate('email')}
                        type="email"
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <EditableField
                        value={lead.phone}
                        onSave={handleFieldUpdate('phone')}
                        type="phone"
                        placeholder="Telefone"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <EditableField
                        value={lead.position}
                        onSave={handleFieldUpdate('position')}
                        placeholder="Cargo"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Responsável: {lead.assignedTo}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">
                        Valor: {formatCurrency(lead.value)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        Última atualização: {formatDate(lead.updatedAt)}
                      </span>
                    </div>
                    {lead.lastContactAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          Último contato: {formatDate(lead.lastContactAt)}
                        </span>
                      </div>
                    )}
                    {lead.nextFollowUp && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-500">
                          Próximo contato: {formatDate(lead.nextFollowUp)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableField
                    value={lead.description || ""}
                    onSave={handleFieldUpdate('description')}
                    type="textarea"
                    placeholder="Clique para adicionar uma descrição..."
                  />
                </CardContent>
              </Card>
              
              {/* Tags and Custom Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TagEditor
                      tags={lead.tags}
                      onSave={handleTagsUpdate}
                    />
                  </CardContent>
                </Card>
                
                {/* Custom Fields */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Campos Personalizados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(lead.customFields).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(lead.customFields).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-gray-500 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Nenhum campo personalizado</span>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Related Contacts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Contatos Relacionados</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lead.relatedContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className={`p-3 rounded-lg border ${contact.isPrimary ? 'bg-gray-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {contact.name}
                            {contact.isPrimary && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Principal
                              </Badge>
                            )}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>{contact.position}</p>
                          <p>{contact.email}</p>
                          <p>{contact.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Histórico de Atividades</h3>
                <Button 
                  size="sm"
                  onClick={() => setQuickActivityForm({ open: true, type: 'call' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Atividade
                </Button>
              </div>
              
              <ActivityTimeline 
                activities={lead.activities}
                onActivityAdd={() => setQuickActivityForm({ open: true, type: 'call' })}
              />
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Produtos e Serviços</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
              
              {lead.products && lead.products.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Produto</th>
                          <th className="text-center p-3">Quantidade</th>
                          <th className="text-right p-3">Valor</th>
                          <th className="text-right p-3">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lead.products.map((product) => (
                          <tr key={product.id} className="border-b">
                            <td className="p-3">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-gray-500">
                                {product.isRecurring ? 'Recorrente' : 'Único'}
                              </div>
                            </td>
                            <td className="text-center p-3">{product.quantity}</td>
                            <td className="text-right p-3">
                              {formatCurrency(product.value)}
                            </td>
                            <td className="text-right p-3 font-medium">
                              {formatCurrency(product.value * product.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="p-3 font-medium text-right">
                            Total:
                          </td>
                          <td className="p-3 font-bold text-right text-green-600">
                            {formatCurrency(lead.value)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhum produto adicionado</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                  >
                    Adicionar o primeiro produto
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Quick actions and related content */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickActivity('call')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Registrar Ligação
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickActivity('email')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar E-mail
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickActivity('meeting')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Reunião
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Criar Proposta
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Gerenciar Tags
              </Button>
            </CardContent>
          </Card>
          
          {/* Lead Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className={`
                  w-24 h-24 rounded-full flex items-center justify-center
                  ${lead.score >= 80 ? 'bg-green-100 text-green-700' : 
                    lead.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                    lead.score >= 40 ? 'bg-orange-100 text-orange-700' : 
                    'bg-red-100 text-red-700'}
                `}>
                  <span className="text-3xl font-bold">{lead.score}</span>
                </div>
              </div>
              <div className="text-center text-sm mt-2">
                <p className="font-medium">
                  {lead.score >= 80 ? 'Excelente' : 
                   lead.score >= 60 ? 'Bom' : 
                   lead.score >= 40 ? 'Médio' : 
                   'Baixo'}
                </p>
                <p className="text-gray-500 mt-1">
                  {lead.score >= 80 ? 'Alta probabilidade de conversão' : 
                   lead.score >= 60 ? 'Boa oportunidade' : 
                   lead.score >= 40 ? 'Necessita atenção' : 
                   'Requer esforço extra para conversão'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Related Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="ghost"
                onClick={() => navigate(`/comercial/activities?leadId=${lead.id}`)}
              >
                <Clock className="w-4 h-4 mr-2" />
                Ver Todas Atividades
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Send className="w-4 h-4 mr-2" />
                Ver Propostas
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <User className="w-4 h-4 mr-2" />
                Gerenciar Contatos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
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
            <AlertDialogAction onClick={handleDeleteLead} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadDetail;
