
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockClients } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Globe, Phone, Mail, Facebook, Instagram, Linkedin, MapPin, Calendar, Building2, Users, Star, AlertCircle, FileText, Clock, Target, Edit, ExternalLink, Thermometer, Shield, Video, PenTool, BarChart3 } from 'lucide-react';

const ClientProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);

  // Find the client - in a real app, this would be fetched from an API
  const client = mockClients.find(c => c.id === id) || mockClients[0];

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

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot':
        return 'text-red-500 bg-red-50';
      case 'warm':
        return 'text-yellow-500 bg-yellow-50';
      case 'cold':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'hot':
        return '🔥';
      case 'warm':
        return '🌡️';
      case 'cold':
        return '❄️';
      default:
        return '🌡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-t-lg"></div>
        <div className="p-6 -mt-16 relative">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl border-4 border-white shadow-lg">
              {client.logo || '🏢'}
            </div>
            <div className="flex-1 mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                  <p className="text-lg text-gray-600">{client.segment}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant={isEditing ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Salvar' : 'Editar Perfil'}
                  </Button>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Onboarding'}
                  </Badge>
                  <Badge variant="outline">{getSizeLabel(client.size)}</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{client.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Cliente desde {new Date(client.entryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Gestor: {client.responsibleManager}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {client.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={client.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                )}
                {client.socialMedia.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={client.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {client.socialMedia.instagram && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={client.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {client.socialMedia.facebook && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={client.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="relationship">Relacionamento</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="pages">Páginas & Campanhas</TabsTrigger>
        </TabsList>

        {/* Informações Gerais */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Contato Principal</h4>
                  <div className="space-y-1">
                    <p className="font-medium">{client.primaryContact.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{client.primaryContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{client.primaryContact.email}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Contato Financeiro</h4>
                  <div className="space-y-1">
                    <p className="font-medium">{client.financialContact.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{client.financialContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{client.financialContact.email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Segmento:</span>
                  <span className="font-medium">{client.segment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Porte:</span>
                  <span className="font-medium">{getSizeLabel(client.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Endereço:</span>
                  <span className="font-medium text-right">{client.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Data de Entrada:</span>
                  <span className="font-medium">{new Date(client.entryDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Senhas e Acessos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Google Ads</TableCell>
                    <TableCell>ads@{client.name.toLowerCase().replace(/\s/g, '')}.com</TableCell>
                    <TableCell><Badge variant="secondary">Ativo</Badge></TableCell>
                    <TableCell>Acesso completo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Meta Business</TableCell>
                    <TableCell>Business Manager compartilhado</TableCell>
                    <TableCell><Badge variant="secondary">Ativo</Badge></TableCell>
                    <TableCell>Administrador</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Google Analytics</TableCell>
                    <TableCell>Acesso via GTM</TableCell>
                    <TableCell><Badge variant="secondary">Ativo</Badge></TableCell>
                    <TableCell>Visualização</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Cliente prefere reuniões às sextas-feiras</p>
                <p>• Evitar campanhas em dezembro devido ao fechamento</p>
                <p>• Aprovações podem levar até 48h</p>
                <p>• Gosta de relatórios detalhados com métricas específicas</p>
                <p>• Disponibilidade limitada entre 12h-14h</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stakeholders */}
        <TabsContent value="stakeholders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Stakeholders do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{client.primaryContact.name}</TableCell>
                    <TableCell>Diretor de Marketing</TableCell>
                    <TableCell><Badge className="bg-purple-100 text-purple-700">Decisor</Badge></TableCell>
                    <TableCell>{client.primaryContact.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{client.financialContact.name}</TableCell>
                    <TableCell>Gerente Financeiro</TableCell>
                    <TableCell><Badge variant="outline">Aprovador</Badge></TableCell>
                    <TableCell>{client.financialContact.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Roberto Oliveira</TableCell>
                    <TableCell>Assistente de Marketing</TableCell>
                    <TableCell><Badge className="bg-blue-100 text-blue-700">Operacional</Badge></TableCell>
                    <TableCell>roberto.oliveira@{client.name.toLowerCase().replace(/\s/g, '')}.com</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ana Santos</TableCell>
                    <TableCell>Coordenadora de Comunicação</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-700">Influenciador</Badge></TableCell>
                    <TableCell>ana.santos@{client.name.toLowerCase().replace(/\s/g, '')}.com</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projetos */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projetos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Campanha Black Friday 2024</h4>
                      <Badge className="bg-green-100 text-green-700">Em Andamento</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Campanha completa para Black Friday com landing page e criativos</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Responsável: Lucas Pereira</span>
                      <span>Progresso: 65%</span>
                    </div>
                  </div>
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Renovação Website</h4>
                      <Badge className="bg-blue-100 text-blue-700">Planejamento</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Redesign completo do site institucional</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Responsável: Fernanda Silva</span>
                      <span>Progresso: 20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projetos Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Rebranding Completo</h4>
                      <Badge variant="outline">Concluído</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Renovação da identidade visual e materiais</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Concluído em: 15/09/2024</span>
                      <span>⭐ Avaliação: 5/5</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Campanha Dia das Mães</h4>
                      <Badge variant="outline">Concluído</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Campanha sazonal com excelentes resultados</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Concluído em: 30/05/2024</span>
                      <span>⭐ Avaliação: 4/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Relacionamento */}
        <TabsContent value="relationship" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Temperatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getTemperatureColor(client.temperature)}`}>
                    <span className="text-2xl">{getTemperatureIcon(client.temperature)}</span>
                    <span className="font-medium">
                      {client.temperature === 'hot' ? 'Quente' : client.temperature === 'warm' ? 'Morno' : 'Frio'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Última atualização: 15/11/2024</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  NPS Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{client.nps}/10</div>
                  <p className="text-sm text-gray-600">Última coleta: 15/10/2024</p>
                  <Badge className="mt-2 bg-green-100 text-green-700">Promotor</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Tipo de Contrato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {client.contractType === 'recurring' ? 'Recorrente' : client.contractType === 'project' ? 'Projeto' : 'Pontual'}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">Renovação: Jan/2025</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de NPS</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Comentário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>15/10/2024</TableCell>
                      <TableCell><span className="font-bold text-green-600">9/10</span></TableCell>
                      <TableCell>Maria Costa</TableCell>
                      <TableCell>Excelente atendimento</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>15/07/2024</TableCell>
                      <TableCell><span className="font-bold text-green-600">8/10</span></TableCell>
                      <TableCell>Maria Costa</TableCell>
                      <TableCell>Bons resultados</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>15/04/2024</TableCell>
                      <TableCell><span className="font-bold text-yellow-600">7/10</span></TableCell>
                      <TableCell>Maria Costa</TableCell>
                      <TableCell>Melhorou comunicação</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datas Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Renovação de Contrato</TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell><Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Reunião Mensal</TableCell>
                      <TableCell>22/11/2024</TableCell>
                      <TableCell><Badge className="bg-blue-100 text-blue-700">Agendada</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Entrega Black Friday</TableCell>
                      <TableCell>25/11/2024</TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-700">No prazo</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                SLA/Escopo Contratado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">✅ 3 posts por semana nas redes sociais</p>
                <p className="text-sm">✅ 2 stories diários no Instagram</p>
                <p className="text-sm">✅ Relatório mensal de performance</p>
                <p className="text-sm">✅ Reunião quinzenal de alinhamento</p>
                <p className="text-sm">✅ Suporte técnico em horário comercial</p>
                <Button variant="outline" size="sm" className="mt-3">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver contrato completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipe */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipe da Agência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.responsibleManager}</p>
                    <p className="text-sm text-gray-600">Gestor de Conta</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>maria.costa@agencia.com</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback><PenTool className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Lucas Pereira</p>
                    <p className="text-sm text-gray-600">Designer Criativo</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>lucas.pereira@agencia.com</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback><BarChart3 className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Fernanda Silva</p>
                    <p className="text-sm text-gray-600">Analista de Performance</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>fernanda.silva@agencia.com</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback><Video className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Carlos Santos</p>
                    <p className="text-sm text-gray-600">Editor de Vídeo</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>carlos.santos@agencia.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Histórico de Reuniões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Resumo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>15/11/2024</TableCell>
                      <TableCell>Alinhamento</TableCell>
                      <TableCell>Discussão sobre nova campanha</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>08/11/2024</TableCell>
                      <TableCell>Aprovação</TableCell>
                      <TableCell>Aprovação materiais Black Friday</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>01/11/2024</TableCell>
                      <TableCell>Planejamento</TableCell>
                      <TableCell>Estratégia fim de ano</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Alertas Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Reunião agendada para amanhã</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Relatório mensal pendente</span>
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Prazo de entrega em 3 dias</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tarefas Críticas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Prioridade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Finalizar criativos Black Friday</TableCell>
                    <TableCell>Lucas Pereira</TableCell>
                    <TableCell>20/11/2024</TableCell>
                    <TableCell><Badge className="bg-red-100 text-red-700">Alta</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Relatório de performance outubro</TableCell>
                    <TableCell>Fernanda Silva</TableCell>
                    <TableCell>18/11/2024</TableCell>
                    <TableCell><Badge className="bg-yellow-100 text-yellow-700">Média</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Aprovação de budget Q1 2025</TableCell>
                    <TableCell>Maria Costa</TableCell>
                    <TableCell>25/11/2024</TableCell>
                    <TableCell><Badge className="bg-red-100 text-red-700">Alta</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimos Feedbacks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-sm text-gray-600">15/10/2024</span>
                    </div>
                    <span className="text-sm text-gray-500">{client.primaryContact.name}</span>
                  </div>
                  <p className="text-sm">"Excelente trabalho na campanha! Os resultados superaram nossas expectativas."</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(4)}
                      </div>
                      <span className="text-sm text-gray-600">01/10/2024</span>
                    </div>
                    <span className="text-sm text-gray-500">{client.financialContact.name}</span>
                  </div>
                  <p className="text-sm">"Comunicação melhorou muito. Gostamos dos relatórios detalhados."</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Páginas e Campanhas */}
        <TabsContent value="pages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Landing Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Black Friday 2024</TableCell>
                      <TableCell className="text-blue-600">blackfriday.{client.name.toLowerCase().replace(/\s/g, '')}.com</TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-700">Ativa</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Campanha Verão</TableCell>
                      <TableCell className="text-blue-600">verao.{client.name.toLowerCase().replace(/\s/g, '')}.com</TableCell>
                      <TableCell><Badge variant="outline">Pausada</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dia das Mães</TableCell>
                      <TableCell className="text-blue-600">maes.{client.name.toLowerCase().replace(/\s/g, '')}.com</TableCell>
                      <TableCell><Badge className="bg-gray-100 text-gray-700">Finalizada</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Sites e Páginas Institucionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Site Principal</TableCell>
                      <TableCell className="text-blue-600">{client.website}</TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-700">Ativo</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <a href={client.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Blog</TableCell>
                      <TableCell className="text-blue-600">blog.{client.name.toLowerCase().replace(/\s/g, '')}.com</TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-700">Ativo</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Loja Online</TableCell>
                      <TableCell className="text-blue-600">loja.{client.name.toLowerCase().replace(/\s/g, '')}.com</TableCell>
                      <TableCell><Badge className="bg-blue-100 text-blue-700">Em desenvolvimento</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" disabled>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campanhas de Mídia</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Investimento</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Black Friday - Awareness</TableCell>
                    <TableCell>Meta Ads</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-700">Ativa</Badge></TableCell>
                    <TableCell>R$ 15.000</TableCell>
                    <TableCell>ROAS: 4.2x</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Black Friday - Conversão</TableCell>
                    <TableCell>Google Ads</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-700">Ativa</Badge></TableCell>
                    <TableCell>R$ 25.000</TableCell>
                    <TableCell>ROAS: 5.8x</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rebranding - Awareness</TableCell>
                    <TableCell>LinkedIn Ads</TableCell>
                    <TableCell><Badge className="bg-gray-100 text-gray-700">Finalizada</Badge></TableCell>
                    <TableCell>R$ 8.000</TableCell>
                    <TableCell>ROAS: 3.1x</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Ver relatório
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
