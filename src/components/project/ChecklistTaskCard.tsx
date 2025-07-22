
import React from 'react';
import { Task } from '@/types/entities';
import { ExternalLink, Unlink, User, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
  task: Task;
  checklistItem: ChecklistItem;
  onUnlink: () => void;
}

const ChecklistTaskCard: React.FC<ChecklistTaskCardProps> = ({
  task,
  checklistItem,
  onUnlink
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'doing': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return '';
    const date = new Date(lastSync);
    return `Sincronizado em ${date.toLocaleString('pt-BR')}`;
  };

  return (
    <Card className="ml-8 mt-2 border-l-4 border-l-blue-500">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-blue-600">📎 Tarefa Vinculada</span>
              <Badge className={getStatusColor(task.status)} variant="secondary">
                {task.status}
              </Badge>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
            
            {task.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {task.assignee}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Flag className="w-3 h-3" />
                {task.squad}
              </div>
              <Badge className={getPriorityColor(task.priority)} variant="outline">
                {task.priority}
              </Badge>
            </div>
            
            {checklistItem.lastSync && (
              <div className="text-xs text-gray-400 mt-1">
                {formatLastSync(checklistItem.lastSync)}
              </div>
            )}
          </div>
          
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/tasks?task=${task.id}`, '_blank')}
              className="p-1 h-7 w-7"
              title="Abrir tarefa"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onUnlink}
              className="p-1 h-7 w-7 text-red-600 hover:text-red-700"
              title="Desvincular tarefa"
            >
              <Unlink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistTaskCard;
