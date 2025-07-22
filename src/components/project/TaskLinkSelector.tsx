
import React, { useState } from 'react';
import { Task } from '@/types/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface TaskLinkSelectorProps {
  availableTasks: Task[];
  onSelect: (taskId: string) => void;
  onCancel: () => void;
}

const TaskLinkSelector = ({ availableTasks, onSelect, onCancel }: TaskLinkSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = availableTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Vincular Tarefa Existente</h4>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar tarefas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Task List */}
      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {availableTasks.length === 0 
              ? 'Nenhuma tarefa disponível para vincular'
              : 'Nenhuma tarefa encontrada'
            }
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelect(task.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 mb-1">{task.title}</h5>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                    <span className="text-gray-500">
                      {task.assignee}
                    </span>
                    <span className="text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default TaskLinkSelector;
