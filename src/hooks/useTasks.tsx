
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  type_id: string;
  assignee_id: string;
  squad: string;
  client_id: string;
  project_id?: string;
  due_date: string;
  tags: string[];
  custom_fields: any;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  created_by: string;
  
  // Joined data
  task_type?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  watchers?: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  comments?: Array<{
    id: string;
    content: string;
    author_id: string;
    created_at: string;
    author: {
      name: string;
      avatar?: string;
    };
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    file_type: string;
    file_size: number;
    uploaded_by: string;
    uploaded_at: string;
  }>;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_type:task_types(id, name, color, icon),
          assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar),
          watchers:task_watchers(
            user:profiles(id, name, email, avatar)
          ),
          comments:task_comments(
            id, content, author_id, created_at,
            author:profiles(name, avatar)
          ),
          attachments:task_attachments(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedTasks = data?.map(task => ({
        ...task,
        watchers: task.watchers?.map((w: any) => w.user) || [],
        comments: task.comments || [],
        attachments: task.attachments || []
      })) || [];

      setTasks(transformedTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Error fetching tasks');
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          created_by: user.id
        }])
        .select(`
          *,
          task_type:task_types(id, name, color, icon),
          assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar)
        `)
        .single();

      if (error) throw error;

      setTasks(prev => [data, ...prev]);
      toast.success('Tarefa criada com sucesso');
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Erro ao criar tarefa');
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select(`
          *,
          task_type:task_types(id, name, color, icon),
          assignee:profiles!tasks_assignee_id_fkey(id, name, email, avatar)
        `)
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...data } : task
      ));
      toast.success('Tarefa atualizada com sucesso');
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Erro ao atualizar tarefa');
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Tarefa excluída com sucesso');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Erro ao excluir tarefa');
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};
