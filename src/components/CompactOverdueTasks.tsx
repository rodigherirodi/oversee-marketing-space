
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, User } from 'lucide-react';
import { Task } from '@/types/entities';

interface CompactOverdueTasksProps {
  overdueTasks: Task[];
}

const CompactOverdueTasks: React.FC<CompactOverdueTasksProps> = ({ overdueTasks }) => {
  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5" />
          Tarefas Atrasadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {overdueTasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-green-700 font-medium">Parabéns!</p>
            <p className="text-xs text-green-600 mt-1">
              Nenhuma tarefa atrasada
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {overdueTasks.slice(0, 5).map((task) => {
              const daysOverdue = getDaysOverdue(task.dueDate);
              return (
                <div key={task.id} className="bg-white p-3 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-red-900 truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-red-700">
                          {task.client?.name}
                        </p>
                        <span className="text-xs text-red-600">•</span>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-red-600" />
                          <span className="text-xs text-red-700">{task.assignee}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getPriorityColor(task.priority)}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        <span className="text-xs text-red-600 font-medium">
                          {daysOverdue} {daysOverdue === 1 ? 'dia' : 'dias'} atrasado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {overdueTasks.length > 5 && (
              <div className="text-center pt-2">
                <p className="text-sm text-red-700">
                  +{overdueTasks.length - 5} tarefas atrasadas
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactOverdueTasks;
