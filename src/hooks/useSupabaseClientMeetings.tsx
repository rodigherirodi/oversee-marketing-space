
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseClientMeeting {
  id: string;
  cliente_id: string;
  titulo: string;
  data_hora: string;
  duracao: number | null;
  tipo: string | null;
  resumo: string | null;
  participantes: string[] | null;
  link_gravacao: string | null;
  observacoes: string | null;
  criado_por: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface MeetingFormData {
  titulo: string;
  data_hora: string;
  duracao?: number;
  tipo?: string;
  resumo?: string;
  participantes?: string[];
  link_gravacao?: string;
  observacoes?: string;
}

export const useSupabaseClientMeetings = (clientId: string) => {
  const [meetings, setMeetings] = useState<SupabaseClientMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Buscar reuniões do cliente
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cliente_reunioes')
        .select('*')
        .eq('cliente_id', clientId)
        .order('data_hora', { ascending: false });

      if (error) {
        console.error('Erro ao buscar reuniões:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar reuniões do cliente.",
          variant: "destructive",
        });
        return;
      }

      setMeetings(data || []);
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova reunião
  const addMeeting = async (meetingData: MeetingFormData): Promise<SupabaseClientMeeting | null> => {
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
        .from('cliente_reunioes')
        .insert([{ 
          cliente_id: clientId, 
          ...meetingData,
          criado_por: user.id 
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar reunião:', error);
        toast({
          title: "Erro",
          description: "Falha ao criar reunião.",
          variant: "destructive",
        });
        return null;
      }

      setMeetings(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Reunião adicionada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar reunião:', error);
      return null;
    }
  };

  // Atualizar reunião existente
  const updateMeeting = async (meetingId: string, updates: Partial<MeetingFormData>): Promise<SupabaseClientMeeting | null> => {
    try {
      const { data, error } = await supabase
        .from('cliente_reunioes')
        .update(updates)
        .eq('id', meetingId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar reunião:', error);
        toast({
          title: "Erro",
          description: "Falha ao atualizar reunião.",
          variant: "destructive",
        });
        return null;
      }

      setMeetings(prev => prev.map(meeting => 
        meeting.id === meetingId ? data : meeting
      ));

      toast({
        title: "Sucesso",
        description: "Reunião atualizada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Erro ao atualizar reunião:', error);
      return null;
    }
  };

  // Deletar reunião
  const deleteMeeting = async (meetingId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cliente_reunioes')
        .delete()
        .eq('id', meetingId);

      if (error) {
        console.error('Erro ao deletar reunião:', error);
        toast({
          title: "Erro",
          description: "Falha ao deletar reunião.",
          variant: "destructive",
        });
        return false;
      }

      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
      
      toast({
        title: "Sucesso",
        description: "Reunião deletada com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar reunião:', error);
      return false;
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchMeetings();
    }
  }, [clientId]);

  return {
    meetings,
    loading,
    fetchMeetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
  };
};
