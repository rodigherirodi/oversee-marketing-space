
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TaskDTO } from '@/types/database';

interface TaskFilters {
  status?: TaskDTO['status'];
  assignedToMe?: boolean;
  overdue?: boolean;
}

export const useUserTasks = (filters: TaskFilters = {}) => {
  return useQuery({
    queryKey: ['user-tasks', filters],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('tarefas')
        .select(`
          id, titulo, descricao, status, prioridade, data_entrega,
          criado_em, atualizado_em, concluido_em, tags, squad, tipo,
          campos_customizados, cliente_id, responsavel,
          criado_por
        `);

      // Apply filters
      if (filters.assignedToMe) {
        query = query.eq('responsavel', user.id);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.overdue) {
        const today = new Date().toISOString().split('T')[0];
        query = query.lt('data_entrega', today);
      }

      query = query.order('data_entrega', { ascending: true });

      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map((task): TaskDTO => ({
        ...task,
        tags: task.tags || []
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOverdueTasks = () => {
  return useQuery({
    queryKey: ['overdue-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('tarefas')
        .select(`
          id, titulo, descricao, status, prioridade, data_entrega,
          criado_em, atualizado_em, concluido_em, tags, squad, tipo,
          campos_customizados, cliente_id, responsavel,
          criado_por
        `)
        .eq('responsavel', user.id)
        .lt('data_entrega', today)
        .neq('status', 'completed')
        .order('data_entrega', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map((task): TaskDTO => ({
        ...task,
        tags: task.tags || []
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTasksByStatus = (status: TaskDTO['status']) => {
  return useQuery({
    queryKey: ['tasks-by-status', status],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error } = await supabase
        .from('tarefas')
        .select(`
          id, titulo, descricao, status, prioridade, data_entrega,
          criado_em, atualizado_em, concluido_em, tags, squad, tipo,
          campos_customizados, cliente_id, responsavel,
          criado_por
        `)
        .eq('responsavel', user.id)
        .eq('status', status)
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map((task): TaskDTO => ({
        ...task,
        tags: task.tags || []
      }));
    },
    enabled: !!status,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
