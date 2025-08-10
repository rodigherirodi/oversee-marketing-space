
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TaskType {
  id: string;
  name: string;
  color: string;
  icon: string;
  slug: string;
  description?: string;
}

export const useTaskTypes = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTaskTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('task_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      // Transform data to match TaskType interface with defaults for missing fields
      const transformedTypes: TaskType[] = (data || []).map((type: any) => ({
        id: type.id,
        name: type.name,
        color: type.color || '#3B82F6', // Default color if missing
        icon: type.icon || '📋', // Default icon if missing
        slug: type.slug,
        description: type.description
      }));
      
      setTaskTypes(transformedTypes);
    } catch (error) {
      console.error('Error fetching task types:', error);
      toast.error('Erro ao carregar tipos de tarefa');
    } finally {
      setLoading(false);
    }
  };

  const addTaskType = async (taskType: Omit<TaskType, 'id'>): Promise<TaskType | undefined> => {
    try {
      const { data, error } = await supabase
        .from('task_types')
        .insert([{
          name: taskType.name,
          slug: taskType.slug,
          description: taskType.description,
          icon: taskType.icon,
          color: taskType.color
        }])
        .select()
        .single();

      if (error) throw error;

      const newTaskType: TaskType = {
        id: data.id,
        name: data.name,
        color: data.color || '#3B82F6', // Default color if missing
        icon: data.icon || '📋', // Default icon if missing
        slug: data.slug,
        description: data.description
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
