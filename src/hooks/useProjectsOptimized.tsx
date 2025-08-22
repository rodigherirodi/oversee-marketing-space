
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectDTO, ProjectFormData, ProjectFilters, PaginationOptions } from '@/types/database';

// Query keys factory
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectFilters, pagination: PaginationOptions) => 
    [...projectKeys.lists(), filters, pagination] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  byClient: (clientId: string) => [...projectKeys.all, 'byClient', clientId] as const,
};

export const useProjectsOptimized = (
  filters: ProjectFilters = {}, 
  pagination: PaginationOptions = { page: 1, limit: 50 }
) => {
  const { toast } = useToast();

  const fetchProjects = async (): Promise<{ data: ProjectDTO[], count: number }> => {
    let query = supabase
      .from('v_projetos_completos')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.prioridade) {
      query = query.eq('prioridade', filters.prioridade);
    }
    if (filters.cliente_id) {
      query = query.eq('cliente_id', filters.cliente_id);
    }
    if (filters.search) {
      query = query.or(`titulo.ilike.%${filters.search}%,briefing.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    // Order by data_entrega, then updated_at
    query = query.order('data_entrega', { ascending: true, nullsLast: true })
                   .order('atualizado_em', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: data || [], count: count || 0 };
  };

  return useQuery({
    queryKey: projectKeys.list(filters, pagination),
    queryFn: fetchProjects,
    staleTime: 30000,
  });
};

export const useProjectDetail = (id: string) => {
  const fetchProject = async (): Promise<ProjectDTO> => {
    const { data, error } = await supabase
      .from('v_projetos_completos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  };

  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: fetchProject,
    enabled: !!id,
  });
};

export const useProjectsByClient = (clientId: string) => {
  const fetchProjectsByClient = async (): Promise<ProjectDTO[]> => {
    const { data, error } = await supabase
      .from('v_projetos_completos')
      .select('*')
      .eq('cliente_id', clientId)
      .order('atualizado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  return useQuery({
    queryKey: projectKeys.byClient(clientId),
    queryFn: fetchProjectsByClient,
    enabled: !!clientId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ProjectFormData): Promise<ProjectDTO> => {
      const projectData = {
        titulo: data.titulo,
        cliente_id: data.cliente_id,
        status: data.status,
        prioridade: data.prioridade,
        data_inicio: data.data_inicio?.toISOString().split('T')[0],
        data_entrega: data.data_entrega?.toISOString().split('T')[0],
        progresso: data.progresso,
        equipe: data.equipe,
        responsavel: data.responsavel,
        briefing: data.briefing,
        escopo: data.escopo,
        observacoes: data.observacoes,
      };

      const { data: result, error } = await supabase
        .from('projetos')
        .insert(projectData)
        .select(`
          id, titulo, cliente, cliente_id, status, prioridade,
          data_inicio, data_entrega, progresso, equipe, tags,
          responsavel, briefing, escopo, observacoes, materiais,
          criado_em, atualizado_em
        `)
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      
      if (newProject.cliente_id) {
        queryClient.invalidateQueries({ 
          queryKey: projectKeys.byClient(newProject.cliente_id) 
        });
      }
      
      queryClient.setQueryData(projectKeys.detail(newProject.id), newProject);

      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar projeto: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectFormData> }): Promise<ProjectDTO> => {
      const updateData: any = {};
      
      if (data.titulo !== undefined) updateData.titulo = data.titulo;
      if (data.cliente_id !== undefined) updateData.cliente_id = data.cliente_id;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.prioridade !== undefined) updateData.prioridade = data.prioridade;
      if (data.data_inicio !== undefined) {
        updateData.data_inicio = data.data_inicio?.toISOString().split('T')[0];
      }
      if (data.data_entrega !== undefined) {
        updateData.data_entrega = data.data_entrega?.toISOString().split('T')[0];
      }
      if (data.progresso !== undefined) updateData.progresso = data.progresso;
      if (data.equipe !== undefined) updateData.equipe = data.equipe;
      if (data.responsavel !== undefined) updateData.responsavel = data.responsavel;
      if (data.briefing !== undefined) updateData.briefing = data.briefing;
      if (data.escopo !== undefined) updateData.escopo = data.escopo;
      if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;

      const { data: result, error } = await supabase
        .from('projetos')
        .update(updateData)
        .eq('id', id)
        .select(`
          id, titulo, cliente, cliente_id, status, prioridade,
          data_inicio, data_entrega, progresso, equipe, tags,
          responsavel, briefing, escopo, observacoes, materiais,
          criado_em, atualizado_em
        `)
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      
      if (updatedProject.cliente_id) {
        queryClient.invalidateQueries({ 
          queryKey: projectKeys.byClient(updatedProject.cliente_id) 
        });
      }

      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Check dependencies first
      const { data: deps } = await supabase.rpc('check_project_dependencies', {
        project_uuid: id
      });

      if (deps && deps.has_tasks) {
        throw new Error(`Não é possível excluir o projeto. Existem ${deps.task_count} tarefas vinculadas a ele.`);
      }

      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
