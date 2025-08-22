
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskDTO } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Link, Calendar, User, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskLinkSelectorProps {
  selectedTasks: string[];
  onTasksChange: (taskIds: string[]) => void;
  excludeProjectId?: string;
}

const TaskLinkSelector = ({ selectedTasks, onTasksChange, excludeProjectId }: TaskLinkSelectorProps) => {
  const { tasks } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks by search query and exclude current project tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.descricao && task.descricao.toLowerCase().includes(searchQuery.toLowerCase()));
    const notFromCurrentProject = !excludeProjectId || task.projeto_id !== excludeProjectId;
    return matchesSearch && notFromCurrentProject;
  });

  const handleTaskToggle = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      onTasksChange(selectedTasks.filter(id => id !== taskId));
    } else {
      onTasksChange([...selectedTasks, taskId]);
    }
  };

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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar tarefas para vincular..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="text-sm text-gray-600">
        {selectedTasks.length} tarefa(s) selecionada(s)
      </div>

      <ScrollArea className="h-64 border rounded-lg">
        <div className="p-4 space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedTasks.includes(task.id)
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTaskToggle(task.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {task.titulo}
                  </h4>
                  {task.descricao && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {task.descricao}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={getPriorityColor(task.prioridade)}>
                      <Flag className="w-3 h-3 mr-1" />
                      {task.prioridade}
                    </Badge>
                    
                    <Badge variant="secondary" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    
                    {task.responsavel && (
                      <Badge variant="outline">
                        <User className="w-3 h-3 mr-1" />
                        {task.responsavel}
                      </Badge>
                    )}
                    
                    {task.data_entrega && (
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(task.data_entrega), 'dd/MM', { locale: ptBR })}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {selectedTasks.includes(task.id) && (
                  <Link className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa disponível'}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskLinkSelector;
