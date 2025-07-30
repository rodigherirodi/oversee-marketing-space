
import { useMemo } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';

export const useUserTasks = () => {
  const { tasks } = useTaskContext();

  const userTasks = useMemo(() => {
    // Convert tasks from useTasks format to the expected format
    return tasks.map(task => ({
      ...task,
      // Map snake_case to camelCase where needed for compatibility
      type: task.task_type?.name || 'Task',
      clientId: task.client_id,
      client: task.client_id, // This might need proper client data
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    })) as any[];
  }, [tasks]);

  return {
    tasks: userTasks,
    loading: false,
    error: null
  };
};
