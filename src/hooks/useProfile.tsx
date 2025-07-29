
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Return mock profile if no profile exists
        setProfile({
          id: user?.id || 'mock-id',
          name: user?.email?.split('@')[0] || 'Usuário',
          email: user?.email || 'usuario@exemplo.com',
          phone: '',
          position: 'Desenvolvedor',
          department: 'operacao',
          birth_date: null,
          hire_date: new Date().toISOString().split('T')[0],
          address: '',
          status: 'active',
          level: 1,
          points: 0,
          task_completion_rate: 0,
          active_projects_count: 0,
          completed_projects_count: 0,
          hours_worked_week: 40,
          border_pattern: 'solid',
          border_color: '#3B82F6',
          avatar: null,
          emergency_contact_name: null,
          emergency_contact_phone: null,
          emergency_contact_relationship: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: ProfileUpdate) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
      return { error: error.message };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile,
  };
};
