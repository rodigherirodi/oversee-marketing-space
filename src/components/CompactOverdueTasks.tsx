
import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { UserProductivity } from '@/types/newEntities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompactOverdueTasksProps {
  user: UserProductivity;
}

const CompactOverdueTasks: React.FC<CompactOverdueTasksProps> = ({ user }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '[Alta]';
      case 'medium':
        return '[Média]';
      case 'low':
        return '[Baixa]';
      default:
        return '[Média]';
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
      <CardContent className="pt-0 space-y-2">
        {user.overdueTasksList.map((task) => (
          <div 
            key={task.id} 
            className="flex items-start justify-between py-2 px-1 hover:bg-white hover:bg-opacity-60 rounded cursor-pointer transition-colors text-sm"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {task.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                {task.client && <span>Cliente: {task.client}</span>}
                <span>•</span>
                <span>Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span className="text-red-600 font-medium">
                  {task.daysOverdue > 0 ? `(${task.daysOverdue}d atraso)` : '(hoje)'}
                </span>
                <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {user.overdueTasksList.length > 4 && (
          <div className="text-center py-2 text-xs text-gray-500">
            +{user.overdueTasksList.length - 4} tarefas restantes
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactOverdueTasks;
