
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClientDTO, ClientFormData, ClientFilters, PaginationOptions } from '@/types/database';

// Query keys factory
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: ClientFilters, pagination: PaginationOptions) => 
    [...clientKeys.lists(), filters, pagination] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  options: () => [...clientKeys.all, 'options'] as const,
};

export const useClientsOptimized = (
  filters: ClientFilters = {}, 
  pagination: PaginationOptions = { page: 1, limit: 50 }
) => {
  const { toast } = useToast();

  const fetchClients = async (): Promise<{ data: ClientDTO[], count: number }> => {
    let query = supabase
      .from('clientes')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.porte) {
      query = query.eq('porte', filters.porte);
    }
    if (filters.temperatura) {
      query = query.eq('temperatura', filters.temperatura);
    }
    if (filters.search) {
      query = query.or(`nome.ilike.%${filters.search}%,segmento.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    // Order by nome
    query = query.order('nome', { ascending: true });

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: data || [], count: count || 0 };
  };

  return useQuery({
    queryKey: clientKeys.list(filters, pagination),
    queryFn: fetchClients,
    staleTime: 60000, // 1 minute - clients don't change as often
  });
};

export const useClientDetail = (id: string) => {
  const fetchClient = async (): Promise<ClientDTO> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  };

  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: fetchClient,
    enabled: !!id,
  });
};

export const useClientOptions = () => {
  const fetchClientOptions = async (): Promise<{ id: string; nome: string }[]> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nome')
      .eq('status', 'ativo')
      .order('nome');

    if (error) throw error;
    return data || [];
  };

  return useQuery({
    queryKey: clientKeys.options(),
    queryFn: fetchClientOptions,
    staleTime: 300000, // 5 minutes
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ClientFormData): Promise<ClientDTO> => {
      const { data: result, error } = await supabase
        .from('clientes')
        .insert(data)
        .select('*')
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.options() });
      queryClient.setQueryData(clientKeys.detail(newClient.id), newClient);

      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar cliente: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClientFormData> }): Promise<ClientDTO> => {
      const { data: result, error } = await supabase
        .from('clientes')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (updatedClient) => {
      queryClient.setQueryData(clientKeys.detail(updatedClient.id), updatedClient);
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.options() });

      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Check dependencies first
      const { data: deps } = await supabase.rpc('check_client_dependencies', {
        client_uuid: id
      });

      if (deps && (deps.has_projects || deps.has_tasks)) {
        const messages = [];
        if (deps.has_projects) {
          messages.push(`${deps.project_count} projeto(s)`);
        }
        if (deps.has_tasks) {
          messages.push(`${deps.task_count} tarefa(s)`);
        }
        throw new Error(`Não é possível excluir o cliente. Existem ${messages.join(' e ')} vinculadas a ele.`);
      }

      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: clientKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.options() });

      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso!",
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
