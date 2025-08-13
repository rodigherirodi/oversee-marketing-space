
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemMetrics, SystemStatus } from '@/types/admin';

export const useSystemMetrics = () => {
  const { data: metrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async (): Promise<SystemMetrics[]> => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: systemStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['system-status'],
    queryFn: async (): Promise<SystemStatus> => {
      // Get user count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Get permissions count
      const { count: permissionsCount, error: permissionsError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      if (permissionsError) throw permissionsError;

      // Check database health (simple query)
      const { error: healthError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      return {
        database: healthError ? 'error' : 'healthy',
        api: 'online',
        users_count: usersCount || 0,
        permissions_count: permissionsCount || 0,
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });

  return {
    metrics,
    systemStatus,
    isLoading: metricsLoading || statusLoading,
  };
};
