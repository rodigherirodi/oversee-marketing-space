
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Note {
  id: string;
  user_id: string;
  notebook_id: string | null;
  title: string;
  content_json: any;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  version: number;
}

export interface Notebook {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch notes with error handling
  const fetchNotes = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
      
      setNotes(data || []);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      setNotes([]);
      if (toast) {
        toast({
          title: "Erro",
          description: "Falha ao carregar notas.",
          variant: "destructive",
        });
      }
    }
  }, [user, toast]);

  // Fetch notebooks with error handling
  const fetchNotebooks = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notebooks')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error fetching notebooks:', error);
        throw error;
      }
      
      setNotebooks(data || []);
    } catch (error) {
      console.error('Erro ao buscar cadernos:', error);
      setNotebooks([]);
    }
  }, [user]);

  // Create note with error handling
  const createNote = useCallback(async (title: string = 'Nova Nota', notebookId?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          title,
          notebook_id: notebookId || null,
          content_json: { type: 'doc', content: [] },
          tags: [],
          is_pinned: false
        }])
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [data, ...prev]);
      
      if (toast) {
        toast({
          title: "Sucesso",
          description: "Nova nota criada!",
        });
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      if (toast) {
        toast({
          title: "Erro",
          description: "Falha ao criar nota.",
          variant: "destructive",
        });
      }
      return null;
    }
  }, [user, toast]);

  // Update note with error handling
  const updateNote = useCallback(async (noteId: string, updates: Partial<Note>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', noteId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, ...data } : note
      ));
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      return null;
    }
  }, [user]);

  // Soft delete note with error handling
  const deleteNote = useCallback(async (noteId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      if (toast) {
        toast({
          title: "Sucesso",
          description: "Nota excluída!",
        });
      }
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      if (toast) {
        toast({
          title: "Erro",
          description: "Falha ao excluir nota.",
          variant: "destructive",
        });
      }
    }
  }, [user, toast]);

  // Search notes with error handling
  const searchNotes = useCallback(async (query: string) => {
    if (!user || !query.trim()) {
      fetchNotes();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .or(`title.ilike.%${query}%, tags.cs.{${query}}`)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      setNotes([]);
    }
  }, [user, fetchNotes]);

  // Create notebook with error handling
  const createNotebook = useCallback(async (name: string, color: string = '#3B82F6') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notebooks')
        .insert([{
          user_id: user.id,
          name,
          color
        }])
        .select()
        .single();

      if (error) throw error;
      
      setNotebooks(prev => [...prev, data]);
      
      if (toast) {
        toast({
          title: "Sucesso",
          description: "Caderno criado!",
        });
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao criar caderno:', error);
      if (toast) {
        toast({
          title: "Erro",
          description: "Falha ao criar caderno.",
          variant: "destructive",
        });
      }
      return null;
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      Promise.all([fetchNotes(), fetchNotebooks()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user, fetchNotes, fetchNotebooks]);

  return {
    notes,
    notebooks,
    loading,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    createNotebook,
    refetch: () => Promise.all([fetchNotes(), fetchNotebooks()])
  };
};
