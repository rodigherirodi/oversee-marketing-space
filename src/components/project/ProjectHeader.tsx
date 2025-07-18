
import React from 'react';
import { ArrowLeft, Edit3, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/entities';

interface ProjectHeaderProps {
  project: Project;
  isEditing: boolean;
  onToggleEdit: () => void;
}

const ProjectHeader = ({ project, isEditing, onToggleEdit }: ProjectHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/projects');
  };

  return (
    <>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
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
      </div>
    </>
  );
};

export default ProjectHeader;
