import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockClients } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Phone, Mail, Facebook, Instagram, Linkedin, MapPin, Calendar, Building2, Users, Star, AlertCircle, FileText, Clock, Target } from 'lucide-react';
const ClientProfile = () => {
  const {
    id
  } = useParams();
  const [activeTab, setActiveTab] = useState('general');

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
        return 'text-red-500';
      case 'warm':
        return 'text-yellow-500';
      case 'cold':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };
  return <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-t-lg py-0"></div>
        <div className="p-6 -mt-16 relative py-[39px]">
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
                  <Badge className={getStatusColor(client.status)}>
                    {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Onboarding'}
                  </Badge>
                  <Badge variant="outline">{getSizeLabel(client.size)}</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4 py-0">
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
                {client.website && <Button variant="outline" size="sm" asChild>
                    <a href={client.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>}
                {client.socialMedia.linkedin && <Button variant="outline" size="sm" asChild>
                    <a href={client.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>}
                {client.socialMedia.instagram && <Button variant="outline" size="sm" asChild>
                    <a href={client.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </Button>}
                {client.socialMedia.facebook && <Button variant="outline" size="sm" asChild>
                    <a href={client.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-4 h-4" />
                    </a>
                  </Button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="relationship">Relacionamento</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
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
                  <span className="text-sm text-gray-500">Tipo de Contrato:</span>
                  <Badge variant="outline">
                    {client.contractType === 'recurring' ? 'Recorrente' : client.contractType === 'project' ? 'Projeto' : 'Pontual'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Temperatura:</span>
                  <span className={`font-medium ${getTemperatureColor(client.temperature)}`}>
                    {client.temperature === 'hot' ? '🔥 Quente' : client.temperature === 'warm' ? '🌡️ Morno' : '❄️ Frio'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Senhas e Acessos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Google Ads</h4>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Login: ads@{client.name.toLowerCase().replace(/\s/g, '')}.com</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Meta Business</h4>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Business Manager compartilhado</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Analytics</h4>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Acesso via GTM</p>
                </div>
              </div>
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
                      <span>Início: 01/10/2024</span>
                      <span>Entrega: 30/11/2024</span>
                      <span>Progresso: 65%</span>
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
                  <Star className="w-5 h-5" />
                  NPS
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
                  <Target className="w-5 h-5" />
                  SLA/Escopo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">✅ 3 posts por semana</p>
                  <p className="text-sm">✅ 2 stories diários</p>
                  <p className="text-sm">✅ Relatório mensal</p>
                  <p className="text-sm">✅ Reunião quinzenal</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Ver contrato completo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Cliente prefere reuniões às sextas</p>
                  <p>• Evitar campanhas em dezembro</p>
                  <p>• Aprovações lentas (até 48h)</p>
                  <p>• Gosta de métricas detalhadas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Equipe */}
        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipe da Agência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.responsibleManager}</p>
                      <p className="text-sm text-gray-600">Gestor de Conta</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>LP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Lucas Pereira</p>
                      <p className="text-sm text-gray-600">Designer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>FS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Fernanda Silva</p>
                      <p className="text-sm text-gray-600">Analista de Mídia</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stakeholders do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{client.primaryContact.name}</p>
                      <p className="text-sm text-gray-600">Diretor de Marketing</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">Decisor</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{client.financialContact.name}</p>
                      <p className="text-sm text-gray-600">Gerente Financeiro</p>
                    </div>
                    <Badge variant="outline">Aprovador</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Roberto Oliveira</p>
                      <p className="text-sm text-gray-600">Assistente de Marketing</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Operacional</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Últimas Reuniões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Reunião de Alinhamento</h4>
                      <span className="text-xs text-gray-500">15/11/2024</span>
                    </div>
                    <p className="text-sm text-gray-600">Discussão sobre nova campanha e ajustes no cronograma.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Aprovação de Materiais</h4>
                      <span className="text-xs text-gray-500">08/11/2024</span>
                    </div>
                    <p className="text-sm text-gray-600">Cliente aprovou todos os criativos da Black Friday.</p>
                  </div>
                </div>
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
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Relatório mensal pendente</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feedbacks Recentes</CardTitle>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default ClientProfile;