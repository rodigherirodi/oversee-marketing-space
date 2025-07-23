
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertTriangle, Calendar, ArrowRight, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTaskContext } from '@/contexts/TaskContext';

interface CriticalTasksCardProps {
  clientId: string;
}

export const CriticalTasksCard: React.FC<CriticalTasksCardProps> = ({ clientId }) => {
  const navigate = useNavigate();
  const { tasks } = useTaskContext();

  // Filtrar tarefas críticas para o cliente
  const criticalTasks = tasks.filter(task => {
    // Verificar se a tarefa está relacionada ao cliente (pode ser por nome, ID, etc.)
    const isClientRelated = task.title.toLowerCase().includes('cliente') || 
                           task.description?.toLowerCase().includes('cliente');
    
    // Verificar se a tarefa está pendente
    const isPending = task.status !== 'completed';
    
    // Verificar se a tarefa é de alta prioridade
    const isHighPriority = task.priority === 'high';
    
    // Verificar se a tarefa está próxima do prazo (próximos 7 dias)
    const isNearDeadline = task.dueDate ? 
      isAfter(parseISO(task.dueDate), new Date()) && 
      isAfter(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), parseISO(task.dueDate)) : 
      false;
    
    return isPending && (isHighPriority || isNearDeadline) && isClientRelated;
  }).slice(0, 5); // Limitar a 5 tarefas

  const handleViewAllTasks = () => {
    navigate('/tasks');
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks?taskId=${taskId}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Tarefas Críticas Pendentes
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleViewAllTasks}>
          Ver Todas
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        {criticalTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma tarefa crítica pendente</p>
            <p className="text-sm">Todas as tarefas importantes estão em dia!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {criticalTasks.map((task) => (
              <div 
                key={task.id} 
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm line-clamp-1">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(parseISO(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </div>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {task.status === 'todo' ? 'A Fazer' : 
                         task.status === 'in_progress' ? 'Em Andamento' : 
                         'Concluída'}
                      </Badge>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                </div>
              </div>
            ))}
            
            <div className="pt-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleViewAllTasks}
                className="w-full"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Ver todas as tarefas no sistema
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
