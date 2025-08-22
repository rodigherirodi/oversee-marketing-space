
// Mantém compatibilidade com o código existente
import { 
  useProjectsOptimized, 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject,
  useProjectDetail,
  projectKeys 
} from './useProjectsOptimized';
import { useClientsOptimized } from './useClientsOptimized';
import { useProfiles } from './useProfiles';
import { ProjectDTO, ProjectFormData } from '@/types/database';

// Re-exporta os tipos para compatibilidade
export type SupabaseProject = ProjectDTO;

export interface ProfileOption {
  id: string;
  name: string;
}

export interface ClientOption {
  id: string;
  nome: string;
}

export const useSupabaseProjects = () => {
  const { 
    data: projectsData, 
    isLoading: loading, 
    error, 
    refetch 
  } = useProjectsOptimized();

  const { data: clientsData } = useClientsOptimized();
  const { profiles: profilesData } = useProfiles();

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Transform data to match existing interface
  const projects = projectsData?.data || [];
  const clients = clientsData?.data?.map(client => ({ id: client.id, nome: client.nome })) || [];
  const profiles = profilesData?.map(profile => ({ id: profile.id, name: profile.name })) || [];

  const createProject = async (projectData: Partial<ProjectFormData>): Promise<SupabaseProject | undefined> => {
    try {
      const result = await createProjectMutation.mutateAsync(projectData as ProjectFormData);
      return result;
    } catch (error) {
      return undefined;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<ProjectFormData>): Promise<SupabaseProject | undefined> => {
    try {
      const result = await updateProjectMutation.mutateAsync({ id: projectId, updates });
      return result;
    } catch (error) {
      return undefined;
    }
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      await deleteProjectMutation.mutateAsync(projectId);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getProjectById = (id: string): SupabaseProject | undefined => {
    return projects.find(project => project.id === id);
  };

  const getProjectsByClientId = (clientId: string): SupabaseProject[] => {
    return projects.filter(project => project.cliente_id === clientId);
  };

  return {
    projects,
    profiles,
    clients,
    loading,
    error: error?.message || null,
    refetch,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByClientId
  };
};

export { useProjectDetail, projectKeys };
