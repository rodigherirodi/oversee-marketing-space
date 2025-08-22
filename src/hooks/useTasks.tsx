
// Mantém compatibilidade com o código existente enquanto usa a nova implementação
import { 
  useTasksOptimized, 
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask,
  taskKeys 
} from './useTasksOptimized';
import { TaskDTO, TaskFormData } from '@/types/database';

// Re-exporta os tipos para compatibilidade
export type Task = TaskDTO;

// Adapter para manter a interface existente
export const useTasks = () => {
  const { 
    data: tasksData, 
    isLoading: loading, 
    error, 
    refetch 
  } = useTasksOptimized();

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Transform data to match existing interface
  const tasks = tasksData?.data || [];

  const createTask = async (taskData: Partial<TaskFormData>): Promise<Task | undefined> => {
    try {
      const result = await createTaskMutation.mutateAsync(taskData as TaskFormData);
      return result;
    } catch (error) {
      return undefined;
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskFormData>): Promise<Task | undefined> => {
    try {
      const result = await updateTaskMutation.mutateAsync({ id, data: updates });
      return result;
    } catch (error) {
      return undefined;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync(id);
    } catch (error) {
      throw error;
    }
  };

  return {
    tasks,
    loading,
    error: error?.message || null,
    refetch,
    createTask,
    updateTask,
    deleteTask
  };
};

export { taskKeys };
