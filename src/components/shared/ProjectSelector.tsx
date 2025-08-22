
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectsOptimized } from '@/hooks/useProjectsOptimized';
import { Loader2 } from 'lucide-react';

interface ProjectSelectorProps {
  clientId?: string;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  clientId,
  value,
  onValueChange,
  placeholder = "Selecione um projeto",
  disabled = false,
}) => {
  const { data: projectsData, isLoading } = useProjectsOptimized({ 
    clientId: clientId || undefined 
  });

  const projects = projectsData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2 border rounded-md">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando projetos...</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || !clientId}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.titulo}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
