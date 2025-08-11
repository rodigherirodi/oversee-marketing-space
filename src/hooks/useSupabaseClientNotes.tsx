
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
  autor_nome?: string;
}

export const useSupabaseClientNotes = (clientId: string) => {
  const [notes, setNotes] = useState<SupabaseClientNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar anotações do cliente com nome do autor
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cliente_anotacoes')
        .select(`
          *,
          profiles!inner(name)
        `)
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

      // Mapear os dados para incluir o nome do autor
      const notesWithAuthor = (data || []).map(note => ({
        ...note,
        autor_nome: note.profiles?.name || 'Usuário desconhecido'
      }));

      setNotes(notesWithAuthor);
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
        .select(`
          *,
          profiles!inner(name)
        `)
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

      const noteWithAuthor = {
        ...data,
        autor_nome: data.profiles?.name || 'Usuário desconhecido'
      };

      setNotes(prev => [noteWithAuthor, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Anotação adicionada com sucesso!",
      });

      return noteWithAuthor;
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
