import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskDTO } from '@/types/database';

interface ChecklistTaskCardProps {
  task: TaskDTO;
  onToggleStatus: (taskId: string, completed: boolean) => void;
  onEdit: (task: TaskDTO) => void;
  onDelete: (taskId: string) => void;
}

const ChecklistTaskCard = ({ task, onToggleStatus, onEdit, onDelete }: ChecklistTaskCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const isCompleted = task.status === 'completed';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleToggle = () => {
    onToggleStatus(task.id, !isCompleted);
  };

  return (
    <div className={cn(
      "bg-white border rounded-lg p-4 transition-all duration-200",
      isCompleted ? "opacity-75 bg-gray-50" : "hover:shadow-md"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggle}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={cn(
              "font-medium text-gray-900 truncate",
              isCompleted && "line-through text-gray-500"
            )}>
              {task.titulo}
            </h4>
            
            <div className="flex items-center gap-2 ml-2">
              <Badge className={getPriorityColor(task.prioridade)}>
                {getPriorityLabel(task.prioridade)}
              </Badge>
              
              {task.responsavel_nome && (
                <span className="text-xs text-gray-500 truncate max-w-20">
                  {task.responsavel_nome}
                </span>
              )}
            </div>
          </div>
          
          {task.descricao && showDetails && (
            <p className="text-sm text-gray-600 mb-2">
              {task.descricao}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {task.data_entrega && (
                <span>Entrega: {formatDate(task.data_entrega)}</span>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{task.tags.join(', ')}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="h-6 px-2 text-xs"
              >
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-6 px-2 text-xs"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistTaskCard;
