
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Mock user data for when Supabase data is not available
const mockUserProfile = {
  id: 'mock-user-id',
  name: 'Usuário Exemplo',
  email: 'usuario@exemplo.com',
  phone: '(11) 99999-9999',
  position: 'Desenvolvedor Frontend',
  department: 'operacao' as const,
  birth_date: '1990-01-01',
  hire_date: '2023-01-01',
  address: 'São Paulo, SP',
  status: 'active',
  level: 3,
  points: 1250,
  task_completion_rate: 85.5,
  active_projects_count: 3,
  completed_projects_count: 12,
  hours_worked_week: 40,
  border_pattern: 'solid',
  border_color: '#3B82F6',
  avatar: '/placeholder.svg',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  badges: ['🌟', '🚀'] // Add badges here
};

export const useCurrentUser = () => {
  const { user } = useAuth();

  const { data: currentUserProfile, isLoading } = useQuery({
    queryKey: ['current-user', user?.id],
    queryFn: async () => {
      if (!user?.id) return mockUserProfile;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.log('Error fetching current user, using mock data:', error);
          return mockUserProfile;
        }
        
        return data ? { ...data, badges: ['🌟', '🚀'] } : mockUserProfile;
      } catch (error) {
        console.log('Connection error, using mock data:', error);
        return mockUserProfile;
      }
    },
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    currentUserProfile: currentUserProfile || mockUserProfile,
    isLoading: false, // Set to false to prevent loading states
  };
};
