
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TaskDTO } from '@/types/database';

export const useProductivityTasks = () => {
  const { data: overdueTasks = [] } = useQuery({
    queryKey: ['overdue-tasks'],
    queryFn: async (): Promise<TaskDTO[]> => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .lt('data_entrega', today)
        .neq('status', 'completed');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: todayTasks = [] } = useQuery({
    queryKey: ['today-tasks'],
    queryFn: async (): Promise<TaskDTO[]> => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('data_entrega', today);
      
      if (error) throw error;
      return data || [];
    },
  });

  return { overdueTasks, todayTasks };
};
