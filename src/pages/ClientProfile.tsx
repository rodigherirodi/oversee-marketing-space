import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Link, Users, Calendar, FileText, Briefcase } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useClients } from '@/hooks/useClients';
import { useStakeholders } from '@/hooks/useStakeholders';
import { Client } from '@/types/entities';
import ClientEditDialog from '@/components/ClientEditDialog';
import StakeholderDialog from '@/components/StakeholderDialog';

// Other imports for components used in tabs
import PersonalInfoSection from '@/components/PersonalInfoSection';
import { ClientNotesSection } from '@/components/ClientNotesSection';
import ImportantDatesSection from '@/components/ImportantDatesSection';
import NPSHistorySection from '@/components/NPSHistorySection';
import SLASection from '@/components/SLASection';
import { MeetingHistorySection } from '@/components/MeetingHistorySection';
import { usePageLinks } from '@/hooks/usePageLinks';
import PageLinkDialog from '@/components/PageLinkDialog';
import { useClientTeamMembers } from '@/hooks/useClientTeamMembers';
import { useProjects } from '@/hooks/useProjects';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, updateClient } = useClients();
  const { stakeholders, addStakeholder, updateStakeholder, deleteStakeholder } = useStakeholders(id || '');
  const { pageLinks, addPageLink, updatePageLink, deletePageLink } = usePageLinks(id || '');
  const { clientTeamMembers } = useClientTeamMembers(id || '');
  const { projects } = useProjects();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stakeholderDialogOpen, setStakeholderDialogOpen] = useState(false);
  const [currentStakeholder, setCurrentStakeholder] = useState<any>(undefined);
  const [pageLinkDialogOpen, setPageLinkDialogOpen] = useState(false);
  const [currentPageLink, setCurrentPageLink] = useState<any>(undefined);
  
  const client = clients.find(c => c.id === id);
  
  if (!client) {
    return <div className="p-8">Cliente não encontrado</div>;
  }
  
  const statusColors: Record<string, string> = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    onboarding: 'bg-blue-500',
  };
  
  const temperatureColors: Record<string, string> = {
    hot: 'bg-red-500',
    warm: 'bg-yellow-500',
    cold: 'bg-blue-500',
  };
  
  const handleOpenStakeholderDialog = (stakeholder?: any) => {
    setCurrentStakeholder(stakeholder);
    setStakeholderDialogOpen(true);
  };

  const handleSaveStakeholder = (data: Omit<any, 'id'>) => {
    if (currentStakeholder) {
      updateStakeholder(currentStakeholder.id, data);
    } else {
      addStakeholder(data);
    }
  };

  const handleDeleteStakeholder = (id: string) => {
    deleteStakeholder(id);
  };
  
  const handleOpenPageLinkDialog = (pageLink?: any) => {
    setCurrentPageLink(pageLink);
    setPageLinkDialogOpen(true);
  };
  
  const handleSavePageLink = (data: Omit<any, 'id'>) => {
    if (currentPageLink) {
      updatePageLink(currentPageLink.id, data);
    } else {
      addPageLink(data);
    }
  };
  
  const handleUpdateClient = (clientData: Partial<Client>) => {
    updateClient(client.id, clientData);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            {client.logo ? (
              <img src={client.logo} alt={client.name} />
            ) : (
              <div className="bg-primary h-full w-full flex items-center justify-center text-white text-xl font-semibold">
                {client.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{client.segment}</Badge>
              <Badge variant="outline">{client.size}</Badge>
              <Badge className={`${statusColors[client.status]}`}>
                {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Onboarding'}
              </Badge>
              <Badge className={`${temperatureColors[client.temperature]}`}>
                {client.temperature === 'hot' ? 'Quente' : client.temperature === 'warm' ? 'Morno' : 'Frio'}
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={() => setEditDialogOpen(true)} variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar Dados
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="pages">Páginas & Campanhas</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="relationship">Relacionamento</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <PersonalInfoSection client={client} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Acessos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {client.website && (
                      <div className="flex items-center">
                        <Link className="h-4 w-4 mr-2" />
                        <a 
                          href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {client.website}
                        </a>
                      </div>
                    )}
                    
                    {client.socialMedia?.facebook && (
                      <div className="flex items-center">
                        <Link className="h-4 w-4 mr-2" />
                        <a 
                          href={client.socialMedia.facebook} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Facebook
                        </a>
                      </div>
                    )}
                    
                    {client.socialMedia?.instagram && (
                      <div className="flex items-center">
                        <Link className="h-4 w-4 mr-2" />
                        <a 
                          href={client.socialMedia.instagram} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                    )}
                    
                    {client.socialMedia?.linkedin && (
                      <div className="flex items-center">
                        <Link className="h-4 w-4 mr-2" />
                        <a 
                          href={client.socialMedia.linkedin} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <ClientNotesSection clientId={client.id} />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contatos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Contato Principal</h3>
                    <div className="space-y-1">
                      <p>{client.primaryContact.name}</p>
                      <p className="text-sm text-gray-500">{client.primaryContact.email}</p>
                      <p className="text-sm text-gray-500">{client.primaryContact.phone}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Contato Financeiro</h3>
                    <div className="space-y-1">
                      <p>{client.financialContact.name}</p>
                      <p className="text-sm text-gray-500">{client.financialContact.email}</p>
                      <p className="text-sm text-gray-500">{client.financialContact.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stakeholders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Stakeholders</CardTitle>
              <Button onClick={() => handleOpenStakeholderDialog()} size="sm">
                Adicionar Stakeholder
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nome</th>
                      <th className="text-left py-2">Cargo</th>
                      <th className="text-left py-2">Departamento</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Telefone</th>
                      <th className="text-left py-2">Importância</th>
                      <th className="text-left py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stakeholders.map((stakeholder) => (
                      <tr key={stakeholder.id} className="border-b hover:bg-muted/50">
                        <td className="py-2">{stakeholder.name}</td>
                        <td className="py-2">{stakeholder.position}</td>
                        <td className="py-2">{stakeholder.department}</td>
                        <td className="py-2">{stakeholder.email}</td>
                        <td className="py-2">{stakeholder.phone}</td>
                        <td className="py-2">
                          <Badge variant={
                            stakeholder.importance === 'high' 
                              ? 'destructive' 
                              : stakeholder.importance === 'medium' 
                                ? 'default' 
                                : 'outline'
                          }>
                            {stakeholder.importance === 'high' 
                              ? 'Alta' 
                              : stakeholder.importance === 'medium' 
                                ? 'Média' 
                                : 'Baixa'}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenStakeholderDialog(stakeholder)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteStakeholder(stakeholder.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pages & Campaigns Tab */}
        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Páginas & Campanhas</CardTitle>
              <Button onClick={() => handleOpenPageLinkDialog()} size="sm">
                Adicionar Nova
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Título</th>
                      <th className="text-left py-2">Tipo</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Período</th>
                      <th className="text-left py-2">Link</th>
                      <th className="text-left py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageLinks.map((pageLink) => (
                      <tr key={pageLink.id} className="border-b hover:bg-muted/50">
                        <td className="py-2">{pageLink.title}</td>
                        <td className="py-2">{pageLink.type}</td>
                        <td className="py-2">
                          <Badge variant={
                            pageLink.status === 'active' 
                              ? 'default' 
                              : pageLink.status === 'draft' 
                                ? 'secondary' 
                                : 'outline'
                          }>
                            {pageLink.status === 'active' 
                              ? 'Ativo' 
                              : pageLink.status === 'draft' 
                                ? 'Rascunho' 
                                : 'Arquivado'}
                          </Badge>
                        </td>
                        <td className="py-2">{pageLink.dateRange.replace(' to ', ' até ')}</td>
                        <td className="py-2">
                          <a 
                            href={pageLink.link} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Ver
                          </a>
                        </td>
                        <td className="py-2">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenPageLinkDialog(pageLink)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deletePageLink(pageLink.id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Equipe do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientTeamMembers.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <div className="p-4 flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} />
                        ) : (
                          <div className="bg-primary h-full w-full flex items-center justify-center text-white text-lg font-semibold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.position}</p>
                        <div className="flex items-center mt-1 space-x-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{member.activeProjectsCount} projetos</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Relationship Tab */}
        <TabsContent value="relationship" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NPSHistorySection clientId={client.id} />
            <ImportantDatesSection clientId={client.id} />
          </div>
          
          <SLASection clientId={client.id} />
          
          <MeetingHistorySection clientId={client.id} />
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    {project.cover && (
                      <div className="h-32 w-full">
                        <img 
                          src={project.cover} 
                          alt={project.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant={
                          project.status === 'in-progress' 
                            ? 'default' 
                            : project.status === 'planning' 
                              ? 'secondary' 
                              : project.status === 'completed' 
                                ? 'secondary' 
                                : project.status === 'paused'
                                  ? 'outline'
                                  : 'outline'
                        }>
                          {project.status === 'in-progress' 
                            ? 'Em Progresso' 
                            : project.status === 'planning' 
                              ? 'Planejamento' 
                              : project.status === 'completed' 
                                ? 'Concluído' 
                                : project.status === 'paused'
                                  ? 'Pausado'
                                  : 'Revisão'}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(project.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <ClientEditDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        client={client} 
        onUpdate={handleUpdateClient}
      />
      
      <StakeholderDialog
        open={stakeholderDialogOpen}
        onOpenChange={setStakeholderDialogOpen}
        stakeholder={currentStakeholder}
        onSave={handleSaveStakeholder}
      />
      
      <PageLinkDialog 
        open={pageLinkDialogOpen}
        onOpenChange={setPageLinkDialogOpen}
        pageLink={currentPageLink}
        onSave={handleSavePageLink}
      />
    </div>
  );
};

export default ClientProfile;
