
import React, { useState } from 'react';
import { ArrowLeft, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/entities';

interface ProjectHeaderProps {
  project: Project;
  isEditing: boolean;
  onToggleEdit: () => void;
}

const ProjectHeader = ({ project, isEditing, onToggleEdit }: ProjectHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-green-100 text-green-700';
      case 'planning': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'paused': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'Em andamento';
      case 'planning': return 'Planejamento';
      case 'review': return 'Em revisão';
      case 'paused': return 'Em pausa';
      default: return 'Concluído';
    }
  };

  return (
    <>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleEdit}
          className="text-gray-500 hover:text-gray-700"
        >
          {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      {/* Project Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
          {project.name}
        </h1>
        <Badge className={`${getStatusColor(project.status)} border-0`}>
          {getStatusText(project.status)}
        </Badge>
      </div>
    </>
  );
};

export default ProjectHeader;
