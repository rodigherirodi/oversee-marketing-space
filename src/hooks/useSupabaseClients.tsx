
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseClient {
  id: string;
  nome: string;
  segmento?: string;
  descricao?: string;
  porte?: 'micro' | 'pequeno' | 'medio' | 'grande';
  status?: 'ativo' | 'inativo' | 'prospect';
  temperatura?: 'frio' | 'morno' | 'quente';
  tipo_contrato?: 'recorrente' | 'projeto_unico' | 'pontual';
  gestor_id?: string;
  cliente_desde?: string;
  nps_atual?: number;
  endereco?: string;
  cidade?: string;
  uf?: string;
  site?: string;
  redes_sociais?: any;
  logo_url?: string;
  tags?: string[];
  criado_em: string;
}

export interface ClientFormData {
  nome: string;
  segmento?: string;
  descricao?: string;
  porte?: 'micro' | 'pequeno' | 'medio' | 'grande';
  status?: 'ativo' | 'inativo' | 'prospect';
  temperatura?: 'frio' | 'morno' | 'quente';
  tipo_contrato?: 'recorrente' | 'projeto_unico' | 'pontual';
  gestor_id?: string;
  cliente_desde?: string;
  nps_atual?: number;
  endereco?: string;
  cidade?: string;
  uf?: string;
  site?: string;
  redes_sociais?: any;
  logo_url?: string;
  tags?: string[];
}

export const useSupabaseClients = () => {
  const [clients, setClients] = useState<SupabaseClient[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar todos os clientes
  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar clientes.",
          variant: "destructive",
        });
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar cliente específico por ID
  const getClient = async (id: string): Promise<SupabaseClient | null> => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar cliente:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
  };

  // Criar novo cliente
  const createClient = async (clientData: Omit<ClientFormData, 'criado_em'>): Promise<SupabaseClient | null> => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([clientData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cliente:', error);
        toast({
          title: "Erro",
          description: "Falha ao criar cliente.",
          variant: "destructive",
        });
        return null;
      }

      await fetchClients(); // Refresh the list
      
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return null;
    }
  };

  // Alias for createClient to maintain compatibility
  const addClient = createClient;

  // Atualizar cliente existente
  const updateClient = async (id: string, updates: Partial<ClientFormData>): Promise<SupabaseClient | null> => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        toast({
          title: "Erro",
          description: "Falha ao atualizar cliente.",
          variant: "destructive",
        });
        return null;
      }

      await fetchClients(); // Refresh the list

      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return null;
    }
  };

  // Deletar cliente
  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar cliente:', error);
        toast({
          title: "Erro",
          description: "Falha ao deletar cliente.",
          variant: "destructive",
        });
        return false;
      }

      await fetchClients(); // Refresh the list
      
      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    fetchClients,
    getClient,
    createClient,
    addClient, // Add alias for compatibility
    updateClient,
    deleteClient,
  };
};
