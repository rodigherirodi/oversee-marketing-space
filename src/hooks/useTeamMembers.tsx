
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TeamMember } from '@/types/entities';

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
    mutationFn: async (newMember: Partial<TeamMember>) => {
      // Mapear campos para o formato do banco - apenas campos que existem na tabela profiles
      const profileData: Omit<any, 'id' | 'created_at' | 'updated_at'> = {
        name: newMember.name!,
        email: newMember.email!,
        phone: newMember.phone || '',
        position: newMember.position || '',
        department: newMember.department as "operacao" | "academy" | "cultura" | "comercial" | "gestao",
        birth_date: newMember.birthDate || newMember.birth_date || null,
        hire_date: newMember.hireDate || newMember.hire_date || null,
        address: newMember.address || '',
        status: newMember.status || 'active',
        level: newMember.level || 1,
        points: newMember.points || 0,
        task_completion_rate: newMember.taskCompletionRate || newMember.task_completion_rate || 0,
        active_projects_count: newMember.activeProjectsCount || newMember.active_projects_count || 0,
        completed_projects_count: newMember.completedProjectsCount || newMember.completed_projects_count || 0,
        hours_worked_week: newMember.hoursWorkedWeek || newMember.hours_worked_week || 40,
        border_pattern: newMember.borderPattern || newMember.border_pattern || 'solid',
        border_color: newMember.borderColor || newMember.border_color || '#3B82F6',
        avatar: newMember.avatar || '/placeholder.svg',
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
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
      // Mapear campos para o formato do banco - apenas campos que existem na tabela profiles
      const profileUpdates: any = {};
      
      if (updates.name !== undefined) profileUpdates.name = updates.name;
      if (updates.email !== undefined) profileUpdates.email = updates.email;
      if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
      if (updates.position !== undefined) profileUpdates.position = updates.position;
      if (updates.department !== undefined) profileUpdates.department = updates.department;
      if (updates.birthDate !== undefined) profileUpdates.birth_date = updates.birthDate;
      if (updates.birth_date !== undefined) profileUpdates.birth_date = updates.birth_date;
      if (updates.hireDate !== undefined) profileUpdates.hire_date = updates.hireDate;
      if (updates.hire_date !== undefined) profileUpdates.hire_date = updates.hire_date;
      if (updates.address !== undefined) profileUpdates.address = updates.address;
      if (updates.status !== undefined) profileUpdates.status = updates.status;
      if (updates.level !== undefined) profileUpdates.level = updates.level;
      if (updates.points !== undefined) profileUpdates.points = updates.points;
      if (updates.taskCompletionRate !== undefined) profileUpdates.task_completion_rate = updates.taskCompletionRate;
      if (updates.task_completion_rate !== undefined) profileUpdates.task_completion_rate = updates.task_completion_rate;
      if (updates.activeProjectsCount !== undefined) profileUpdates.active_projects_count = updates.activeProjectsCount;
      if (updates.active_projects_count !== undefined) profileUpdates.active_projects_count = updates.active_projects_count;
      if (updates.completedProjectsCount !== undefined) profileUpdates.completed_projects_count = updates.completedProjectsCount;
      if (updates.completed_projects_count !== undefined) profileUpdates.completed_projects_count = updates.completed_projects_count;
      if (updates.hoursWorkedWeek !== undefined) profileUpdates.hours_worked_week = updates.hoursWorkedWeek;
      if (updates.hours_worked_week !== undefined) profileUpdates.hours_worked_week = updates.hours_worked_week;
      if (updates.borderPattern !== undefined) profileUpdates.border_pattern = updates.borderPattern;
      if (updates.border_pattern !== undefined) profileUpdates.border_pattern = updates.border_pattern;
      if (updates.borderColor !== undefined) profileUpdates.border_color = updates.borderColor;
      if (updates.border_color !== undefined) profileUpdates.border_color = updates.border_color;
      if (updates.avatar !== undefined) profileUpdates.avatar = updates.avatar;

      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdates)
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

  const addTeamMember = (newMember: Partial<TeamMember>) => {
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
