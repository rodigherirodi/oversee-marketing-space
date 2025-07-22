
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import { Task, Client, Project, TaskType } from '../types/entities';
import { useTaskContext } from '@/contexts/TaskContext';
import { mockTeamMembers } from '@/data/mockData';
import { TeamMemberMultiSelect } from '@/components/tasks/TeamMemberMultiSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'> | Task) => void;
  clients?: Client[];
  projects?: Project[];
  editTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  clients = [], 
  projects = [],
  editTask = null
}) => {
  const { taskTypes, currentKanban } = useTaskContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: currentKanban.stages[0]?.id || 'todo',
    priority: 'medium' as Task['priority'],
    type: taskTypes[0]?.id || '',
    assignee: '',
    watchers: [] as string[],
    squad: currentKanban.department === 'all' ? 'Geral' : currentKanban.department,
    clientId: '',
    projectId: '',
    dueDate: '',
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');

  // Load edit data
  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description,
        status: editTask.status,
        priority: editTask.priority,
        type: editTask.type,
        assignee: editTask.assignee,
        watchers: editTask.watchers || [],
        squad: editTask.squad,
        clientId: editTask.clientId,
        projectId: editTask.projectId || '',
        dueDate: editTask.dueDate,
        tags: editTask.tags
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        status: currentKanban.stages[0]?.id || 'todo',
        priority: 'medium',
        type: taskTypes[0]?.id || '',
        assignee: '',
        watchers: [],
        squad: currentKanban.department === 'all' ? 'Geral' : currentKanban.department,
        clientId: '',
        projectId: '',
        dueDate: '',
        tags: []
      });
    }
  }, [editTask, currentKanban, taskTypes]);

  // Find selected client and project
  const selectedClient = clients.find(c => c.id === formData.clientId);
  const selectedProject = projects.find(p => p.id === formData.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.clientId) return;

    // Create the task object matching the Task interface
    const taskData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      type: formData.type,
      assignee: formData.assignee,
      watchers: formData.watchers,
      squad: formData.squad,
      clientId: formData.clientId,
      client: selectedClient!,
      projectId: formData.projectId || undefined,
      project: selectedProject || undefined,
      dueDate: formData.dueDate,
      tags: formData.tags,
      completedAt: formData.status === 'done' ? new Date().toISOString() : undefined,
      comments: editTask?.comments || [],
      attachments: editTask?.attachments || [],
      customFields: editTask?.customFields || {},
    };

    if (editTask) {
      onSubmit({ ...editTask, ...taskData });
    } else {
      onSubmit(taskData);
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      status: currentKanban.stages[0]?.id || 'todo',
      priority: 'medium',
      type: taskTypes[0]?.id || '',
      assignee: '',
      watchers: [],
      squad: currentKanban.department === 'all' ? 'Geral' : currentKanban.department,
      clientId: '',
      projectId: '',
      dueDate: '',
      tags: []
    });
    setIsExpanded(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getTaskType = (typeId: string) => taskTypes.find(t => t.id === typeId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-h-90vh overflow-y-auto transition-all duration-300 ${
        isExpanded ? 'max-w-6xl w-full' : 'max-w-2xl w-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title={isExpanded ? "Minimizar" : "Expandir"}
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Layout changes based on expanded state */}
          <div className={`grid gap-6 ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* Left Column / Main Content */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o título da tarefa..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={isExpanded ? 6 : 3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva os detalhes da tarefa..."
                />
              </div>

              {/* Type and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Tarefa
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo...">
                        {formData.type && getTaskType(formData.type) && (
                          <div className="flex items-center gap-2">
                            <span>{getTaskType(formData.type)!.icon}</span>
                            <span>{getTaskType(formData.type)!.name}</span>
                          </div>
                        )}
                      </SelectValue>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite uma tag e pressione Enter..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-md border border-blue-200 flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column / Additional Fields */}
            <div className="space-y-6">
              {/* Status and Squad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currentKanban.stages
                      .sort((a, b) => a.order - b.order)
                      .map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Squad
                  </label>
                  <select
                    value={formData.squad}
                    onChange={(e) => setFormData(prev => ({ ...prev, squad: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Geral">Geral</option>
                    <option value="Design">Design</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Conteúdo">Conteúdo</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Análise">Análise</option>
                    <option value="Gestão">Gestão</option>
                  </select>
                </div>
              </div>

              {/* Client and Project */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value, projectId: '' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projeto
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.clientId}
                  >
                    <option value="">Selecione um projeto...</option>
                    {projects
                      .filter(project => project.clientId === formData.clientId)
                      .map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                <Select
                  value={formData.assignee}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Watchers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Envolvidos (Watchers)
                </label>
                <TeamMemberMultiSelect
                  selectedMembers={formData.watchers}
                  onChange={(watchers) => setFormData(prev => ({ ...prev, watchers }))}
                  placeholder="Adicionar pessoas envolvidas..."
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Entrega
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editTask ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
