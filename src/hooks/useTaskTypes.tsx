
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TaskType {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const useTaskTypes = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('task_types')
          .select('*')
          .order('name');

        if (error) throw error;
        setTaskTypes(data || []);
      } catch (err) {
        console.error('Error fetching task types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskTypes();
  }, []);

  return { taskTypes, loading };
};
