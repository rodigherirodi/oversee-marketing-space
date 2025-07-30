
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TaskType {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const useTaskTypes = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

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

  const addTaskType = async (taskType: Omit<TaskType, 'id'>): Promise<TaskType | undefined> => {
    try {
      const { data, error } = await supabase
        .from('task_types')
        .insert([taskType])
        .select()
        .single();

      if (error) throw error;

      const newTaskType: TaskType = data;
      setTaskTypes(prev => [...prev, newTaskType]);
      toast.success('Tipo de tarefa criado com sucesso');
      return newTaskType;
    } catch (err) {
      console.error('Error creating task type:', err);
      toast.error('Erro ao criar tipo de tarefa');
      throw err;
    }
  };

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  return { 
    taskTypes, 
    loading,
    addTaskType
  };
};
