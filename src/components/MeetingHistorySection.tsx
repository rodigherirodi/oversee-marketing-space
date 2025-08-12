
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Plus, Edit, Trash2, ExternalLink, Calendar, Clock, Users } from 'lucide-react';
import { useSupabaseClientMeetings, MeetingFormData } from '@/hooks/useSupabaseClientMeetings';
import MeetingFormDialog from '@/components/MeetingFormDialog';
import { useToast } from '@/hooks/use-toast';

interface MeetingHistorySectionProps {
  clientId: string;
}

const meetingTypeColors = {
  alinhamento: 'bg-blue-100 text-blue-800',
  aprovacao: 'bg-green-100 text-green-800',
  planejamento: 'bg-yellow-100 text-yellow-800',
  apresentacao: 'bg-purple-100 text-purple-800',
  outro: 'bg-gray-100 text-gray-800',
};

const meetingTypeLabels = {
  alinhamento: 'Alinhamento',
  aprovacao: 'Aprovação',
  planejamento: 'Planejamento',
  apresentacao: 'Apresentação',
  outro: 'Outro',
};

export const MeetingHistorySection: React.FC<MeetingHistorySectionProps> = ({ clientId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(undefined);
  const [deletingMeeting, setDeletingMeeting] = useState<any>(undefined);
  const { meetings, loading, addMeeting, updateMeeting, deleteMeeting } = useSupabaseClientMeetings(clientId);
  const { toast } = useToast();

  const handleAddMeeting = async (data: MeetingFormData) => {
    const result = await addMeeting(data);
    if (result) {
      setIsFormOpen(false);
      toast({
        title: "Reunião adicionada",
        description: "A reunião foi adicionada ao histórico com sucesso.",
      });
    }
  };

  const handleEditMeeting = async (data: MeetingFormData) => {
    if (editingMeeting) {
      const result = await updateMeeting(editingMeeting.id, data);
      if (result) {
        setEditingMeeting(undefined);
        setIsFormOpen(false);
        toast({
          title: "Reunião atualizada",
          description: "As informações da reunião foram atualizadas com sucesso.",
        });
      }
    }
  };

  const handleDeleteMeeting = async () => {
    if (deletingMeeting) {
      const result = await deleteMeeting(deletingMeeting.id);
      if (result) {
        setDeletingMeeting(undefined);
        toast({
          title: "Reunião excluída",
          description: "A reunião foi removida do histórico.",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'Não definida';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Histórico de Reuniões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Histórico de Reuniões
          </CardTitle>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Reunião
          </Button>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma reunião registrada ainda.</p>
              <p className="text-sm">Clique em "Nova Reunião" para adicionar a primeira.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Resumo</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        {formatDateTime(meeting.data_hora)}
                      </TableCell>
                      <TableCell>
                        {meeting.tipo && (
                          <Badge className={meetingTypeColors[meeting.tipo as keyof typeof meetingTypeColors] || 'bg-gray-100 text-gray-800'}>
                            {meetingTypeLabels[meeting.tipo as keyof typeof meetingTypeLabels] || meeting.tipo}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{meeting.titulo}</p>
                          {meeting.participantes && meeting.participantes.length > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                              <Users className="w-3 h-3" />
                              {meeting.participantes.join(', ')}
                            </div>
                          )}
                          {meeting.resumo && (
                            <p className="text-sm text-muted-foreground mt-1">{meeting.resumo}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(meeting.duracao)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {meeting.link_gravacao ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a href={meeting.link_gravacao} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMeeting(meeting);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingMeeting(meeting)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <MeetingFormDialog
        open={isFormOpen || !!editingMeeting}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingMeeting(undefined);
        }}
        onSubmit={editingMeeting ? handleEditMeeting : handleAddMeeting}
        initialData={editingMeeting ? {
          titulo: editingMeeting.titulo,
          data_hora: editingMeeting.data_hora,
          duracao: editingMeeting.duracao,
          tipo: editingMeeting.tipo,
          resumo: editingMeeting.resumo,
          participantes: editingMeeting.participantes,
          link_gravacao: editingMeeting.link_gravacao,
          observacoes: editingMeeting.observacoes,
        } : undefined}
        isEditing={!!editingMeeting}
      />

      <AlertDialog open={!!deletingMeeting} onOpenChange={() => setDeletingMeeting(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir reunião</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta reunião? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMeeting}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
