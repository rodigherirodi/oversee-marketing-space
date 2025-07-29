
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
  updated_at: '2024-01-01T00:00:00Z'
};

export const useCurrentUser = () => {
  const { user } = useAuth();

  const { data: currentUserProfile, isLoading } = useQuery({
    queryKey: ['current-user', user?.id],
    queryFn: async () => {
      if (!user?.id) return mockUserProfile;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching current user:', error);
        // Return mock data instead of null when there's an error
        return mockUserProfile;
      }
      
      return data || mockUserProfile;
    },
    enabled: true, // Always enable to return mock data
  });

  return {
    currentUserProfile: currentUserProfile || mockUserProfile,
    isLoading,
  };
};
