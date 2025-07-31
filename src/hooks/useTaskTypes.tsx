
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
      const { data, error } = await (supabase as any)
        .from('task_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setTaskTypes(data || []);
    } catch (error) {
      console.error('Error fetching task types:', error);
      toast.error('Erro ao carregar tipos de tarefa');
    } finally {
      setLoading(false);
    }
  };

  const addTaskType = async (taskType: Omit<TaskType, 'id'>): Promise<TaskType | undefined> => {
    try {
      const { data, error } = await (supabase as any)
        .from('task_types')
        .insert([taskType])
        .select()
        .single();

      if (error) throw error;

      const newTaskType: TaskType = {
        id: data.id,
        name: data.name,
        color: data.color,
        icon: data.icon
      };
      
      setTaskTypes(prev => [...prev, newTaskType]);
      toast.success('Tipo de tarefa criado com sucesso');
      return newTaskType;
    } catch (error) {
      console.error('Error creating task type:', error);
      toast.error('Erro ao criar tipo de tarefa');
      throw error;
    }
  };

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  return {
    taskTypes,
    loading,
    addTaskType,
    refetch: fetchTaskTypes
  };
};
