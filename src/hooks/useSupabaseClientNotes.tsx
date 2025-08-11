
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
      
      // First get the notes
      const { data: notesData, error: notesError } = await supabase
        .from('cliente_anotacoes')
        .select('*')
        .eq('cliente_id', clientId)
        .order('criado_em', { ascending: false });

      if (notesError) {
        console.error('Erro ao buscar anotações:', notesError);
        toast({
          title: "Erro",
          description: "Falha ao carregar anotações do cliente.",
          variant: "destructive",
        });
        return;
      }

      // Then get author names for each note
      const notesWithAuthor = await Promise.all(
        (notesData || []).map(async (note) => {
          if (note.autor_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', note.autor_id)
              .single();
            
            return {
              ...note,
              autor_nome: profileData?.name || 'Usuário desconhecido'
            };
          }
          return {
            ...note,
            autor_nome: 'Usuário desconhecido'
          };
        })
      );

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

      // Get author name for the new note
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      const noteWithAuthor = {
        ...data,
        autor_nome: profileData?.name || 'Usuário desconhecido'
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
