
import React from 'react';
import { AlertTriangle, Clock, User } from 'lucide-react';
import { Task } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompactOverdueTasksProps {
  overdueTasks: Task[];
}

const CompactOverdueTasks: React.FC<CompactOverdueTasksProps> = ({ overdueTasks }) => {
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

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50 h-fit shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700 text-lg font-bold">
          <AlertTriangle className="w-5 h-5" />
          🚨 Tarefas Atrasadas ({overdueTasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {overdueTasks.slice(0, 5).map((task) => (
          <div 
            key={task.id} 
            className="flex items-start justify-between py-3 px-2 hover:bg-white hover:bg-opacity-60 rounded-lg cursor-pointer transition-colors border border-red-200"
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate text-sm">
                {task.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                {task.clientId && (
                  <>
                    <User className="w-3 h-3" />
                    <span>Cliente: {task.clientId}</span>
                    <span>•</span>
                  </>
                )}
                <Clock className="w-3 h-3" />
                <span>Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span className="text-red-600 font-bold">
                  ({getDaysOverdue(task.dueDate)}d atraso)
                </span>
                <span className={`font-bold ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {overdueTasks.length > 5 && (
          <div className="text-center py-2 text-sm text-red-600 font-medium">
            +{overdueTasks.length - 5} tarefas restantes
          </div>
        )}
        
        {overdueTasks.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            🎉 Nenhuma tarefa atrasada!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactOverdueTasks;
