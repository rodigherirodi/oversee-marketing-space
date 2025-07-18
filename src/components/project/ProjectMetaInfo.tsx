
import React, { useState } from 'react';
import { Calendar, User, Users, Tag } from 'lucide-react';
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

  return (
    <div className="mb-12 pb-6 border-b border-gray-100">
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
            <Input
              type="date"
              value={editedProject.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-48 h-8 text-sm"
            />
          ) : (
            <span>{new Date(editedProject.startDate).toLocaleDateString('pt-BR')}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Entrega:</span>
          {isEditing ? (
            <Input
              type="date"
              value={editedProject.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-48 h-8 text-sm"
            />
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
    </div>
  );
};

export default ProjectMetaInfo;
