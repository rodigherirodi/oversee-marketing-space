
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseClientNote {
  id: string;
  cliente_id: string;
  conteudo: string;
  autor_id: string | null;
  criado_em: string;
  atualizado_em: string;
}

export const useSupabaseClientNotes = (clientId: string) => {
  const [notes, setNotes] = useState<SupabaseClientNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar anotações do cliente
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cliente_anotacoes')
        .select('*')
        .eq('cliente_id', clientId)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar anotações:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar anotações do cliente.",
          variant: "destructive",
        });
        return;
      }

      setNotes(data || []);
    } catch (error) {
      console.error('Erro ao buscar anotações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova anotação
  const addNote = async (content: string): Promise<SupabaseClientNote | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado.",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('cliente_anotacoes')
        .insert([{ 
          cliente_id: clientId, 
          conteudo: content,
          autor_id: user.id 
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar anotação:', error);
        toast({
          title: "Erro",
          description: "Falha ao criar anotação.",
          variant: "destructive",
        });
        return null;
      }

      setNotes(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Anotação adicionada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar anotação:', error);
      return null;
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchNotes();
    }
  }, [clientId]);

  return {
    notes,
    loading,
    fetchNotes,
    addNote,
  };
};
