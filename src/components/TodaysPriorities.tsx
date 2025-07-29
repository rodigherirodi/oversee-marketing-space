
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { Task } from '@/types/entities';

interface TodaysPrioritiesProps {
  todayTasks: Task[];
}

const TodaysPriorities: React.FC<TodaysPrioritiesProps> = ({ todayTasks }) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Prioridades de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhuma tarefa para hoje</p>
            <p className="text-sm text-muted-foreground mt-1">
              Aproveite para planejar suas próximas atividades
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{task.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.client?.name} • {task.assignee}
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getPriorityColor(task.priority)}`}
                >
                  {getPriorityLabel(task.priority)}
                </Badge>
              </div>
            ))}
            
            {todayTasks.length > 5 && (
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  +{todayTasks.length - 5} tarefas adicionais
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysPriorities;
