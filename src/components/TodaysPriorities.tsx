
import React from 'react';
import { Calendar, Clock, CheckCircle, User, Target } from 'lucide-react';
import { Task } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TodaysPrioritiesProps {
  todayTasks: Task[];
}

const TodaysPriorities: React.FC<TodaysPrioritiesProps> = ({ todayTasks }) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'todo':
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅ Concluído';
      case 'in-progress':
        return '🔄 Em andamento';
      case 'todo':
      default:
        return '⏸ Pendente';
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50 h-fit shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700 text-lg font-bold">
          <Target className="w-5 h-5" />
          🎯 Prioridades de Hoje ({todayTasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {todayTasks.slice(0, 5).map((task) => (
          <div 
            key={task.id} 
            className="flex items-start gap-3 py-3 px-2 hover:bg-white hover:bg-opacity-60 rounded-lg cursor-pointer transition-colors border border-blue-200"
          >
            <CheckCircle className={`w-4 h-4 mt-0.5 ${getStatusColor(task.status)}`} />
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate text-sm">
                {task.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                <Calendar className="w-3 h-3" />
                <span>Hoje</span>
                
                {task.clientId && (
                  <>
                    <span>•</span>
                    <User className="w-3 h-3" />
                    <span>{task.clientId}</span>
                  </>
                )}
                
                <span>•</span>
                <span className={getStatusColor(task.status)}>
                  {getStatusText(task.status)}
                </span>
                
                <span>•</span>
                <span className={`font-bold ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {todayTasks.length > 5 && (
          <div className="text-center py-2 text-sm text-blue-600 font-medium">
            +{todayTasks.length - 5} tarefas restantes
          </div>
        )}
        
        {todayTasks.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            📅 Nenhuma tarefa para hoje!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysPriorities;
