
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Phone, Globe, MapPin, Calendar, Users, FileText, BarChart3, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClients } from '@/hooks/useClients';
import { TaskProvider } from '@/contexts/TaskContext';
import { MeetingHistoryTable } from '@/components/client/MeetingHistoryTable';
import { CriticalTasksCard } from '@/components/client/CriticalTasksCard';

export default function ClientProfile() {
  const { id } = useParams();
  const { clients } = useClients();
  const client = clients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cliente não encontrado</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TaskProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={client.logo} alt={client.name} />
              <AvatarFallback className="text-lg">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Onboarding'}
                </Badge>
                <Badge variant="outline">{client.segment}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{client.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${client.primaryContact.email}`} className="text-blue-500 hover:underline">{client.primaryContact.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{client.primaryContact.phone}</span>
                </div>
                {client.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {client.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{client.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Membro desde {new Date(client.createdAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Empresa {client.size}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projetos Atuais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhum projeto em andamento.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhum dado de análise disponível.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Histórico de Reuniões - Funcional com CRUD e campo Link */}
              <div className="lg:col-span-2">
                <MeetingHistoryTable clientId={client.id} />
              </div>

              {/* Tarefas Críticas Pendentes - Conectadas ao sistema de tarefas */}
              <CriticalTasksCard clientId={client.id} />

              {/* Alertas Ativos - REMOVIDO conforme solicitado */}
              {/* Últimos Feedbacks - REMOVIDO conforme solicitado */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TaskProvider>
  );
}
