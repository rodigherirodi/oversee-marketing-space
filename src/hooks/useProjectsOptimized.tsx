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
};

export const useProjectsOptimized = (
  filters: ProjectFilters = {}, 
  pagination: PaginationOptions = { page: 1, limit: 50 }
) => {
  const { toast } = useToast();

  const fetchProjects = async (): Promise<{ data: ProjectDTO[], count: number }> => {
    // Use the base table instead of the view for now
    let query = supabase
      .from('projetos')
      .select(`
        id, titulo, cliente, cliente_id, status, prioridade, 
        data_inicio, data_entrega, progresso, equipe, tags, 
        responsavel, briefing, escopo, observacoes, materiais,
        criado_em, atualizado_em,
        clientes:cliente_id(id, nome, status, segmento)
      `, { count: 'exact' });

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

    // Order by updated_at desc
    query = query.order('atualizado_em', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform data to match ProjectDTO interface
    const transformedData = data?.map(project => ({
      ...project,
      cliente_nome: project.clientes?.nome,
      cliente_status: project.clientes?.status,
      cliente_segmento: project.clientes?.segmento,
      total_tarefas: 0, // Will be calculated separately if needed
      tarefas_concluidas: 0,
      tarefas_em_andamento: 0,
    })) || [];

    return { data: transformedData, count: count || 0 };
  };

  return useQuery({
    queryKey: projectKeys.list(filters, pagination),
    queryFn: fetchProjects,
    staleTime: 30000, // 30 seconds
  });
};

export const useProjectDetail = (id: string) => {
  const fetchProject = async (): Promise<ProjectDTO> => {
    const { data, error } = await supabase
      .from('projetos')
      .select(`
        id, titulo, cliente, cliente_id, status, prioridade, 
        data_inicio, data_entrega, progresso, equipe, tags, 
        responsavel, briefing, escopo, observacoes, materiais,
        criado_em, atualizado_em,
        clientes:cliente_id(id, nome, status, segmento)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    const transformedData: ProjectDTO = {
      ...data,
      cliente_nome: data.clientes?.nome,
      cliente_status: data.clientes?.status,
      cliente_segmento: data.clientes?.segmento,
      total_tarefas: 0, // Will be calculated separately if needed
      tarefas_concluidas: 0,
      tarefas_em_andamento: 0,
    };

    return transformedData;
  };

  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: fetchProject,
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ProjectFormData): Promise<ProjectDTO> => {
      const { data: result, error } = await supabase
        .from('projetos')
        .insert(data)
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
      const { data: result, error } = await supabase
        .from('projetos')
        .update(data)
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
      const { data: deps, error: depsError } = await supabase
        .rpc('check_project_dependencies', {
          project_uuid: id
        });

      if (depsError) throw depsError;

      if (deps && deps.length > 0) {
        const dependency = deps[0];
        if (dependency.has_tasks) {
          throw new Error(`Não é possível excluir o projeto. Existem ${dependency.task_count} tarefa(s) vinculadas a ele.`);
        }
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
