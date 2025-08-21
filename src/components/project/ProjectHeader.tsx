
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseProjects, type SupabaseProject } from '@/hooks/useSupabaseProjects';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProjectHeaderProps {
  project: SupabaseProject;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate?: (updates: Partial<SupabaseProject>) => void;
}

const ProjectHeader = ({ project, isEditing, onToggleEdit, onUpdate }: ProjectHeaderProps) => {
  const navigate = useNavigate();
  const { deleteProject } = useSupabaseProjects();

  const handleDelete = async () => {
    const success = await deleteProject(project.id);
    if (success) {
      navigate('/projects');
    }
  };

  return (
    <div className="border-b border-gray-200 pb-8 mb-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={project.titulo}
              onChange={(e) => {
                console.log('Title changed to:', e.target.value);
                onUpdate?.({ titulo: e.target.value });
              }}
              className="text-3xl font-bold border-0 shadow-none focus:ring-0 p-0 h-auto bg-transparent"
              placeholder="Título do projeto"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{project.titulo}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleEdit}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir projeto</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o projeto "{project.titulo}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
