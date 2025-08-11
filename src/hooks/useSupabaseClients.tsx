
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseClient {
  id: string;
  nome: string;
  segmento: string | null;
  porte: 'micro' | 'pequeno' | 'medio' | 'grande' | null;
  status: 'ativo' | 'inativo' | 'prospect';
  temperatura: 'frio' | 'morno' | 'quente' | null;
  tipo_contrato: 'recorrente' | 'pontual' | 'projeto_unico' | null;
  cliente_desde: string | null;
  gestor_id: string | null;
  nps_atual: number | null;
  nps_atual_data: string | null;
  endereco: string | null;
  cidade: string | null;
  uf: string | null;
  site: string | null;
  logo_url: string | null;
  tags: string[] | null;
  redes_sociais: any | null;
  criado_em: string;
  atualizado_em: string;
}

export interface ClientFormData {
  nome: string;
  segmento?: string;
  porte?: 'micro' | 'pequeno' | 'medio' | 'grande';
  status: 'ativo' | 'inativo' | 'prospect';
  temperatura?: 'frio' | 'morno' | 'quente';
  tipo_contrato?: 'recorrente' | 'pontual' | 'projeto_unico';
  cliente_desde?: string;
  gestor_id?: string;
  nps_atual?: number;
  endereco?: string;
  cidade?: string;
  uf?: string;
  site?: string;
  tags?: string[];
  redes_sociais?: any;
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
      toast({
        title: "Erro",
        description: "Falha ao carregar clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar cliente por ID
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

  // Adicionar novo cliente
  const addClient = async (clientData: ClientFormData): Promise<SupabaseClient | null> => {
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

      setClients(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar cliente.",
        variant: "destructive",
      });
      return null;
    }
  };

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

      setClients(prev => prev.map(client => 
        client.id === id ? data : client
      ));

      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar cliente.",
        variant: "destructive",
      });
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

      setClients(prev => prev.filter(client => client.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Cliente deletado com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast({
        title: "Erro",
        description: "Falha ao deletar cliente.",
        variant: "destructive",
      });
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
    addClient,
    updateClient,
    deleteClient,
  };
};
