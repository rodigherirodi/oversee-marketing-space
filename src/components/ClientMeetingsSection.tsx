
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Clock, Users, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useSupabaseClientMeetings, MeetingFormData } from '@/hooks/useSupabaseClientMeetings';
import MeetingFormDialog from '@/components/MeetingFormDialog';
import { useToast } from '@/hooks/use-toast';

interface ClientMeetingsSectionProps {
  clientId: string;
}

export const ClientMeetingsSection: React.FC<ClientMeetingsSectionProps> = ({ clientId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const { meetings, loading, addMeeting, updateMeeting, deleteMeeting } = useSupabaseClientMeetings(clientId);
  const { toast } = useToast();

  const handleAddMeeting = async (data: MeetingFormData) => {
    const result = await addMeeting(data);
    if (result) {
      setShowDialog(false);
    }
  };

  const handleEditMeeting = async (data: MeetingFormData) => {
    if (!editingMeeting) return;
    
    const result = await updateMeeting(editingMeeting.id, data);
    if (result) {
      setEditingMeeting(null);
      setShowDialog(false);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta reunião?')) {
      await deleteMeeting(meetingId);
    }
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
            Reuniões
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
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Reuniões
            </div>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Reunião
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {meetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma reunião registrada ainda.</p>
              <p className="text-sm">Clique em "Nova Reunião" para agendar a primeira.</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg mb-1">{meeting.titulo}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(meeting.data_hora)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(meeting.duracao)}</span>
                      </div>
                      {meeting.tipo && (
                        <Badge variant="outline">{meeting.tipo}</Badge>
                      )}
                    </div>
                    
                    {meeting.participantes && meeting.participantes.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {meeting.participantes.map((participant, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {meeting.resumo && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {meeting.resumo}
                      </p>
                    )}
                    
                    {meeting.link_gravacao && (
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <ExternalLink className="w-4 h-4" />
                        <a 
                          href={meeting.link_gravacao} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Ver gravação
                        </a>
                      </div>
                    )}
                    
                    {meeting.observacoes && (
                      <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                        <strong>Observações:</strong> {meeting.observacoes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingMeeting(meeting);
                        setShowDialog(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMeeting(meeting.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <MeetingFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
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
    </>
  );
};
