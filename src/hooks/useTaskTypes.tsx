
import { useState, useEffect } from 'react';
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
      // Mock data until database is properly set up
      const mockTaskTypes: TaskType[] = [
        { id: 'task', name: 'Tarefa', color: '#3B82F6', icon: '📋' },
        { id: 'bug', name: 'Bug', color: '#EF4444', icon: '🐛' },
        { id: 'feature', name: 'Funcionalidade', color: '#10B981', icon: '⭐' },
        { id: 'improvement', name: 'Melhoria', color: '#F59E0B', icon: '🔧' }
      ];

      setTaskTypes(mockTaskTypes);
    } catch (error) {
      console.error('Error fetching task types:', error);
      toast.error('Erro ao carregar tipos de tarefa');
    } finally {
      setLoading(false);
    }
  };

  const addTaskType = async (taskType: Omit<TaskType, 'id'>): Promise<TaskType | undefined> => {
    try {
      const newTaskType: TaskType = {
        id: Math.random().toString(36).substr(2, 9),
        ...taskType
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
