
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  avatar: string;
  phone: string;
  birth_date: string;
  hire_date: string;
  status: string;
  level: number;
  points: number;
  task_completion_rate: number;
  active_projects_count: number;
  completed_projects_count: number;
  hours_worked_week: number;
  border_pattern: string;
  border_color: string;
  address: string;
  created_at: string;
}

export const useTeamMembers = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching team members:', error);
        toast({
          title: "Erro ao carregar membros",
          description: "Não foi possível carregar os membros da equipe.",
          variant: "destructive",
        });
        return [];
      }
      
      return data as TeamMember[];
    },
    enabled: !!user,
  });

  const addTeamMemberMutation = useMutation({
    mutationFn: async (newMember: Omit<TeamMember, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([newMember])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Membro adicionado",
        description: "Novo membro da equipe foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error adding team member:', error);
      toast({
        title: "Erro ao adicionar membro",
        description: "Não foi possível adicionar o membro da equipe.",
        variant: "destructive",
      });
    },
  });

  const updateTeamMemberMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TeamMember> }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Membro atualizado",
        description: "Informações do membro foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating team member:', error);
      toast({
        title: "Erro ao atualizar membro",
        description: "Não foi possível atualizar as informações do membro.",
        variant: "destructive",
      });
    },
  });

  const addTeamMember = (newMember: Omit<TeamMember, 'id' | 'created_at'>) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem adicionar membros.",
        variant: "destructive",
      });
      return;
    }
    addTeamMemberMutation.mutate(newMember);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    if (!isAdmin && id !== user?.id) {
      toast({
        title: "Acesso negado",
        description: "Você só pode editar seu próprio perfil.",
        variant: "destructive",
      });
      return;
    }
    updateTeamMemberMutation.mutate({ id, updates });
  };

  const searchMembers = (query: string) => {
    if (!query.trim()) return teamMembers;
    
    const lowercaseQuery = query.toLowerCase();
    return teamMembers.filter(member =>
      member.name.toLowerCase().includes(lowercaseQuery) ||
      member.email.toLowerCase().includes(lowercaseQuery) ||
      member.position?.toLowerCase().includes(lowercaseQuery) ||
      member.department?.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    teamMembers,
    addTeamMember,
    updateTeamMember,
    searchMembers,
    isLoading,
  };
};
