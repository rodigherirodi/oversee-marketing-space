
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  client_id: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      // Mock data until database is properly set up
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Sistema de Gestão',
          description: 'Desenvolvimento de sistema interno de gestão',
          status: 'active',
          client_id: 'client1',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-31T00:00:00Z'
        },
        {
          id: '2',
          name: 'Website Corporativo',
          description: 'Criação do novo website da empresa',
          status: 'active',
          client_id: 'client2',
          created_at: '2025-01-15T00:00:00Z',
          updated_at: '2025-01-31T00:00:00Z'
        }
      ];

      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | undefined> => {
    try {
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProjects(prev => [...prev, newProject]);
      toast.success('Projeto criado com sucesso');
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Erro ao criar projeto');
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    addProject,
    refetch: fetchProjects
  };
};
