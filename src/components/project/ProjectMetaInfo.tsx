
import React, { useState } from 'react';
import { Calendar, User, Users, Tag, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupabaseProject, ProfileOption } from '@/hooks/useSupabaseProjects';

interface ProjectMetaInfoProps {
  project: SupabaseProject;
  isEditing: boolean;
  onUpdate: (updates: Partial<SupabaseProject>) => void;
  profiles: ProfileOption[];
}

const ProjectMetaInfo = ({ project, isEditing, onUpdate, profiles }: ProjectMetaInfoProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_andamento': return 'bg-blue-100 text-blue-700';
      case 'planejamento': return 'bg-gray-100 text-gray-700';
      case 'em_revisao': return 'bg-purple-100 text-purple-700';
      case 'em_pausa': return 'bg-orange-100 text-orange-700';
      case 'concluido': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'em_andamento': return 'Em andamento';
      case 'planejamento': return 'Planejamento';
      case 'em_revisao': return 'Em revisão';
      case 'em_pausa': return 'Em pausa';
      case 'concluido': return 'Concluído';
      default: return 'Concluído';
    }
  };

  const handleStatusChange = (status: 'planejamento' | 'em_andamento' | 'em_revisao' | 'concluido' | 'em_pausa') => {
    onUpdate({ status });
  };

  const handleTeamChange = (teamString: string) => {
    onUpdate({ equipe: teamString });
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    onUpdate({ tags });
  };

  const handleDateChange = (field: 'data_inicio' | 'data_entrega', value: string) => {
    onUpdate({ [field]: value });
  };

  const handleResponsibleChange = (responsibleName: string) => {
    onUpdate({ responsavel: responsibleName });
  };

  const handleProgressChange = (progress: number) => {
    if (progress >= 0 && progress <= 100) {
      onUpdate({ progresso: progress });
    }
  };

  const handlePriorityChange = (priority: 'Alta' | 'Média' | 'Baixa') => {
    onUpdate({ prioridade: priority });
  };

  // Validação de datas
  const isDateInvalid = project.data_inicio && project.data_entrega && 
    new Date(project.data_inicio) > new Date(project.data_entrega);

  return (
    <div className="mb-12 pb-6 border-b border-gray-100">
      {/* Status Badge */}
      <div className="mb-6">
        {isEditing ? (
          <Select value={project.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planejamento">Planejamento</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="em_revisao">Em revisão</SelectItem>
              <SelectItem value="em_pausa">Em pausa</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge className={`${getStatusColor(project.status)} border-0`}>
            {getStatusText(project.status)}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span className="font-medium">Cliente:</span>
          {isEditing ? (
            <Input
              value={project.cliente || ''}
              onChange={(e) => onUpdate({ cliente: e.target.value })}
              className="w-48 h-8 text-sm"
              placeholder="Nome do cliente"
            />
          ) : (
            <span>{project.cliente || 'Não informado'}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span className="font-medium">Responsável:</span>
          {isEditing ? (
            <Select value={project.responsavel || ''} onValueChange={handleResponsibleChange}>
              <SelectTrigger className="w-48 h-8 text-sm">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map(profile => (
                  <SelectItem key={profile.id} value={profile.name}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span>{project.responsavel || 'Não definido'}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Tag className="w-4 h-4" />
          <span className="font-medium">Prioridade:</span>
          {isEditing ? (
            <Select value={project.prioridade || 'Média'} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-48 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span>{project.prioridade || 'Não definido'}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Início:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={project.data_inicio || ''}
                onChange={(e) => handleDateChange('data_inicio', e.target.value)}
                className="w-48 h-8 text-sm"
              />
              {isDateInvalid && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
          ) : (
            <span>
              {project.data_inicio ? new Date(project.data_inicio).toLocaleDateString('pt-BR') : 'Não definido'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Entrega:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={project.data_entrega || ''}
                onChange={(e) => handleDateChange('data_entrega', e.target.value)}
                className="w-48 h-8 text-sm"
              />
              {isDateInvalid && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
          ) : (
            <span>
              {project.data_entrega ? new Date(project.data_entrega).toLocaleDateString('pt-BR') : 'Não definido'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Tag className="w-4 h-4" />
          <span className="font-medium">Progresso:</span>
          {isEditing ? (
            <Input
              type="number"
              min="0"
              max="100"
              value={project.progresso}
              onChange={(e) => handleProgressChange(parseInt(e.target.value) || 0)}
              className="w-20 h-8 text-sm"
            />
          ) : (
            <span>{project.progresso}%</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="font-medium">Equipe:</span>
          {isEditing ? (
            <Input
              value={project.equipe || ''}
              onChange={(e) => handleTeamChange(e.target.value)}
              placeholder="Nome1, Nome2, Nome3"
              className="w-48 h-8 text-sm"
            />
          ) : (
            <span>{project.equipe || 'Não definido'}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Tag className="w-4 h-4" />
          <span className="font-medium">Tags:</span>
          {isEditing ? (
            <Input
              value={project.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-48 h-8 text-sm"
            />
          ) : (
            <div className="flex gap-1">
              {project.tags?.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              )) || <span>Nenhuma tag</span>}
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
