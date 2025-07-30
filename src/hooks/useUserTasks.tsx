
import { useMemo } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task as FrontendTask } from '@/types/entities';

export const useUserTasks = () => {
  const { tasks } = useTaskContext();

  const processedTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Map database tasks to frontend format
    const mapToFrontendTask = (task: any): FrontendTask => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      type: task.task_type?.name || 'Task',
      assignee: task.assignee?.name || 'Não atribuído',
      watchers: [],
      squad: task.squad || '',
      clientId: task.client_id || '',
      client: { 
        id: task.client_id || '',
        name: 'Cliente',
        segment: '',
        status: 'active' as const,
        size: 'PME' as const,
        address: '',
        primaryContact: { name: '', phone: '', email: '' },
        financialContact: { name: '', phone: '', email: '' },
        socialMedia: {},
        contractType: 'recurring' as const,
        temperature: 'warm' as const,
        entryDate: '',
        responsibleManager: '',
        createdAt: ''
      },
      projectId: task.project_id,
      dueDate: task.due_date,
      tags: task.tags || [],
      createdAt: task.created_at,
      comments: [],
      attachments: [],
      customFields: task.custom_fields || {},
      completedAt: task.completed_at
    });

    // Filter overdue tasks
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.due_date);
      return dueDate < today && task.status !== 'done' && task.status !== 'completed';
    }).map(mapToFrontendTask);

    // Filter today's tasks
    const todayTasks = tasks.filter(task => {
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate < tomorrow;
    }).map(mapToFrontendTask);

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
