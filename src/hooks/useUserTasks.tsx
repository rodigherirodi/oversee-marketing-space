
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types/entities';

export const useUserTasks = (userName: string) => {
  const { tasks } = useTaskContext();
  
  const userTasks = tasks.filter(task => task.assignee === userName);
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const overdueTasks = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'completed';
  });
  
  const todayTasks = userTasks.filter(task => {
    return task.dueDate === todayStr && task.status !== 'completed';
  });
  
  const tasksByPriority = userTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });
  
  const completedTasks = userTasks.filter(task => task.status === 'completed').length;
  const openTasks = userTasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = userTasks.filter(task => task.status === 'in-progress').length;
  
  return {
    userTasks,
    overdueTasks,
    todayTasks,
    tasksByPriority,
    completedTasks,
    openTasks,
    inProgressTasks,
    totalTasks: userTasks.length
  };
};
