
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCurrentUser = () => {
  const { user } = useAuth();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['current-user', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching current user:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    currentUser,
    isLoading,
  };
};
