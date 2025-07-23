import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@/types/entities';
import { useClients } from '@/hooks/useClients';
import { useMeetingHistory } from '@/hooks/useMeetingHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MeetingHistoryTable } from '@/components/client/MeetingHistoryTable';
import { CriticalTasksCard } from '@/components/client/CriticalTasksCard';
import { MeetingFormDialog } from '@/components/client/MeetingFormDialog';
import { MeetingHistory, MeetingFormData } from '@/types/client-history';
import { TaskProvider } from '@/contexts/TaskContext';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Star,
  Edit,
  ExternalLink,
  FileText,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { clients } = useClients();
  const client = clients.find(c => c.id === id);
  
  // Meeting history state
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useMeetingHistory(id || '');
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingHistory | undefined>();

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cliente não encontrado</p>
      </div>
    );
  }

  // Meeting handlers
  const handleAddMeeting = () => {
    setEditingMeeting(undefined);
    setIsMeetingDialogOpen(true);
  };

  const handleEditMeeting = (meeting: MeetingHistory) => {
    setEditingMeeting(meeting);
    setIsMeetingDialogOpen(true);
  };

  const handleMeetingSubmit = (data: MeetingFormData) => {
    if (editingMeeting) {
      updateMeeting(editingMeeting.id, data);
    } else {
      addMeeting(data);
    }
  };

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

  return (
    <TaskProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={client.logo} alt={client.name} />
              <AvatarFallback className="text-lg font-semibold">
                {client.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">{client.segment}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(client.status)}>
                  {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Onboarding'}
                </Badge>
                <Badge variant="outline">{getSizeLabel(client.size)}</Badge>
              </div>
            </div>
          </div>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Editar Cliente
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{client.primaryContact.name}</p>
                        <p className="text-sm text-gray-600">{client.primaryContact.email}</p>
                        <p className="text-xs text-gray-500">{client.primaryContact.role}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{client.primaryContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{client.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Responsável: {client.responsibleManager}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Cliente desde {new Date(client.entryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Estatísticas Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Projetos Ativos</span>
                      <span className="text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tarefas Pendentes</span>
                      <span className="text-2xl font-bold text-orange-600">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Última Reunião</span>
                      <span className="text-sm text-gray-600">15/01/2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Próximo Marco</span>
                      <span className="text-sm text-gray-600">22/01/2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Projeto Alpha aprovado</p>
                        <p className="text-xs text-gray-500">2 dias atrás</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Reunião de alinhamento agendada</p>
                        <p className="text-xs text-gray-500">5 dias atrás</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Novo documento enviado</p>
                        <p className="text-xs text-gray-500">1 semana atrás</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projetos do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Informações Financeiras</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab - Updated with new functionality */}
          <TabsContent value="history" className="space-y-6">
            {/* Meeting History */}
            <MeetingHistoryTable
              meetings={meetings}
              onAdd={handleAddMeeting}
              onEdit={handleEditMeeting}
              onDelete={deleteMeeting}
            />

            {/* Critical Tasks */}
            <CriticalTasksCard clientId={id || ''} />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Meeting Form Dialog */}
        <MeetingFormDialog
          isOpen={isMeetingDialogOpen}
          onClose={() => setIsMeetingDialogOpen(false)}
          onSubmit={handleMeetingSubmit}
          meeting={editingMeeting}
        />
      </div>
    </TaskProvider>
  );
};

export default ClientProfile;
