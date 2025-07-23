
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Edit, Trash2, ExternalLink, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MeetingFormDialog } from './MeetingFormDialog';
import { useMeetingHistory } from '@/hooks/useMeetingHistory';
import { MeetingHistory, MeetingFormData } from '@/types/client-history';

interface MeetingHistoryTableProps {
  clientId: string;
}

export const MeetingHistoryTable: React.FC<MeetingHistoryTableProps> = ({ clientId }) => {
  const { getMeetingsByClient, addMeeting, updateMeeting, deleteMeeting } = useMeetingHistory();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingHistory | undefined>();
  const [deletingMeeting, setDeletingMeeting] = useState<string | null>(null);

  const meetings = getMeetingsByClient(clientId);

  const handleAddMeeting = (data: MeetingFormData) => {
    addMeeting(clientId, data);
  };

  const handleEditMeeting = (data: MeetingFormData) => {
    if (editingMeeting) {
      updateMeeting(editingMeeting.id, data);
      setEditingMeeting(undefined);
    }
  };

  const handleDeleteMeeting = () => {
    if (deletingMeeting) {
      deleteMeeting(deletingMeeting);
      setDeletingMeeting(null);
    }
  };

  const openEditDialog = (meeting: MeetingHistory) => {
    setEditingMeeting(meeting);
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setEditingMeeting(undefined);
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'virtual': return 'bg-blue-100 text-blue-800';
      case 'presencial': return 'bg-green-100 text-green-800';
      case 'telefone': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    switch (type) {
      case 'virtual': return 'Virtual';
      case 'presencial': return 'Presencial';
      case 'telefone': return 'Telefone';
      default: return type;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Histórico de Reuniões
        </CardTitle>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Reunião
        </Button>
      </CardHeader>
      <CardContent>
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma reunião registrada</p>
            <p className="text-sm">Clique em "Nova Reunião" para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getMeetingTypeColor(meeting.type)}>
                        {getMeetingTypeLabel(meeting.type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(meeting.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    
                    <h4 className="font-medium">{meeting.summary}</h4>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{meeting.participants.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{meeting.duration} min</span>
                      </div>
                    </div>
                    
                    {meeting.notes && (
                      <p className="text-sm text-muted-foreground">{meeting.notes}</p>
                    )}
                    
                    {meeting.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(meeting.link, '_blank')}
                        className="w-fit"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Link
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(meeting)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingMeeting(meeting.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <MeetingFormDialog
          open={isFormOpen}
          onClose={closeFormDialog}
          onSubmit={editingMeeting ? handleEditMeeting : handleAddMeeting}
          meeting={editingMeeting}
        />

        <AlertDialog open={!!deletingMeeting} onOpenChange={() => setDeletingMeeting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
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
      </CardContent>
    </Card>
  );
};
