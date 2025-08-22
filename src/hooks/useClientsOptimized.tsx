import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientDTO } from '@/types/database';
import { toast } from 'sonner';

export interface ClientsQueryOptions {
  search?: string;
  status?: string[];
  segmento?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

const buildClientsQueryKey = (options: ClientsQueryOptions) => {
  const { search, status, segmento, sortBy, sortOrder, page, limit } = options;
  return ['clients', { search, status, segmento, sortBy, sortOrder, page, limit }];
};

export const useClientsOptimized = (options: ClientsQueryOptions = {}) => {
  const queryKey = buildClientsQueryKey(options);

  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('clientes')
        .select('*', { count: 'exact' });

      // Apply filters
      if (options.status && options.status.length > 0) {
        query = query.in('status', options.status);
      }

      if (options.segmento && options.segmento.length > 0) {
        query = query.in('segmento', options.segmento);
      }

      if (options.search) {
        query = query.or(`nome.ilike.%${options.search}%,email.ilike.%${options.search}%`);
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
        console.error('Error fetching clients:', error);
        throw error;
      }

      return {
        data: data as ClientDTO[],
        count: count || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

export const useClientOptimized = (id: string | null) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        throw error;
      }

      return data as ClientDTO;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: Omit<ClientDTO, 'id' | 'criado_em' | 'atualizado_em'>) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert(clientData)
        .select()
        .single();

      if (error) throw error;
      return data as ClientDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating client:', error);
      toast.error('Erro ao criar cliente');
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ClientDTO> }) => {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ClientDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast.error('Erro ao atualizar cliente');
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ClientDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
    },
  });
};

export const useCheckClientDependencies = (clientId: string | null) => {
  return useQuery({
    queryKey: ['client-dependencies', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      
      // Use a direct query instead of RPC call
      const [projectsResult, tasksResult] = await Promise.all([
        supabase
          .from('projetos')
          .select('id')
          .eq('cliente_id', clientId),
        supabase
          .from('tarefas')
          .select('id')
          .eq('cliente_id', clientId)
      ]);

      if (projectsResult.error) throw projectsResult.error;
      if (tasksResult.error) throw tasksResult.error;

      const projectCount = projectsResult.data?.length || 0;
      const taskCount = tasksResult.data?.length || 0;

      return {
        has_projects: projectCount > 0,
        has_tasks: taskCount > 0,
        project_count: projectCount,
        task_count: taskCount,
      };
    },
    enabled: !!clientId,
  });
};
