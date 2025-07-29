
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

// Mock data for demonstration - always available
const mockProductivityData = {
  id: 'mock-productivity-id',
  user_id: 'mock-user-id',
  productivity_score: 85,
  hours_worked_month: 168,
  avg_completion_time: 2.8,
  active_streak: 12,
  punctuality_index: 95,
  collaboration_index: 88,
  innovation_score: 92,
  client_satisfaction: 4.7,
  active_projects: 3,
  completed_projects: 12,
  collaborative_projects: 8,
  individual_projects: 7,
};

const mockAchievements = [
  { id: '1', name: 'Entrega no Prazo', badge: '⏰', date: '2024-01-15' },
  { id: '2', name: 'Colaboração', badge: '🤝', date: '2024-01-10' },
  { id: '3', name: 'Inovação', badge: '💡', date: '2024-01-05' },
];

const mockPointsHistory = [
  { id: '1', points: 50, activity: 'Tarefa concluída', date: '2024-01-15' },
  { id: '2', points: 30, activity: 'Code review', date: '2024-01-14' },
  { id: '3', points: 25, activity: 'Ajuda ao colega', date: '2024-01-13' },
];

const mockGoals = [
  { id: '1', title: 'Concluir 5 projetos', description: 'Meta trimestral', current_value: 3, target_value: 5, deadline: '2024-03-31' },
  { id: '2', title: 'Melhorar produtividade', description: 'Aumentar score', current_value: 85, target_value: 90, deadline: '2024-02-28' },
];

const mockSkills = [
  { id: '1', skill: 'React', level: 4 },
  { id: '2', skill: 'TypeScript', level: 3 },
  { id: '3', skill: 'Node.js', level: 3 },
];

const mockBadges = [
  { id: '1', badge: '🌟', earned_at: '2024-01-15T00:00:00Z' },
  { id: '2', badge: '🚀', earned_at: '2024-01-10T00:00:00Z' },
  { id: '3', badge: '💻', earned_at: '2024-01-05T00:00:00Z' },
];

export const useProductivityData = () => {
  const { user } = useAuth();

  // Always return mock data with minimal queries
  return {
    productivity: mockProductivityData,
    achievements: mockAchievements,
    pointsHistory: mockPointsHistory,
    goals: mockGoals,
    skills: mockSkills,
    badges: mockBadges,
    isLoading: false,
  };
};
