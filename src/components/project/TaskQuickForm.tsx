
import React, { useState } from 'react';
import { Task } from '@/types/entities';
import { mockTeamMembers, mockClients } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChecklistItem {
  id: number;
  task: string;
  completed: boolean;
  date: string;
  taskId?: string;
  taskStatus?: string;
  isLinked: boolean;
  lastSync?: string;
}

interface TaskQuickFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => void;
  checklistItem: ChecklistItem;
  projectId?: string;
}

const TaskQuickForm: React.FC<TaskQuickFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  checklistItem,
  projectId
}) => {
  const [formData, setFormData] = useState({
    title: checklistItem.task,
    description: `Tarefa criada a partir da etapa: ${checklistItem.task}`,
    assignee: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    type: 'task',
    squad: 'Gestão',
    clientId: '',
    tags: [] as string[],
    watchers: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assignee) {
      alert('Por favor, selecione um responsável');
      return;
    }

    const selectedClient = mockClients.find(client => client.id === formData.clientId);
    
    onSubmit({
      ...formData,
      client: selectedClient || mockClients[0],
      dueDate: checklistItem.date.split('/').reverse().join('-')
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Assignee */}
          <div>
            <Label>Responsável *</Label>
            <Select
              value={formData.assignee}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {mockTeamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name} - {member.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <Label>Prioridade</Label>
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
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div>
            <Label>Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Tarefa Geral</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                <SelectItem value="conteudo">Conteúdo</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="analise">Análise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Squad */}
          <div>
            <Label>Squad</Label>
            <Select
              value={formData.squad}
              onValueChange={(value) => setFormData(prev => ({ ...prev, squad: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                <SelectItem value="Conteúdo">Conteúdo</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Análise">Análise</SelectItem>
                <SelectItem value="Gestão">Gestão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Client */}
          <div>
            <Label>Cliente</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date Display */}
          <div>
            <Label>Prazo</Label>
            <Input
              value={checklistItem.date}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskQuickForm;
