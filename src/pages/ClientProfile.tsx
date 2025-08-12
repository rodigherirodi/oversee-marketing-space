
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useStakeholders } from '@/hooks/useStakeholders';
import { usePageLinks } from '@/hooks/usePageLinks';
import { useSupabaseClientAccesses } from '@/hooks/useSupabaseClientAccesses';
import { useSupabaseClientContacts } from '@/hooks/useSupabaseClientContacts';
import { useSupabaseProjects } from '@/hooks/useSupabaseProjects';
import { useMeetingHistory } from '@/hooks/useMeetingHistory';
import { useClientNotes } from '@/hooks/useClientNotes';
import { 
  Building2, 
  Users, 
  FolderOpen, 
  Globe, 
  Handshake, 
  TrendingUp, 
  Key, 
  Calendar,
  MessageSquare,
  FileText,
  Star,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Edit
} from 'lucide-react';
import StakeholderDialog from '@/components/StakeholderDialog';
import PageLinkDialog from '@/components/PageLinkDialog';
import SLASection from '@/components/SLASection';
import NPSHistorySection from '@/components/NPSHistorySection';
import AccessDialog from '@/components/AccessDialog';
import ImportantDatesSection from '@/components/ImportantDatesSection';
import { MeetingHistorySection } from '@/components/MeetingHistorySection';
import { ClientNotesSection } from '@/components/ClientNotesSection';
import { ClientMeetingsSection } from '@/components/ClientMeetingsSection';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { clients, getClient, updateClient } = useSupabaseClients();
  const { stakeholders, addStakeholder, updateStakeholder, deleteStakeholder } = useStakeholders(id || '');
  const { pageLinks, addPageLink, updatePageLink, deletePageLink } = usePageLinks(id || '');
  const { accesses, addAccess, updateAccess, deleteAccess } = useSupabaseClientAccesses(id || '');
  const { contacts } = useSupabaseClientContacts(id || '');
  const { projects } = useSupabaseProjects();
  const { getMeetingsByClient, addMeeting, updateMeeting, deleteMeeting } = useMeetingHistory();
  const { getNotesByClient, addNote } = useClientNotes();

  const [stakeholderDialogOpen, setStakeholderDialogOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<any>(null);
  const [pageLinkDialogOpen, setPageLinkDialogOpen] = useState(false);
  const [selectedPageLink, setSelectedPageLink] = useState<any>(null);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Encontrar o cliente nos dados do Supabase
  const client = clients.find(c => c.id === id);
  const clientProjects = projects.filter(p => p.cliente === client?.nome || p.cliente === client?.name);

  // Contato principal (primeiro contato ou dados fictícios se não houver)
  const primaryContact = contacts.find(c => c.is_primary) || contacts[0] || {
    nome: 'Não informado',
    email: 'nao-informado@email.com',
    telefone: 'Não informado'
  };

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Cliente não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureColor = (temperature: string) => {
    switch (temperature) {
      case 'quente': return 'bg-red-100 text-red-800';
      case 'morno': return 'bg-orange-100 text-orange-800';
      case 'frio': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPorteLabel = (porte: string) => {
    switch (porte) {
      case 'micro': return 'Micro';
      case 'pequeno': return 'Pequeno';
      case 'medio': return 'Médio';
      case 'grande': return 'Grande';
      default: return porte;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      case 'prospect': return 'Prospect';
      default: return status;
    }
  };

  const getTemperatureLabel = (temperature: string) => {
    switch (temperature) {
      case 'quente': return 'Quente';
      case 'morno': return 'Morno';
      case 'frio': return 'Frio';
      default: return temperature;
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'recorrente': return 'Recorrente';
      case 'projeto_unico': return 'Projeto Único';
      case 'pontual': return 'Pontual';
      default: return type;
    }
  };

  // Create wrapper functions for access dialog handlers
  const handleAddAccess = async (data: { plataforma?: string; usuario?: string; senha?: string; notas?: string; }): Promise<void> => {
    if (!data.plataforma) return;
    
    await addAccess({
      plataforma: data.plataforma,
      usuario: data.usuario,
      senha: data.senha,
      notas: data.notas,
    });
  };

  const handleUpdateAccess = async (data: { plataforma?: string; usuario?: string; senha?: string; notas?: string; }): Promise<void> => {
    if (selectedAccess) {
      await updateAccess(selectedAccess.id, data);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header do Cliente */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {client.logo_url ? (
                <img src={client.logo_url} alt={client.nome} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl">{client.nome}</CardTitle>
                <CardDescription className="mt-1">{client.segmento}</CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getStatusColor(client.status || 'ativo')}>
                    {getStatusLabel(client.status || 'ativo')}
                  </Badge>
                  <Badge className={getTemperatureColor(client.temperatura || 'frio')}>
                    {getTemperatureLabel(client.temperatura || 'frio')}
                  </Badge>
                  <Badge variant="outline">{getPorteLabel(client.porte || 'pequeno')}</Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => setEditDialogOpen(true)} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">CONTATO PRINCIPAL</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{primaryContact.nome}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{primaryContact.telefone || 'Não informado'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{primaryContact.email || 'Não informado'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">INFORMAÇÕES</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{client.endereco || 'Não informado'}</span>
                </div>
                {client.site && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <a href={client.site} target="_blank" rel="noopener noreferrer" 
                       className="text-sm text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Cliente desde {client.cliente_desde ? new Date(client.cliente_desde).toLocaleDateString('pt-BR') : 'Não informado'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">MÉTRICAS</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">NPS: {client.nps_atual || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Gerente: {client.gestor_id || 'Não definido'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Handshake className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Contrato: {getContractTypeLabel(client.tipo_contrato || 'recorrente')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
          <TabsTrigger value="meetings">Reuniões</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
          <TabsTrigger value="access">Acessos</TabsTrigger>
          <TabsTrigger value="dates">Datas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NPSHistorySection 
              clientId={id || ''}
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Resumo Rápido</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stakeholders.length}</div>
                    <div className="text-sm text-muted-foreground">Stakeholders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{clientProjects.length}</div>
                    <div className="text-sm text-muted-foreground">Projetos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{pageLinks.length}</div>
                    <div className="text-sm text-muted-foreground">Páginas/Campanhas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{accesses.length}</div>
                    <div className="text-sm text-muted-foreground">Acessos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stakeholders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Stakeholders</span>
                  </CardTitle>
                  <CardDescription>Pessoas-chave do cliente</CardDescription>
                </div>
                <Button onClick={() => {
                  setSelectedStakeholder(null);
                  setStakeholderDialogOpen(true);
                }}>
                  <Users className="w-4 h-4 mr-2" />
                  Adicionar Stakeholder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stakeholders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum stakeholder cadastrado ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stakeholders.map((stakeholder) => (
                    <Card key={stakeholder.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{stakeholder.name}</h4>
                            <Badge variant={stakeholder.importance === 'high' ? 'destructive' : 
                                          stakeholder.importance === 'medium' ? 'default' : 'secondary'}>
                              {stakeholder.importance === 'high' ? 'Alta' : 
                               stakeholder.importance === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{stakeholder.position}</p>
                          <p className="text-sm text-muted-foreground">{stakeholder.department}</p>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs">{stakeholder.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs">{stakeholder.phone}</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedStakeholder(stakeholder);
                              setStakeholderDialogOpen(true);
                            }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5" />
                <span>Projetos do Cliente</span>
              </CardTitle>
              <CardDescription>Projetos associados a este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              {clientProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum projeto associado a este cliente ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clientProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{project.titulo}</h4>
                            <Badge variant={project.status === 'concluido' ? 'default' : 
                                          project.status === 'em_andamento' ? 'secondary' : 'outline'}>
                              {project.status === 'planejamento' ? 'Planejamento' :
                               project.status === 'em_andamento' ? 'Em Andamento' :
                               project.status === 'em_revisao' ? 'Em Revisão' :
                               project.status === 'em_pausa' ? 'Em Pausa' : 'Concluído'}
                            </Badge>
                          </div>
                          {project.data_entrega && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Entrega: {new Date(project.data_entrega).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{project.progresso}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all" 
                                style={{ width: `${project.progresso}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Páginas e Campanhas</span>
                  </CardTitle>
                  <CardDescription>Sites, landing pages e campanhas do cliente</CardDescription>
                </div>
                <Button onClick={() => {
                  setSelectedPageLink(null);
                  setPageLinkDialogOpen(true);
                }}>
                  <Globe className="w-4 h-4 mr-2" />
                  Adicionar Página
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pageLinks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma página ou campanha cadastrada ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pageLinks.map((pageLink) => (
                    <Card key={pageLink.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{pageLink.title}</h4>
                            <Badge variant={pageLink.status === 'active' ? 'default' : 'secondary'}>
                              {pageLink.status === 'active' ? 'Ativo' : 'Rascunho'}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {pageLink.type === 'website' ? 'Website' :
                                 pageLink.type === 'campaign' ? 'Campanha' : 'Landing Page'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{pageLink.dateRange}</p>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => window.open(pageLink.link, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Visitar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setSelectedPageLink(pageLink);
                                  setPageLinkDialogOpen(true);
                                }}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla">
          <SLASection 
            clientId={id || ''}
          />
        </TabsContent>

        <TabsContent value="meetings">
          <ClientMeetingsSection 
            clientId={id || ''}
          />
        </TabsContent>

        <TabsContent value="notes">
          <ClientNotesSection 
            clientId={id || ''}
          />
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>Acessos do Cliente</span>
                  </CardTitle>
                  <CardDescription>Credenciais e acessos do cliente</CardDescription>
                </div>
                <Button onClick={() => {
                  setSelectedAccess(null);
                  setAccessDialogOpen(true);
                }}>
                  <Key className="w-4 h-4 mr-2" />
                  Adicionar Acesso
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {accesses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum acesso cadastrado ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accesses.map((access) => (
                    <Card key={access.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{access.plataforma}</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">Usuário:</span>
                              <span className="text-sm text-muted-foreground">{access.usuario}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">Senha:</span>
                              <span className="text-sm text-muted-foreground">••••••••</span>
                            </div>
                            {access.notas && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">Notas:</span>
                                <span className="text-sm text-muted-foreground">{access.notas}</span>
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedAccess(access);
                              setAccessDialogOpen(true);
                            }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dates">
          <ImportantDatesSection 
            clientId={id || ''}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <StakeholderDialog
        open={stakeholderDialogOpen}
        onOpenChange={setStakeholderDialogOpen}
        stakeholder={selectedStakeholder}
        clientId={id || ''}
        onSave={selectedStakeholder ? 
          (data) => updateStakeholder(selectedStakeholder.id, data) : 
          addStakeholder
        }
      />

      <PageLinkDialog
        open={pageLinkDialogOpen}
        onOpenChange={setPageLinkDialogOpen}
        pageLink={selectedPageLink}
        onSave={selectedPageLink ? 
          (data) => updatePageLink(selectedPageLink.id, data) : 
          addPageLink
        }
      />

      <AccessDialog
        open={accessDialogOpen}
        onOpenChange={setAccessDialogOpen}
        access={selectedAccess}
        onSave={selectedAccess ? handleUpdateAccess : handleAddAccess}
      />
    </div>
  );
};

export default ClientProfile;
