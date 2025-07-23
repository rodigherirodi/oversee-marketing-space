import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Star,
  MoreHorizontal,
  Edit,
  ExternalLink,
  MessageSquare,
  Activity,
  Clock,
  Target,
  Award,
  Briefcase,
  UserCheck,
  Zap,
  Heart,
} from 'lucide-react';
import { mockClients, mockProjects } from '@/data/mockData';
import { MeetingHistorySection } from '@/components/MeetingHistorySection';
import { ClientNotesSection } from '@/components/ClientNotesSection';
import { useNavigate } from 'react-router-dom';
import { mockTeamMembers } from '@/data/mockData';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { usePageLinks } from '@/hooks/usePageLinks';
import { NPSHistorySection } from '@/components/NPSHistorySection';
import { ImportantDatesSection } from '@/components/ImportantDatesSection';
import { SLASection } from '@/components/SLASection';
import { TeamMemberSelector } from '@/components/TeamMemberSelector';
import { ClientTeamMembers } from '@/components/ClientTeamMembers';
import { PageLinkDialog } from '@/components/PageLinkDialog';
import { PageLinksTable } from '@/components/PageLinksTable';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const client = mockClients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Cliente não encontrado</h2>
              <p className="text-muted-foreground">O cliente solicitado não existe.</p>
              <Button onClick={() => navigate('/clients')} className="mt-4">
                Voltar para Clientes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Client Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`} />
                <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{client.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {client.industry}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {client.location}
                  </div>
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Cliente
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Website
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{client.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{client.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{client.website}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="relationship">Relacionamento</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="pages">Páginas & Campanhas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Visão Geral Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Add your overview content here */}
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Informações gerais e métricas importantes sobre o cliente.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Receita Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">R$ 120.000,00</p>
                    <p className="text-sm text-muted-foreground">Desde o início do contrato</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Crescimento Mensal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">+15%</p>
                    <p className="text-sm text-muted-foreground">Em relação ao mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Projetos Ativos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">4</p>
                    <p className="text-sm text-muted-foreground">Em andamento</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Satisfação do Cliente (NPS)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-green-100 text-green-800 text-lg">9/10</Badge>
                      <p className="text-sm text-muted-foreground">Última pesquisa de satisfação</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Atividade Recente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Reunião de alinhamento (15/03/2024)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Entrega do relatório mensal (10/03/2024)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Feedback positivo sobre a campanha (05/03/2024)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projetos Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.slice(0, 6).map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status === 'active' ? 'Ativo' : 'Concluído'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progresso</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.startDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.teamMembers.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Relacionamento Tab */}
        <TabsContent value="relationship" className="space-y-6">
          <NPSHistorySection clientId={id!} />
          <ImportantDatesSection clientId={id!} />  
          <SLASection clientId={id!} />
        </TabsContent>

        {/* Equipe Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Equipe do Cliente
              </CardTitle>
              <TeamMemberSelector clientId={id!} />
            </CardHeader>
            <CardContent>
              <ClientTeamMembers clientId={id!} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Páginas & Campanhas Tab */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Páginas e Campanhas
              </CardTitle>
              <PageLinkDialog clientId={id!} />
            </CardHeader>
            <CardContent>
              <PageLinksTable clientId={id!} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* História Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MeetingHistorySection clientId={id!} />
            <ClientNotesSection clientId={id!} />
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Leads Gerados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">350</p>
                    <p className="text-sm text-muted-foreground">Neste mês</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Taxa de Conversão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">12%</p>
                    <p className="text-sm text-muted-foreground">Leads convertidos em clientes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Custo por Aquisição (CPA)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">R$ 50,00</p>
                    <p className="text-sm text-muted-foreground">Custo médio por cliente adquirido</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Engajamento nas Redes Sociais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">15.000 curtidas</p>
                    <p className="text-sm text-muted-foreground">Total de interações nas redes sociais</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Tráfego do Website
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">20.000 visitas</p>
                    <p className="text-sm text-muted-foreground">Visitantes únicos neste mês</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
