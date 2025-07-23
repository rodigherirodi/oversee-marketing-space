
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import PersonalInfoSection from '@/components/PersonalInfoSection';
import { ClientNotesSection } from '@/components/ClientNotesSection';
import { MeetingHistorySection } from '@/components/MeetingHistorySection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Calendar, 
  ExternalLink, 
  Mail, 
  MapPin, 
  MoreHorizontal,
  Plus,
  Phone, 
  Users,
  Key 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageLinkDialog from '@/components/PageLinkDialog';
import { usePageLinks } from '@/hooks/usePageLinks';
import TeamMemberSelector from '@/components/TeamMemberSelector';
import NPSHistorySection from '@/components/NPSHistorySection';
import ImportantDatesSection from '@/components/ImportantDatesSection';
import SLASection from '@/components/SLASection';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients } = useClients();
  const { projects } = useProjects();
  const [isPageLinkDialogOpen, setIsPageLinkDialogOpen] = useState(false);
  const [currentPageLink, setCurrentPageLink] = useState<any | null>(null);
  
  const client = clients.find(c => c.id === id);
  const clientProjects = projects.filter(project => project.clientId === id);
  const { pageLinks, addPageLink, updatePageLink, deletePageLink } = usePageLinks(id || '');

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-red-100 text-red-700';
      case 'onboarding':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'MEI':
        return 'Microempreendedor Individual';
      case 'PME':
        return 'Pequena e Média Empresa';
      case 'large':
        return 'Grande Porte';
      default:
        return size;
    }
  };

  const getPageTypeLabel = (type: string) => {
    switch (type) {
      case 'website':
        return 'Website';
      case 'landing':
        return 'Landing Page';
      case 'campaign':
        return 'Campanha';
      case 'social':
        return 'Mídia Social';
      default:
        return type;
    }
  };
  
  const getPageStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };
  
  const getPageStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-amber-100 text-amber-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const handleOpenPageLinkDialog = (pageLink = null) => {
    setCurrentPageLink(pageLink);
    setIsPageLinkDialogOpen(true);
  };
  
  const handleSavePageLink = (data: any) => {
    if (currentPageLink) {
      updatePageLink(currentPageLink.id, data);
    } else {
      addPageLink(data);
    }
  };
  
  const handleNavigateToProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={client.logo} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{client.name}</h1>
              <Badge className={getStatusColor(client.status)}>
                {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Onboarding'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Building className="w-4 h-4" />
              <span>{client.segment}</span>
              <span>•</span>
              <span>{getSizeLabel(client.size)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">Editar Dados</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Arquivar Cliente</DropdownMenuItem>
              <DropdownMenuItem>Exportar Dados</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Excluir Cliente</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Client Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="pages">Páginas & Campanhas</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="relationship">Relacionamento</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Informações Principais</h2>
                <PersonalInfoSection client={client} />
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h2 className="text-xl font-semibold mb-4">Endereço</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span>{client.address}</span>
                    </div>
                    
                    {client.website && (
                      <div className="flex items-start gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-500 mt-1" />
                        <a 
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {client.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Contatos</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Contato Principal</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{client.primaryContact.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{client.primaryContact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{client.primaryContact.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Contato Financeiro</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{client.financialContact.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{client.financialContact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{client.financialContact.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Detalhes do Contrato</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Tipo de Contrato</span>
                        <span className="font-medium">
                          {client.contractType === 'recurring' ? 'Recorrente' : 
                          client.contractType === 'project' ? 'Projeto' : 'Único'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Cliente Desde</span>
                        <span className="font-medium">
                          {new Date(client.entryDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Temperatura</span>
                        <span className="font-medium">
                          {client.temperature === 'hot' ? 'Quente' : 
                          client.temperature === 'warm' ? 'Morno' : 'Frio'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Gestor Responsável</span>
                        <span className="font-medium">{client.responsibleManager}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Acessos Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Acessos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plataforma</TableHead>
                      <TableHead>Usuário/Email</TableHead>
                      <TableHead>Senha</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Google Analytics</TableCell>
                      <TableCell>cliente@empresa.com</TableCell>
                      <TableCell>••••••••••</TableCell>
                      <TableCell>Acesso de administrador</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>WordPress</TableCell>
                      <TableCell>admin</TableCell>
                      <TableCell>••••••••••</TableCell>
                      <TableCell>Acesso ao painel</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Meta Business</TableCell>
                      <TableCell>marketing@cliente.com</TableCell>
                      <TableCell>••••••••••</TableCell>
                      <TableCell>Acesso limitado</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Acesso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <MeetingHistorySection clientId={client.id} />
          <ClientNotesSection clientId={client.id} />
        </TabsContent>

        {/* Pages & Campaigns Tab */}
        <TabsContent value="pages" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Páginas e Campanhas</h2>
            <Button onClick={() => handleOpenPageLinkDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageLinks.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>{getPageTypeLabel(page.type)}</TableCell>
                      <TableCell>{page.dateRange}</TableCell>
                      <TableCell>
                        <Badge className={getPageStatusColor(page.status)}>
                          {getPageStatusLabel(page.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={page.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Link
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenPageLinkDialog(page)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deletePageLink(page.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {pageLinks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        Nenhuma página ou campanha encontrada para este cliente.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <PageLinkDialog
            open={isPageLinkDialogOpen}
            onOpenChange={setIsPageLinkDialogOpen}
            pageLink={currentPageLink}
            onSave={handleSavePageLink}
          />
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Projetos</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Projeto
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientProjects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleNavigateToProject(project.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge className={
                        project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'planning' ? 'bg-purple-100 text-purple-800' :
                        project.status === 'paused' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {project.status === 'completed' ? 'Concluído' :
                         project.status === 'in-progress' ? 'Em Progresso' :
                         project.status === 'planning' ? 'Planejamento' :
                         project.status === 'paused' ? 'Pausado' : 'Revisão'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <span>Progresso: {project.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {clientProjects.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 mb-4">Este cliente ainda não possui projetos.</p>
                <Button>Criar Primeiro Projeto</Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Relationship Tab */}
        <TabsContent value="relationship" className="space-y-6">
          <h2 className="text-xl font-semibold mb-6">Relacionamento com o Cliente</h2>
          
          <div className="space-y-8">
            <NPSHistorySection clientId={client.id} />
            <ImportantDatesSection clientId={client.id} />
            <SLASection clientId={client.id} />
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <h2 className="text-xl font-semibold mb-6">Equipe do Cliente</h2>
          
          <TeamMemberSelector clientId={client.id} />
        </TabsContent>

        {/* Stakeholders Tab */}
        <TabsContent value="stakeholders" className="space-y-6">
          <h2 className="text-xl font-semibold mb-6">Stakeholders</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Importância</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Maria Silva</TableCell>
                      <TableCell>CEO</TableCell>
                      <TableCell>Diretoria</TableCell>
                      <TableCell>maria@empresa.com</TableCell>
                      <TableCell>(11) 98765-4321</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">Alta</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remover</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">José Oliveira</TableCell>
                      <TableCell>Gerente de Marketing</TableCell>
                      <TableCell>Marketing</TableCell>
                      <TableCell>jose@empresa.com</TableCell>
                      <TableCell>(11) 99876-5432</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remover</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Roberto Santos</TableCell>
                      <TableCell>Analista de Mídia</TableCell>
                      <TableCell>Marketing</TableCell>
                      <TableCell>roberto@empresa.com</TableCell>
                      <TableCell>(11) 97654-3210</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Baixa</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remover</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="flex justify-end">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Stakeholder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
