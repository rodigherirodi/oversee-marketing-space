
// Mantém compatibilidade com o código existente
import { 
  useClientsOptimized, 
  useCreateClient, 
  useUpdateClient, 
  useDeleteClient,
  useClientDetail,
  clientKeys 
} from './useClientsOptimized';
import { ClientDTO, ClientFormData } from '@/types/database';

// Re-exporta os tipos para compatibilidade
export type SupabaseClient = ClientDTO;

export { ClientFormData };

export const useSupabaseClients = () => {
  const { 
    data: clientsData, 
    isLoading: loading, 
    error, 
    refetch: fetchClients 
  } = useClientsOptimized();

  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();

  // Transform data to match existing interface
  const clients = clientsData?.data || [];

  const getClient = async (id: string): Promise<SupabaseClient | null> => {
    try {
      const client = clients.find(c => c.id === id);
      return client || null;
    } catch (error) {
      return null;
    }
  };

  const createClient = async (clientData: Omit<ClientFormData, 'criado_em'>): Promise<SupabaseClient | null> => {
    try {
      const result = await createClientMutation.mutateAsync(clientData);
      return result;
    } catch (error) {
      return null;
    }
  };

  const addClient = createClient; // Alias for compatibility

  const updateClient = async (id: string, updates: Partial<ClientFormData>): Promise<SupabaseClient | null> => {
    try {
      const result = await updateClientMutation.mutateAsync({ id, data: updates });
      return result;
    } catch (error) {
      return null;
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      await deleteClientMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    clients,
    loading,
    fetchClients,
    getClient,
    createClient,
    addClient,
    updateClient,
    deleteClient,
  };
};

export { useClientDetail, clientKeys };
