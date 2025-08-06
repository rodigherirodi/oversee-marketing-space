
import React, { useState } from 'react';
import { Task, TaskType } from '@/types/entities';
import { useTaskContext } from '@/contexts/TaskContext';
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
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Building2,
  ArrowUpDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskListViewProps {
  tasks: Task[];
  taskTypes: TaskType[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ 
  tasks, 
  taskTypes, 
  onEditTask, 
  onDeleteTask 
}) => {
  const [sortBy, setSortBy] = useState<keyof Task>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedTasks = [...tasks].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof Task) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getTaskType = (typeId: string) => 
    taskTypes.find(type => type.id === typeId);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays < 0) return `${Math.abs(diffDays)}d atrasado`;
    if (diffDays <= 7) return `${diffDays}d`;

    return date.toLocaleDateString('pt-BR');
  };

  const getAssigneeName = (assignee: any): string => {
    if (!assignee) return 'Não atribuído';
    if (typeof assignee === 'string') return assignee;
    if (typeof assignee === 'object' && assignee.name) return assignee.name;
    return 'Não atribuído';
  };

  const getClientName = (client: any): string => {
    if (!client) return 'Cliente não informado';
    if (typeof client === 'string') return client;
    if (typeof client === 'object' && client.name) return client.name;
    return 'Cliente não informado';
  };

  const getSquadName = (squad: any): string => {
    if (!squad) return 'Squad não informado';
    if (typeof squad === 'string') return squad;
    if (typeof squad === 'object' && squad.name) return squad.name;
    return 'Squad não informado';
  };

  const getAssigneeInitials = (assigneeName: string): string => {
    if (assigneeName === 'Não atribuído') return '?';
    return assigneeName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAssigneeDisplayName = (assigneeName: string): string => {
    if (assigneeName === 'Não atribuído') return assigneeName;
    return assigneeName.split(' ')[0];
  };

  const getTaskTypeIcon = (taskType: TaskType | undefined): string => {
    if (!taskType || !taskType.icon) return '';
    if (typeof taskType.icon === 'string') return taskType.icon;
    return '';
  };

  const getTaskTypeName = (taskType: TaskType | undefined): string => {
    if (!taskType) return 'Tipo não definido';
    if (typeof taskType.name === 'string') return taskType.name;
    return 'Tipo não definido';
  };

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSort('title')}
                className="h-auto p-0 font-medium"
              >
                Tarefa
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSort('priority')}
                className="h-auto p-0 font-medium"
              >
                Prioridade
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Squad</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSort('dueDate')}
                className="h-auto p-0 font-medium"
              >
                Prazo
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => {
            const taskType = getTaskType(task.type);
            const isOverdue = new Date(task.dueDate) < new Date();
            const assigneeName = getAssigneeName(task.assignee);
            const clientName = getClientName(task.client);
            const squadName = getSquadName(task.squad);
            const assigneeInitials = getAssigneeInitials(assigneeName);
            const assigneeDisplayName = getAssigneeDisplayName(assigneeName);
            const taskTypeIcon = getTaskTypeIcon(taskType);
            const taskTypeName = getTaskTypeName(taskType);
            
            return (
              <TableRow 
                key={task.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onEditTask(task)}
              >
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium text-gray-900">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {task.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {taskType && (
                    <Badge 
                      variant="secondary"
                      className="text-xs"
                      style={{ 
                        backgroundColor: `${taskType.color}20`,
                        color: taskType.color 
                      }}
                    >
                      {taskTypeIcon} {taskTypeName}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`text-xs ${getPriorityColor(task.priority)}`}
                    variant="secondary"
                  >
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {assigneeInitials}
                    </div>
                    <span className="text-sm">
                      {assigneeDisplayName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {squadName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{clientName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 text-xs ${
                    isOverdue ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    {formatDate(task.dueDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma tarefa encontrada</p>
        </div>
      )}
    </div>
  );
};
