
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useMeetingHistory } from '@/hooks/useMeetingHistory';
import { MeetingFormDialog } from './MeetingFormDialog';
import { MeetingHistory } from '@/types/client-history';

interface MeetingHistorySectionProps {
  clientId: string;
}

const meetingTypeColors: Record<string, string> = {
  alinhamento: 'bg-blue-500',
  aprovacao: 'bg-green-500',
  planejamento: 'bg-purple-500',
  apresentacao: 'bg-orange-500',
  outro: 'bg-gray-500'
};

const meetingTypeLabels: Record<string, string> = {
  alinhamento: 'Alinhamento',
  aprovacao: 'Aprovação',
  planejamento: 'Planejamento',
  apresentacao: 'Apresentação',
  outro: 'Outro'
};

export const MeetingHistorySection = ({ clientId }: MeetingHistorySectionProps) => {
  const { getMeetingsByClient, addMeeting, updateMeeting, deleteMeeting } = useMeetingHistory();
  const meetings = getMeetingsByClient(clientId);

  const handleDelete = (meeting: MeetingHistory) => {
    if (window.confirm('Tem certeza que deseja excluir esta reunião?')) {
      deleteMeeting(meeting.id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histórico de Reuniões</CardTitle>
        <MeetingFormDialog
          clientId={clientId}
          onSave={addMeeting}
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Reunião
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma reunião registrada
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Resumo</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>
                    {new Date(meeting.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${meetingTypeColors[meeting.type]} text-white`}
                    >
                      {meetingTypeLabels[meeting.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {meeting.summary}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {meeting.participants.slice(0, 2).map((participant, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {participant}
                        </Badge>
                      ))}
                      {meeting.participants.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{meeting.participants.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{meeting.duration}</TableCell>
                  <TableCell>
                    {meeting.link ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(meeting.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <MeetingFormDialog
                        meeting={meeting}
                        clientId={clientId}
                        onSave={addMeeting}
                        onUpdate={updateMeeting}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(meeting)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
