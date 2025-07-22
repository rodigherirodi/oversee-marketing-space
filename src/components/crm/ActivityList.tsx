
import React from 'react';
import { Activity, Lead } from '@/types/crm';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, Circle, Edit, Trash, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityListProps {
  activities: Activity[];
  leads: Lead[];
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (activityId: string) => void;
  onToggleComplete: (activity: Activity) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  leads,
  onEditActivity,
  onDeleteActivity,
  onToggleComplete,
}) => {
  const getLeadName = (leadId: string) => {
    const lead = leads.find((lead) => lead.id === leadId);
    return lead ? lead.name : 'Lead não encontrado';
  };

  const getActivityTypeLabel = (type: Activity['type']) => {
    const labels = {
      call: 'Ligação',
      email: 'E-mail',
      meeting: 'Reunião',
      note: 'Nota',
      task: 'Tarefa',
      stage_change: 'Mudança de Estágio',
    };
    return labels[type] || type;
  };

  const getActivityTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-700';
      case 'email': return 'bg-green-100 text-green-700';
      case 'meeting': return 'bg-purple-100 text-purple-700';
      case 'note': return 'bg-gray-100 text-gray-700';
      case 'task': return 'bg-orange-100 text-orange-700';
      case 'stage_change': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getOutcomeBadge = (outcome?: Activity['outcome']) => {
    if (!outcome) return null;
    
    const variants = {
      positive: 'bg-green-100 text-green-700',
      negative: 'bg-red-100 text-red-700',
      neutral: 'bg-gray-100 text-gray-700'
    };

    const labels = {
      positive: 'Positivo',
      negative: 'Negativo',
      neutral: 'Neutro'
    };

    return (
      <Badge className={`text-xs ${variants[outcome]}`}>
        {labels[outcome]}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const isDueDatePast = (dueDate?: Date) => {
    if (!dueDate) return false;
    return new Date() > dueDate;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Status</TableHead>
            <TableHead className="w-32">Tipo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="w-32">Resultado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                Nenhuma atividade encontrada
              </TableCell>
            </TableRow>
          ) : (
            activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleComplete(activity)}
                  >
                    {activity.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge className={getActivityTypeColor(activity.type)}>
                    {getActivityTypeLabel(activity.type)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{activity.title}</TableCell>
                <TableCell>
                  <Link 
                    to={`/comercial/crm/lead/${activity.leadId}`}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    {getLeadName(activity.leadId)}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell>{activity.responsiblePerson}</TableCell>
                <TableCell>{formatDate(activity.createdAt)}</TableCell>
                <TableCell>
                  {activity.dueDate ? (
                    <span className={isDueDatePast(activity.dueDate) && !activity.completed ? 'text-red-500 font-medium' : ''}>
                      {formatDate(activity.dueDate)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Não definido</span>
                  )}
                </TableCell>
                <TableCell>{getOutcomeBadge(activity.outcome)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditActivity(activity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDeleteActivity(activity.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
