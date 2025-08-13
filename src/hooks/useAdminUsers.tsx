
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminUser } from '@/types/admin';

export const useAdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUser[]> => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role)
        `)
        .order('name');

      if (error) throw error;

      return profiles.map((profile: any) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        department: profile.department as 'operacao' | 'academy' | 'cultura' | 'comercial' | 'gestao',
        position: profile.position,
        status: profile.status as 'active' | 'inactive',
        role: profile.user_roles[0]?.role as 'admin' | 'manager' | 'team_lead' | 'user' || 'user',
        avatar: profile.avatar,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        last_login: profile.last_login
      }));
    },
  });

  const createUser = useMutation({
    mutationFn: async (userData: Partial<AdminUser>) => {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email!,
        password: 'TempPassword123!', // Temporary password
        email_confirm: true,
        user_metadata: {
          name: userData.name
        }
      });

      if (authError) throw authError;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          department: userData.department as 'operacao' | 'academy' | 'cultura' | 'comercial' | 'gestao',
          position: userData.position,
          status: userData.status
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      // Set user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: userData.role
        });

      if (roleError) throw roleError;

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Usuário criado com sucesso!",
        description: "O usuário foi adicionado ao sistema.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, ...userData }: Partial<AdminUser> & { id: string }) => {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          department: userData.department as 'operacao' | 'academy' | 'cultura' | 'comercial' | 'gestao',
          position: userData.position,
          status: userData.status
        })
        .eq('id', id);

      if (profileError) throw profileError;

      // Update role if provided
      if (userData.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: userData.role })
          .eq('user_id', id);

        if (roleError) throw roleError;
      }

      return { id, ...userData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Usuário atualizado com sucesso!",
        description: "As informações foram salvas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      // Delete user (cascade will handle profiles and roles)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Usuário excluído com sucesso!",
        description: "O usuário foi removido do sistema.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    users,
    isLoading,
    createUser: createUser.mutate,
    updateUser: updateUser.mutate,
    deleteUser: deleteUser.mutate,
    isCreating: createUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending,
  };
};
