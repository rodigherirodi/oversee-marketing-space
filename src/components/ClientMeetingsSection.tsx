
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Calendar, ExternalLink, Clock, Users } from 'lucide-react';
import { useSupabaseClientMeetings, MeetingFormData } from '@/hooks/useSupabaseClientMeetings';
import { MeetingFormDialog } from '@/components/MeetingFormDialog';

interface ClientMeetingsSectionProps {
  clientId: string;
}

export const ClientMeetingsSection: React.FC<ClientMeetingsSectionProps> = ({ clientId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any | undefined>();
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useSupabaseClientMeetings(clientId);

  const handleSaveMeeting = async (data: MeetingFormData) => {
    if (editingMeeting) {
      await updateMeeting(editingMeeting.id, data);
      setEditingMeeting(undefined);
    } else {
      await addMeeting(data);
    }
    setIsFormOpen(false);
  };

  const handleEditMeeting = (meeting: any) => {
    setEditingMeeting(meeting);
    setIsFormOpen(true);
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    await deleteMeeting(meetingId);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      {formatDateTime(meeting.data_hora)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <p>{meeting.titulo}</p>
                        {meeting.resumo && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {meeting.resumo}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {meeting.tipo && (
                        <Badge variant="outline">
                          {meeting.tipo}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(meeting.duracao)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {meeting.participantes && meeting.participantes.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="text-sm">
                            {meeting.participantes.join(', ')}
                          </span>
                        </div>
                      )}
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditMeeting(meeting)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteMeeting(meeting.id)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MeetingFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMeeting(undefined);
        }}
        onSubmit={handleSaveMeeting}
        meeting={editingMeeting}
      />
    </>
  );
};
