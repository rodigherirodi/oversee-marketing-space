
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProductivityData {
  id: string;
  user_id: string;
  productivity_score: number;
  hours_worked_month: number;
  avg_completion_time: number;
  active_streak: number;
  punctuality_index: number;
  collaboration_index: number;
  innovation_score: number;
  client_satisfaction: number;
  active_projects: number;
  completed_projects: number;
  collaborative_projects: number;
  individual_projects: number;
}

interface Achievement {
  id: string;
  name: string;
  badge: string;
  date: string;
}

interface PointsHistory {
  id: string;
  points: number;
  activity: string;
  date: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  current_value: number;
  target_value: number;
  deadline: string;
}

interface Skill {
  id: string;
  skill: string;
  level: number;
}

interface Badge {
  id: string;
  badge: string;
  earned_at: string;
}

export const useProductivityData = () => {
  const { user } = useAuth();

  const { data: productivity, isLoading: productivityLoading } = useQuery({
    queryKey: ['productivity', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_productivity')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching productivity:', error);
        return null;
      }
      return data as ProductivityData;
    },
    enabled: !!user?.id,
  });

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }
      return data as Achievement[];
    },
    enabled: !!user?.id,
  });

  const { data: pointsHistory = [], isLoading: pointsLoading } = useQuery({
    queryKey: ['points-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_points_history')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching points history:', error);
        return [];
      }
      return data as PointsHistory[];
    },
    enabled: !!user?.id,
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline', { ascending: true });

      if (error) {
        console.error('Error fetching goals:', error);
        return [];
      }
      return data as Goal[];
    },
    enabled: !!user?.id,
  });

  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id)
        .order('level', { ascending: false });

      if (error) {
        console.error('Error fetching skills:', error);
        return [];
      }
      return data as Skill[];
    },
    enabled: !!user?.id,
  });

  const { data: badges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ['badges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching badges:', error);
        return [];
      }
      return data as Badge[];
    },
    enabled: !!user?.id,
  });

  return {
    productivity,
    achievements,
    pointsHistory,
    goals,
    skills,
    badges,
    isLoading: productivityLoading || achievementsLoading || pointsLoading || goalsLoading || skillsLoading || badgesLoading,
  };
};
