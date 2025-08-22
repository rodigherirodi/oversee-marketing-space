
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectsOptimized } from '@/hooks/useProjectsOptimized';
import { Loader2 } from 'lucide-react';

interface ProjectSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  clientId?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  value,
  onValueChange,
  clientId,
  placeholder = "Selecione um projeto",
  disabled = false,
}) => {
  const filters = clientId ? { cliente_id: clientId } : {};
  const { data: projectsData, isLoading } = useProjectsOptimized(filters, { page: 1, limit: 100 });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2 border rounded-md">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando projetos...</span>
      </div>
    );
  }

  const projects = projectsData?.data || [];

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.titulo}
            {project.cliente_nome && (
              <span className="text-xs text-muted-foreground ml-2">
                - {project.cliente_nome}
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
