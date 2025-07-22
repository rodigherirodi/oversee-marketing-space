
import React, { useState } from 'react';
import { Task } from '@/types/entities';
import { mockTeamMembers } from '@/data/mockData';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface TaskQuickFormProps {
  itemData: {
    title: string;
    dueDate: string;
  };
  projectId: string;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const TaskQuickForm = ({ itemData, projectId, onSubmit, onCancel }: TaskQuickFormProps) => {
  const { taskTypes, currentKanban } = useTaskContext();
  const [formData, setFormData] = useState({
    title: itemData.title,
    description: '',
    assignee: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    type: taskTypes[0]?.id || '',
    squad: 'Geral',
    dueDate: itemData.dueDate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.assignee) {
      return;
    }

    const taskData: Omit<Task, 'id' | 'createdAt'> = {
      title: formData.title,
      description: formData.description,
      status: currentKanban.stages[0]?.id || 'todo',
      priority: formData.priority,
      type: formData.type,
      assignee: formData.assignee,
      watchers: [formData.assignee],
      squad: formData.squad,
      clientId: '', // Will be filled by project context
      client: {} as any, // Will be filled by project context
      projectId: projectId,
      dueDate: formData.dueDate,
      tags: [],
      comments: [],
      attachments: [],
      customFields: {},
    };

    onSubmit(taskData);
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Criar Nova Tarefa</h4>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Título da tarefa"
            required
          />
        </div>

        <div>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descrição (opcional)"
            className="h-20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Select
              value={formData.assignee}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                {mockTeamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            size="sm" 
            disabled={!formData.title.trim() || !formData.assignee}
          >
            Criar Tarefa
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskQuickForm;
