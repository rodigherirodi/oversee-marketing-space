
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TaskDTO, TaskFormData, TaskFilters, PaginationOptions } from '@/types/database';

// Query keys factory
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters, pagination: PaginationOptions) => 
    [...taskKeys.lists(), filters, pagination] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export const useTasksOptimized = (
  filters: TaskFilters = {}, 
  pagination: PaginationOptions = { page: 1, limit: 50 }
) => {
  const { toast } = useToast();

  const fetchTasks = async (): Promise<{ data: TaskDTO[], count: number }> => {
    let query = supabase
      .from('tarefas')
      .select(`
        id, titulo, descricao, status, prioridade, data_entrega,
        criado_em, atualizado_em, concluido_em, tags, squad, tipo,
        campos_customizados, projeto_id, cliente_id, responsavel,
        projetos:projeto_id(titulo, status),
        clientes:cliente_id(nome, status),
        profiles:responsavel(name, avatar_url, department)
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
    if (filters.projeto_id) {
      query = query.eq('projeto_id', filters.projeto_id);
    }
    if (filters.responsavel) {
      query = query.eq('responsavel', filters.responsavel);
    }
    if (filters.search) {
      query = query.or(`titulo.ilike.%${filters.search}%,descricao.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    // Order by updated_at desc
    query = query.order('atualizado_em', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform data to match TaskDTO interface
    const transformedData: TaskDTO[] = (data || []).map(task => ({
      ...task,
      projeto_nome: task.projetos?.titulo,
      projeto_status: task.projetos?.status,
      cliente_nome: task.clientes?.nome,
      cliente_status: task.clientes?.status,
      responsavel_nome: task.profiles?.name,
      responsavel_avatar: task.profiles?.avatar_url,
      responsavel_department: task.profiles?.department,
    }));

    return { data: transformedData, count: count || 0 };
  };

  return useQuery({
    queryKey: taskKeys.list(filters, pagination),
    queryFn: fetchTasks,
    staleTime: 30000, // 30 seconds
  });
};

export const useTaskDetail = (id: string) => {
  const fetchTask = async (): Promise<TaskDTO> => {
    const { data, error } = await supabase
      .from('tarefas')
      .select(`
        id, titulo, descricao, status, prioridade, data_entrega,
        criado_em, atualizado_em, concluido_em, tags, squad, tipo,
        campos_customizados, projeto_id, cliente_id, responsavel,
        projetos:projeto_id(titulo, status),
        clientes:cliente_id(nome, status),
        profiles:responsavel(name, avatar_url, department)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      projeto_nome: data.projetos?.titulo,
      projeto_status: data.projetos?.status,
      cliente_nome: data.clientes?.nome,
      cliente_status: data.clientes?.status,
      responsavel_nome: data.profiles?.name,
      responsavel_avatar: data.profiles?.avatar_url,
      responsavel_department: data.profiles?.department,
    };
  };

  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: fetchTask,
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: TaskFormData): Promise<TaskDTO> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const taskData = {
        titulo: data.titulo,
        descricao: data.descricao,
        status: data.status,
        prioridade: data.prioridade,
        data_entrega: data.data_entrega?.toISOString().split('T')[0],
        projeto_id: data.projeto_id,
        cliente_id: data.cliente_id,
        responsavel: data.responsavel,
        squad: data.squad,
        tipo: data.tipo,
        tags: data.tags,
        criado_por: user.id,
      };

      const { data: result, error } = await supabase
        .from('tarefas')
        .insert(taskData)
        .select(`
          id, titulo, descricao, status, prioridade, data_entrega,
          criado_em, atualizado_em, concluido_em, tags, squad, tipo,
          campos_customizados, projeto_id, cliente_id, responsavel
        `)
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (newTask) => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      
      // Add to cache optimistically
      queryClient.setQueryData(taskKeys.detail(newTask.id), newTask);

      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar tarefa: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TaskFormData> }): Promise<TaskDTO> => {
      const updateData: any = {};
      
      if (data.titulo !== undefined) updateData.titulo = data.titulo;
      if (data.descricao !== undefined) updateData.descricao = data.descricao;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.prioridade !== undefined) updateData.prioridade = data.prioridade;
      if (data.data_entrega !== undefined) {
        updateData.data_entrega = data.data_entrega?.toISOString().split('T')[0];
      }
      if (data.projeto_id !== undefined) updateData.projeto_id = data.projeto_id;
      if (data.cliente_id !== undefined) updateData.cliente_id = data.cliente_id;
      if (data.responsavel !== undefined) updateData.responsavel = data.responsavel;
      if (data.squad !== undefined) updateData.squad = data.squad;
      if (data.tipo !== undefined) updateData.tipo = data.tipo;
      if (data.tags !== undefined) updateData.tags = data.tags;

      const { data: result, error } = await supabase
        .from('tarefas')
        .update(updateData)
        .eq('id', id)
        .select(`
          id, titulo, descricao, status, prioridade, data_entrega,
          criado_em, atualizado_em, concluido_em, tags, squad, tipo,
          campos_customizados, projeto_id, cliente_id, responsavel
        `)
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (updatedTask) => {
      // Update cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      
      // Invalidate lists to refetch with updated data
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });

      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar tarefa: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });

      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir tarefa: " + error.message,
        variant: "destructive",
      });
    },
  });
};
