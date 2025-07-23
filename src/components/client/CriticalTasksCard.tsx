
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types/entities';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ExternalLink, Calendar, User } from 'lucide-react';

interface CriticalTasksCardProps {
  clientId: string;
}

export const CriticalTasksCard: React.FC<CriticalTasksCardProps> = ({ clientId }) => {
  const { tasks } = useTaskContext();
  const navigate = useNavigate();

  // Get critical tasks for this client
  const getCriticalTasks = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return tasks.filter(task => {
      // Filter by client ID (through project relationship)
      const isClientTask = task.clientId === clientId;
      
      // Filter by pending/in-progress status
      const isPending = ['todo', 'in_progress', 'review'].includes(task.status);
      
      // Filter by high priority or due soon
      const isHighPriority = task.priority === 'high';
      const isDueSoon = new Date(task.dueDate) <= sevenDaysFromNow;
      const isOverdue = new Date(task.dueDate) < now;
      
      return isClientTask && isPending && (isHighPriority || isDueSoon || isOverdue);
    }).sort((a, b) => {
      // Sort by due date, overdue first
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const criticalTasks = getCriticalTasks();

  const handleViewAllTasks = () => {
    navigate('/tasks');
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks?taskId=${taskId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const getTaskStatus = (task: Task) => {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    if (dueDate < now) {
      return { label: 'Atrasada', color: 'bg-red-100 text-red-700' };
    } else if (dueDate <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)) {
      return { label: 'Urgente', color: 'bg-orange-100 text-orange-700' };
    } else {
      return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Tarefas Críticas Pendentes
          </CardTitle>
          <Button variant="outline" onClick={handleViewAllTasks}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Todas as Tarefas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {criticalTasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma tarefa crítica pendente</p>
            <p className="text-sm">Todas as tarefas importantes estão em dia!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarefa</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalTasks.slice(0, 5).map((task) => {
                  const status = getTaskStatus(task);
                  return (
                    <TableRow key={task.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{task.assignee}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{formatDate(task.dueDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTaskClick(task.id)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {criticalTasks.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={handleViewAllTasks}>
                  Ver mais {criticalTasks.length - 5} tarefas críticas
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
