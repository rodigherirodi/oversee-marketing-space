
import { useMemo } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';

export const useUserTasks = () => {
  const { tasks } = useTaskContext();

  const processedTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Filter overdue tasks
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.due_date);
      return dueDate < today && task.status !== 'done' && task.status !== 'completed';
    }).map(task => ({
      ...task,
      // Map to expected format
      type: task.task_type?.name || 'Task',
      clientId: task.client_id,
      client: { name: 'Cliente' }, // Simplified for now
      dueDate: task.due_date,
      createdAt: task.created_at,
      assignee: task.assignee?.name || 'Não atribuído'
    }));

    // Filter today's tasks
    const todayTasks = tasks.filter(task => {
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate < tomorrow;
    }).map(task => ({
      ...task,
      // Map to expected format
      type: task.task_type?.name || 'Task',
      clientId: task.client_id,
      client: { name: 'Cliente' }, // Simplified for now
      dueDate: task.due_date,
      createdAt: task.created_at,
      assignee: task.assignee?.name || 'Não atribuído'
    }));

    return {
      overdueTasks,
      todayTasks
    };
  }, [tasks]);

  return {
    tasks: tasks.map(task => ({
      ...task,
      // Map snake_case to camelCase where needed for compatibility
      type: task.task_type?.name || 'Task',
      clientId: task.client_id,
      client: { name: 'Cliente' }, // Simplified for now
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      assignee: task.assignee?.name || 'Não atribuído'
    })) as any[],
    loading: false,
    error: null,
    overdueTasks: processedTasks.overdueTasks,
    todayTasks: processedTasks.todayTasks
  };
};
