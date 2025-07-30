
import React from 'react';
import { Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, Unlink, Trash2 } from 'lucide-react';

interface ChecklistItem {
  id: number;
  task: string;
  completed: boolean;
  date: string;
  taskId?: string;
  taskStatus?: string;
  isLinked: boolean;
  lastSync?: string;
}

interface ChecklistTaskCardProps {
  item: ChecklistItem;
  task?: Task;
  isEditing: boolean;
  onToggle: () => void;
  onUnlink: () => void;
  onUpdateTask: (id: number, field: 'task' | 'date', value: string) => void;
  onRemove: () => void;
}

const ChecklistTaskCard = ({ 
  item, 
  task, 
  isEditing, 
  onToggle, 
  onUnlink, 
  onUpdateTask, 
  onRemove 
}: ChecklistTaskCardProps) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'done':
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'todo': return 'A fazer';
      case 'in-progress': return 'Em andamento';
      case 'review': return 'Em revisão';
      case 'done': return 'Concluído';
      case 'completed': return 'Concluído';
      default: return status || 'Indefinido';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority || 'N/A';
    }
  };

  const handleOpenTask = () => {
    if (task) {
      // Open task in new tab - you can modify this to navigate within the app
      window.open(`/tasks?task=${task.id}`, '_blank');
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={item.completed}
          onCheckedChange={onToggle}
          disabled={!isEditing}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          {/* Task Title and Date */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Input
                  value={item.task}
                  onChange={(e) => onUpdateTask(item.id, 'task', e.target.value)}
                  className="flex-1 h-8 text-sm"
                />
                <Input
                  type="date"
                  value={item.date.split('/').reverse().join('-')}
                  onChange={(e) => {
                    const formattedDate = new Date(e.target.value).toLocaleDateString('pt-BR');
                    onUpdateTask(item.id, 'date', formattedDate);
                  }}
                  className="w-32 h-8 text-xs"
                />
              </>
            ) : (
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.task}</div>
                <div className="text-xs text-gray-500">até {item.date}</div>
              </div>
            )}
          </div>

          {/* Task Info */}
          {task && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getStatusColor(item.taskStatus)}>
                {getStatusLabel(item.taskStatus)}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {getPriorityLabel(task.priority)}
              </Badge>
              <span className="text-xs text-gray-600">{task.assignee?.name}</span>
              {item.lastSync && (
                <span className="text-xs text-gray-400">
                  Sync: {new Date(item.lastSync).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              )}
            </div>
          )}

          {/* Task Description */}
          {task?.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenTask}
              className="text-blue-600 hover:text-blue-700 p-1"
              title="Abrir tarefa"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onUnlink}
              className="text-orange-600 hover:text-orange-700 p-1"
              title="Desvincular tarefa"
            >
              <Unlink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 p-1"
              title="Remover etapa"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistTaskCard;
