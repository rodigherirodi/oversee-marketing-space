
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseClientAccess {
  id: string;
  cliente_id: string;
  plataforma: string;
  usuario: string | null;
  senha: string | null;
  notas: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface ClientAccessFormData {
  plataforma: string;
  usuario?: string;
  senha?: string;
  notas?: string;
  cliente_id: string;
}

export const useSupabaseClientAccesses = (clientId: string) => {
  const [accesses, setAccesses] = useState<SupabaseClientAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar acessos do cliente
  const fetchAccesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cliente_acessos')
        .select('*')
        .eq('cliente_id', clientId)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar acessos:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar acessos do cliente.",
          variant: "destructive",
        });
        return;
      }

      setAccesses(data || []);
    } catch (error) {
      console.error('Erro ao buscar acessos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo acesso
  const addAccess = async (accessData: Omit<ClientAccessFormData, 'cliente_id'>): Promise<SupabaseClientAccess | null> => {
    try {
      const { data, error } = await supabase
        .from('cliente_acessos')
        .insert([{ ...accessData, cliente_id: clientId }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar acesso:', error);
        toast({
          title: "Erro",
          description: "Falha ao criar acesso.",
          variant: "destructive",
        });
        return null;
      }

      setAccesses(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Acesso adicionado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar acesso:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar acesso.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Atualizar acesso
  const updateAccess = async (id: string, updates: Partial<Omit<ClientAccessFormData, 'cliente_id'>>): Promise<SupabaseClientAccess | null> => {
    try {
      const { data, error } = await supabase
        .from('cliente_acessos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar acesso:', error);
        toast({
          title: "Erro",
          description: "Falha ao atualizar acesso.",
          variant: "destructive",
        });
        return null;
      }

      setAccesses(prev => prev.map(access => 
        access.id === id ? data : access
      ));

      toast({
        title: "Sucesso",
        description: "Acesso atualizado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar acesso:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar acesso.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Deletar acesso
  const deleteAccess = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cliente_acessos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar acesso:', error);
        toast({
          title: "Erro",
          description: "Falha ao deletar acesso.",
          variant: "destructive",
        });
        return false;
      }

      setAccesses(prev => prev.filter(access => access.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Acesso removido com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar acesso:', error);
      toast({
        title: "Erro",
        description: "Falha ao deletar acesso.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchAccesses();
    }
  }, [clientId]);

  return {
    accesses,
    loading,
    fetchAccesses,
    addAccess,
    updateAccess,
    deleteAccess,
  };
};
