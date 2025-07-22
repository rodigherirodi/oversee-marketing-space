
import React, { useState } from 'react';
import { Task } from '@/types/entities';
import { Search, Calendar, User, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskLinkSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (taskId: string) => void;
  projectTasks: Task[];
  excludeLinkedTasks: string[];
}

const TaskLinkSelector: React.FC<TaskLinkSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  projectTasks,
  excludeLinkedTasks
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Filter available tasks (exclude already linked ones)
  const availableTasks = projectTasks.filter(task => 
    !excludeLinkedTasks.includes(task.id) &&
    (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     task.assignee.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedTask = selectedTaskId ? availableTasks.find(task => task.id === selectedTaskId) : null;

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

  const handleConfirm = () => {
    if (selectedTaskId) {
      onSelect(selectedTaskId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Vincular Tarefa Existente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar tarefas por nome, descrição ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Task List */}
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {availableTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {projectTasks.length === 0 
                    ? "Nenhuma tarefa encontrada neste projeto."
                    : searchTerm 
                      ? "Nenhuma tarefa encontrada com esse termo."
                      : "Todas as tarefas já estão vinculadas."
                  }
                </div>
              ) : (
                availableTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTaskId === task.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
                      <div className="flex gap-1 ml-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Selected Task Preview */}
          {selectedTask && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Tarefa Selecionada:</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium">{selectedTask.title}</span>
                  <div className="flex gap-1">
                    <Badge className={getPriorityColor(selectedTask.priority)}>
                      {selectedTask.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedTask.status)}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Responsável: {selectedTask.assignee} • 
                  Prazo: {new Date(selectedTask.dueDate).toLocaleDateString('pt-BR')} • 
                  Squad: {selectedTask.squad}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedTaskId}
            >
              Vincular Tarefa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskLinkSelector;
