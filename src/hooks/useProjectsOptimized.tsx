
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDTO, ProjectFormData } from '@/types/database';
import { toast } from 'sonner';

interface ProjectsQueryOptions {
  clientId?: string;
  status?: ProjectDTO['status'][];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

const buildProjectsQueryKey = (options: ProjectsQueryOptions) => {
  const { clientId, status, search, sortBy, sortOrder, page, limit } = options;
  return ['projects', { clientId, status, search, sortBy, sortOrder, page, limit }];
};

export const useProjectsOptimized = (options: ProjectsQueryOptions = {}) => {
  const queryKey = buildProjectsQueryKey(options);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log('Fetching projects with options:', options);
      
      let query = supabase
        .from('projetos')
        .select(`
          *,
          clientes:cliente_id (
            id,
            nome,
            status,
            segmento
          )
        `);

      // Apply filters
      if (options.clientId) {
        query = query.eq('cliente_id', options.clientId);
      }

      if (options.status && options.status.length > 0) {
        query = query.in('status', options.status);
      }

      if (options.search) {
        query = query.or(`titulo.ilike.%${options.search}%,cliente.ilike.%${options.search}%`);
      }

      // Apply sorting
      if (options.sortBy) {
        const ascending = options.sortOrder === 'asc';
        query = query.order(options.sortBy, { ascending });
      } else {
        query = query.order('criado_em', { ascending: false });
      }

      // Apply pagination
      if (options.page !== undefined && options.limit !== undefined) {
        const from = options.page * options.limit;
        const to = from + options.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      // Transform the data to ensure proper typing
      const projects: ProjectDTO[] = (data || []).map(project => ({
        ...project,
        status: project.status as ProjectDTO['status'],
        prioridade: project.prioridade as ProjectDTO['prioridade']
      }));

      console.log('Projects fetched:', projects);

      return {
        data: projects,
        count: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

export const useProjectOptimized = (id: string | undefined) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('projetos')
        .select(`
          *,
          clientes:cliente_id (
            id,
            nome,
            status,
            segmento
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        throw error;
      }

      return {
        ...data,
        status: data.status as ProjectDTO['status'],
        prioridade: data.prioridade as ProjectDTO['prioridade']
      } as ProjectDTO;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: ProjectFormData) => {
      const insertData = {
        titulo: projectData.titulo,
        cliente_id: projectData.cliente_id,
        status: projectData.status,
        prioridade: projectData.prioridade,
        data_inicio: projectData.data_inicio?.toISOString().split('T')[0],
        data_entrega: projectData.data_entrega?.toISOString().split('T')[0],
        progresso: projectData.progresso,
        equipe: projectData.equipe,
        responsavel: projectData.responsavel,
        briefing: projectData.briefing,
        escopo: projectData.escopo,
        observacoes: projectData.observacoes,
      };

      const { data, error } = await supabase
        .from('projetos')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data as ProjectDTO;
    },
    onSuccess: (newProject) => {
      // Invalidate all project queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // Optimistically update queries
      queryClient.setQueriesData(
        { queryKey: ['projects'] },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: [newProject, ...old.data],
            count: (old.count || 0) + 1,
          };
        }
      );

      toast.success('Projeto criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast.error('Erro ao criar projeto');
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProjectFormData> }) => {
      const updateData: any = {};
      
      if (updates.titulo !== undefined) updateData.titulo = updates.titulo;
      if (updates.cliente_id !== undefined) updateData.cliente_id = updates.cliente_id;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.prioridade !== undefined) updateData.prioridade = updates.prioridade;
      if (updates.data_inicio !== undefined) {
        updateData.data_inicio = updates.data_inicio?.toISOString().split('T')[0];
      }
      if (updates.data_entrega !== undefined) {
        updateData.data_entrega = updates.data_entrega?.toISOString().split('T')[0];
      }
      if (updates.progresso !== undefined) updateData.progresso = updates.progresso;
      if (updates.equipe !== undefined) updateData.equipe = updates.equipe;
      if (updates.responsavel !== undefined) updateData.responsavel = updates.responsavel;
      if (updates.briefing !== undefined) updateData.briefing = updates.briefing;
      if (updates.escopo !== undefined) updateData.escopo = updates.escopo;
      if (updates.observacoes !== undefined) updateData.observacoes = updates.observacoes;

      const { data, error } = await supabase
        .from('projetos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ProjectDTO;
    },
    onSuccess: (updatedProject) => {
      // Invalidate all project queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });

      // Optimistically update queries
      queryClient.setQueryData(['projects', updatedProject.id], updatedProject);

      toast.success('Projeto atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast.error('Erro ao atualizar projeto');
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, projectId) => {
      // Invalidate all project queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });

      // Optimistically update queries
      queryClient.setQueriesData(
        { queryKey: ['projects'] },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((project: ProjectDTO) => project.id !== projectId),
            count: (old.count || 0) - 1,
          };
        }
      );

      toast.success('Projeto excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast.error('Erro ao excluir projeto');
    },
  });
};

// Export for compatibility
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: any) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

export const useProjectDetail = useProjectOptimized;
