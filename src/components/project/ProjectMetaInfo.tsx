
import React, { useState } from 'react';
import { Calendar, User, Users, Tag, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, Client } from '@/types/entities';
import { mockClients } from '@/data/mockData';

interface ProjectMetaInfoProps {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectMetaInfo = ({ project, isEditing, onUpdate }: ProjectMetaInfoProps) => {
  const [editedProject, setEditedProject] = useState(project);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-green-100 text-green-700';
      case 'planning': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'paused': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'Em andamento';
      case 'planning': return 'Planejamento';
      case 'review': return 'Em revisão';
      case 'paused': return 'Em pausa';
      case 'completed': return 'Concluído';
      default: return 'Concluído';
    }
  };

  const handleClientChange = (clientId: string) => {
    const selectedClient = mockClients.find(c => c.id === clientId);
    if (selectedClient) {
      const updates = { 
        clientId, 
        client: selectedClient 
      };
      setEditedProject(prev => ({ ...prev, ...updates }));
      onUpdate(updates);
    }
  };

  const handleStatusChange = (status: string) => {
    const updates = { status };
    setEditedProject(prev => ({ ...prev, ...updates }));
    onUpdate(updates);
  };

  const handleTeamChange = (teamString: string) => {
    const teamMembers = teamString.split(',').map(member => member.trim()).filter(Boolean);
    const updates = { teamMembers };
    setEditedProject(prev => ({ ...prev, ...updates }));
    onUpdate(updates);
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    const updates = { tags };
    setEditedProject(prev => ({ ...prev, ...updates }));
    onUpdate(updates);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const updates = { [field]: value };
    setEditedProject(prev => ({ ...prev, ...updates }));
    onUpdate(updates);
  };

  // Validação de datas
  const isDateInvalid = editedProject.startDate && editedProject.endDate && 
    new Date(editedProject.startDate) > new Date(editedProject.endDate);

  return (
    <div className="mb-12 pb-6 border-b border-gray-100">
      {/* Status Badge */}
      <div className="mb-6">
        {isEditing ? (
          <Select value={editedProject.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planejamento</SelectItem>
              <SelectItem value="in-progress">Em andamento</SelectItem>
              <SelectItem value="review">Em revisão</SelectItem>
              <SelectItem value="paused">Em pausa</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge className={`${getStatusColor(editedProject.status)} border-0`}>
            {getStatusText(editedProject.status)}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span className="font-medium">Cliente:</span>
          {isEditing ? (
            <Select value={editedProject.clientId} onValueChange={handleClientChange}>
              <SelectTrigger className="w-48 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span>{editedProject.client.name}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span className="font-medium">Responsável:</span>
          {isEditing ? (
            <Input
              value={editedProject.client.responsibleManager}
              onChange={(e) => {
                const updates = {
                  client: { ...editedProject.client, responsibleManager: e.target.value }
                };
                setEditedProject(prev => ({ ...prev, ...updates }));
                onUpdate(updates);
              }}
              className="w-48 h-8 text-sm"
            />
          ) : (
            <span>{editedProject.client.responsibleManager}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Início:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={editedProject.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-48 h-8 text-sm"
              />
              {isDateInvalid && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
          ) : (
            <span>{new Date(editedProject.startDate).toLocaleDateString('pt-BR')}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Entrega:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={editedProject.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-48 h-8 text-sm"
              />
              {isDateInvalid && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
          ) : (
            <span>{new Date(editedProject.endDate).toLocaleDateString('pt-BR')}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="font-medium">Equipe:</span>
          {isEditing ? (
            <Input
              value={editedProject.teamMembers.join(', ')}
              onChange={(e) => handleTeamChange(e.target.value)}
              placeholder="Nome1, Nome2, Nome3"
              className="w-48 h-8 text-sm"
            />
          ) : (
            <span>{editedProject.teamMembers.join(', ')}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Tag className="w-4 h-4" />
          <span className="font-medium">Tags:</span>
          {isEditing ? (
            <Input
              value={editedProject.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-48 h-8 text-sm"
            />
          ) : (
            <div className="flex gap-1">
              {editedProject.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {isDateInvalid && (
        <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>A data de início não pode ser posterior à data de entrega</span>
        </div>
      )}
    </div>
  );
};

export default ProjectMetaInfo;
