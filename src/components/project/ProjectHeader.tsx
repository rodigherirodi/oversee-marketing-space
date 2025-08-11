
import React from 'react';
import { ArrowLeft, Edit3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { SupabaseProject } from '@/hooks/useSupabaseProjects';

interface ProjectHeaderProps {
  project: SupabaseProject;
  isEditing: boolean;
  onToggleEdit: () => void;
}

const ProjectHeader = ({ project, isEditing, onToggleEdit }: ProjectHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/projects')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Projetos
        </Button>
      </div>

      <div className="flex-1 mx-8">
        {isEditing ? (
          <Input
            value={project.titulo}
            onChange={(e) => {
              // This would need to be handled by the parent component
              // For now, we'll just display it as read-only in edit mode
            }}
            className="text-2xl font-bold border-none px-0 focus:ring-0 focus:border-none"
            placeholder="Título do projeto"
          />
        ) : (
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {project.titulo}
          </h1>
        )}
      </div>

      <Button
        variant={isEditing ? "ghost" : "outline"}
        size="sm"
        onClick={onToggleEdit}
        className={isEditing ? "text-gray-600" : ""}
      >
        {isEditing ? (
          <>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </>
        ) : (
          <>
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </>
        )}
      </Button>
    </div>
  );
};

export default ProjectHeader;
