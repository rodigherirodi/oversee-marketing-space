
import React from 'react';
import { AlertTriangle, User } from 'lucide-react';
import { UserProductivity } from '@/types/newEntities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CompactOverdueTasksProps {
  user: UserProductivity;
}

const CompactOverdueTasks: React.FC<CompactOverdueTasksProps> = ({ user }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Média';
    }
  };

  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4" />
          Tarefas Atrasadas ({user.overdueTasks})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {user.overdueTasksList.slice(0, 4).map((task) => (
            <div key={task.id} className="bg-white rounded-lg p-3 border border-red-200">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                  {task.title}
                </h4>
                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                  {getPriorityText(task.priority)}
                </Badge>
              </div>
              
              {task.client && (
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <User className="w-3 h-3" />
                  <span>{task.client}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Venceu: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                </span>
                <span className="text-red-600 font-medium">
                  {task.daysOverdue > 0 ? `${task.daysOverdue}d atraso` : 'Vence hoje'}
                </span>
              </div>
            </div>
          ))}
          
          {user.overdueTasksList.length > 4 && (
            <div className="text-center py-2">
              <span className="text-xs text-gray-500">
                +{user.overdueTasksList.length - 4} tarefas restantes
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactOverdueTasks;
