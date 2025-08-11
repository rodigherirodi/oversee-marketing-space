
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseClientContact {
  id: string;
  cliente_id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cargo: string | null;
  tipo: 'principal' | 'financeiro' | 'tecnico' | 'outro';
  is_primary: boolean;
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface ClientContactFormData {
  nome: string;
  email?: string;
  telefone?: string;
  cargo?: string;
  tipo: 'principal' | 'financeiro' | 'tecnico' | 'outro';
  is_primary?: boolean;
  observacoes?: string;
  cliente_id: string;
}

export const useSupabaseClientContacts = (clientId: string) => {
  const [contacts, setContacts] = useState<SupabaseClientContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar contatos do cliente
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cliente_contatos')
        .select('*')
        .eq('cliente_id', clientId)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contatos:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar contatos do cliente.",
          variant: "destructive",
        });
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo contato
  const addContact = async (contactData: Omit<ClientContactFormData, 'cliente_id'>): Promise<SupabaseClientContact | null> => {
    try {
      const { data, error } = await supabase
        .from('cliente_contatos')
        .insert([{ ...contactData, cliente_id: clientId }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar contato:', error);
        toast({
          title: "Erro",
          description: "Falha ao criar contato.",
          variant: "destructive",
        });
        return null;
      }

      setContacts(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Contato adicionado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      return null;
    }
  };

  // Atualizar contato
  const updateContact = async (id: string, updates: Partial<Omit<ClientContactFormData, 'cliente_id'>>): Promise<SupabaseClientContact | null> => {
    try {
      const { data, error } = await supabase
        .from('cliente_contatos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar contato:', error);
        toast({
          title: "Erro",
          description: "Falha ao atualizar contato.",
          variant: "destructive",
        });
        return null;
      }

      setContacts(prev => prev.map(contact => 
        contact.id === id ? data : contact
      ));

      toast({
        title: "Sucesso",
        description: "Contato atualizado com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      return null;
    }
  };

  // Deletar contato
  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cliente_contatos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar contato:', error);
        toast({
          title: "Erro",
          description: "Falha ao deletar contato.",
          variant: "destructive",
        });
        return false;
      }

      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Contato removido com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      return false;
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchContacts();
    }
  }, [clientId]);

  return {
    contacts,
    loading,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
  };
};
