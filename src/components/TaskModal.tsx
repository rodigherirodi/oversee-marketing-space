
import React, { useState, useEffect } from 'react';
import { Task } from '@/hooks/useTasks';
import { useTaskTypes } from '@/hooks/useTaskTypes';
import { useKanbanConfigs } from '@/hooks/useKanbanConfigs';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Maximize2, Minimize2 } from 'lucide-react';
import { TaskWatchersSelector } from './tasks/TaskWatchersSelector';
import { TaskCommentsSection } from './tasks/TaskCommentsSection';
import { TaskAttachmentsSection } from './tasks/TaskAttachmentsSection';
import { TagInput } from './tasks/TagInput';
import { ResponsibleSelector } from './tasks/ResponsibleSelector';

interface TaskModalProps {
  editTask?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  editTask,
  isOpen,
  onClose,
  onSubmit
}) => {
  const { taskTypes } = useTaskTypes();
  const { kanbanConfigs, currentKanban } = useKanbanConfigs();
  const { clients } = useClients();
  const { projects } = useProjects();
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignee_id: '',
    due_date: '',
    status: 'todo',
    type_id: '',
    squad: 'operacao',
    client_id: '',
    project_id: '',
    tags: [] as string[],
    watchers: [] as string[]
  });

  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'medium',
        assignee_id: editTask.assignee_id || '',
        due_date: editTask.due_date || '',
        status: editTask.status || 'todo',
        type_id: editTask.type_id || '',
        squad: editTask.squad || 'operacao',
        client_id: editTask.client_id || '',
        project_id: editTask.project_id || '',
        tags: editTask.tags || [],
        watchers: editTask.watchers?.map(w => w.id) || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assignee_id: '',
        due_date: '',
        status: 'todo',
        type_id: '',
        squad: 'operacao',
        client_id: '',
        project_id: '',
        tags: [],
        watchers: []
      });
    }
  }, [editTask, isOpen]);

  // Filter projects based on selected client
  useEffect(() => {
    if (formData.client_id) {
      const clientProjects = projects.filter(project => project.clientId === formData.client_id);
      setFilteredProjects(clientProjects);
      
      // Clear project selection if current project doesn't belong to selected client
      if (formData.project_id && !clientProjects.some(p => p.id === formData.project_id)) {
        setFormData(prev => ({ ...prev, project_id: '' }));
      }
    } else {
      setFilteredProjects(projects);
    }
  }, [formData.client_id, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const client = clients.find(c => c.id === formData.client_id);
    const project = projects.find(p => p.id === formData.project_id);
    
    const taskData: Partial<Task> = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      assignee_id: formData.assignee_id,
      due_date: formData.due_date,
      status: formData.status,
      type_id: formData.type_id,
      squad: formData.squad,
      client_id: formData.client_id,
      project_id: formData.project_id || undefined,
      tags: formData.tags
    };
    
    onSubmit(taskData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const commonTags = ['urgente', 'bug', 'melhoria', 'feature', 'documentacao', 'teste', 'revisao'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full max-h-full w-screen h-screen' : 'max-w-4xl max-h-[90vh]'} overflow-y-auto`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {editTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="watchers">Observadores</TabsTrigger>
            {editTask && <TabsTrigger value="comments">Comentários</TabsTrigger>}
            {editTask && <TabsTrigger value="attachments">Anexos</TabsTrigger>}
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>
                
                <ResponsibleSelector
                  value={formData.assignee_id}
                  onChange={(value) => handleInputChange('assignee_id', value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva a tarefa"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={formData.type_id} onValueChange={(value) => handleInputChange('type_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map(type => (
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

                <div className="space-y-2">
                  <Label>Squad</Label>
                  <Select value={formData.squad} onValueChange={(value) => handleInputChange('squad', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a squad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operacao">Operação</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="academy">Academy</SelectItem>
                      <SelectItem value="cultura">Cultura</SelectItem>
                      <SelectItem value="gestao">Gestão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Data de Vencimento</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentKanban?.stages?.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select 
                    value={formData.client_id} 
                    onValueChange={(value) => handleInputChange('client_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Projeto</Label>
                  <Select 
                    value={formData.project_id} 
                    onValueChange={(value) => handleInputChange('project_id', value)}
                    disabled={!formData.client_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !formData.client_id ? "Selecione um cliente primeiro" : "Selecione o projeto"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TagInput
                tags={formData.tags}
                onChange={(tags) => handleInputChange('tags', tags)}
                suggestions={commonTags}
              />

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editTask ? 'Atualizar' : 'Criar'} Tarefa
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="watchers" className="mt-6">
            <TaskWatchersSelector
              taskId={editTask?.id}
              selectedWatchers={formData.watchers}
              onChange={(watchers) => handleInputChange('watchers', watchers)}
            />
          </TabsContent>

          {editTask && (
            <>
              <TabsContent value="comments" className="mt-6">
                <TaskCommentsSection taskId={editTask.id} />
              </TabsContent>

              <TabsContent value="attachments" className="mt-6">
                <TaskAttachmentsSection taskId={editTask.id} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
