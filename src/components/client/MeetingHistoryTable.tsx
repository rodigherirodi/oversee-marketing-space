
import React, { useState } from 'react';
import { MeetingHistory } from '@/types/client-history';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, ExternalLink, Plus, Users, Clock } from 'lucide-react';

interface MeetingHistoryTableProps {
  meetings: MeetingHistory[];
  onAdd: () => void;
  onEdit: (meeting: MeetingHistory) => void;
  onDelete: (id: string) => void;
}

export const MeetingHistoryTable: React.FC<MeetingHistoryTableProps> = ({
  meetings,
  onAdd,
  onEdit,
  onDelete
}) => {
  const handleDelete = (id: string, summary: string) => {
    if (confirm(`Tem certeza que deseja excluir a reunião "${summary}"?`)) {
      onDelete(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  const getMeetingTypeLabel = (type: string) => {
    const types = {
      alinhamento: 'Alinhamento',
      aprovacao: 'Aprovação',
      planejamento: 'Planejamento',
      apresentacao: 'Apresentação',
      outro: 'Outro'
    };
    return types[type as keyof typeof types] || type;
  };

  const getMeetingTypeColor = (type: string) => {
    const colors = {
      alinhamento: 'bg-blue-100 text-blue-700',
      aprovacao: 'bg-green-100 text-green-700',
      planejamento: 'bg-purple-100 text-purple-700',
      apresentacao: 'bg-orange-100 text-orange-700',
      outro: 'bg-gray-100 text-gray-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Histórico de Reuniões
          </CardTitle>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Reunião
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {meetings.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma reunião registrada</p>
            <p className="text-sm">Clique em "Adicionar Reunião" para começar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    <TableCell className="font-medium">
                      {formatDate(meeting.date)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getMeetingTypeColor(meeting.type)}>
                        {getMeetingTypeLabel(meeting.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{meeting.summary}</p>
                        {meeting.notes && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {meeting.notes}
                          </p>
                        )}
                      </div>
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {formatDuration(meeting.duration)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {meeting.link ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(meeting.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(meeting)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(meeting.id, meeting.summary)}
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
  );
};
