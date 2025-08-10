
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
  assignee: { name: string };
  squad: string;
  client_id: string;
  client: { name: string };
  project_id?: string;
  project?: { name: string };
  due_date: string;
  dueDate: string;
  type: string;
  tags: string[];
  custom_fields: any;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  created_by: string;
  
  task_type?: {
    id: string;
    name: string;
    color: string;
    icon: string;
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
        .from('tarefas')
        .select(`
          *,
          profiles!tarefas_responsavel_fkey(name)
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;

      console.log('Raw data from tarefas with profiles:', data);

      const transformedTasks: Task[] = (data || []).map((task: any) => ({
        id: task.id,
        title: task.titulo,
        description: task.descricao || '',
        status: task.status,
        priority: task.prioridade,
        type_id: task.tipo_id || task.tipo || 'task',
        type: task.tipo || 'task',
        assignee_id: task.responsavel || '',
        assignee: { name: task.profiles?.name || 'Não atribuído' },
        squad: task.squad || 'operacao',
        client_id: task.cliente || '',
        client: { name: task.cliente || 'Cliente não informado' },
        project_id: task.projeto,
        project: task.projeto ? { name: task.projeto } : undefined,
        due_date: task.data_entrega || '',
        dueDate: task.data_entrega || '',
        tags: task.tags || [],
        custom_fields: task.campos_customizados || {},
        created_at: task.criado_em,
        updated_at: task.atualizado_em,
        completed_at: task.concluido_em,
        created_by: task.criado_por || '',
        watchers: [],
        comments: [],
        attachments: []
      }));

      console.log('Transformed tasks:', transformedTasks);
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

  const createTask = async (taskData: Partial<Task>): Promise<Task | undefined> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const validStatus = taskData.status === 'todo' || taskData.status === 'in_progress' || 
                         taskData.status === 'review' || taskData.status === 'completed' || 
                         taskData.status === 'cancelled' ? taskData.status : 'todo';

      const { data, error } = await supabase
        .from('tarefas')
        .insert({
          titulo: taskData.title,
          descricao: taskData.description,
          status: validStatus,
          prioridade: taskData.priority || 'medium',
          responsavel: taskData.assignee_id,
          cliente: taskData.client_id || taskData.client?.name,
          projeto: taskData.project_id || taskData.project?.name,
          data_entrega: taskData.due_date || taskData.dueDate,
          squad: taskData.squad || 'operacao',
          tipo_id: taskData.type_id,
          tipo: taskData.type_id || taskData.type || 'task',
          tags: taskData.tags || [],
          campos_customizados: taskData.custom_fields || {},
          criado_por: user.id
        })
        .select(`
          *,
          profiles!tarefas_responsavel_fkey(name)
        `)
        .single();

      if (error) throw error;

      const transformedTask: Task = {
        id: data.id,
        title: data.titulo,
        description: data.descricao || '',
        status: data.status,
        priority: data.prioridade,
        type_id: data.tipo_id || data.tipo || 'task',
        type: data.tipo || 'task',
        assignee_id: data.responsavel || '',
        assignee: { name: data.profiles?.name || 'Não atribuído' },
        squad: data.squad || 'operacao',
        client_id: data.cliente || '',
        client: { name: data.cliente || 'Cliente não informado' },
        project_id: data.projeto,
        project: data.projeto ? { name: data.projeto } : undefined,
        due_date: data.data_entrega || '',
        dueDate: data.data_entrega || '',
        tags: data.tags || [],
        custom_fields: data.campos_customizados || {},
        created_at: data.criado_em,
        updated_at: data.atualizado_em,
        completed_at: data.concluido_em,
        created_by: data.criado_por || '',
        watchers: [],
        comments: [],
        attachments: []
      };

      setTasks(prev => [transformedTask, ...prev]);
      toast.success('Tarefa criada com sucesso');
      return transformedTask;
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Erro ao criar tarefa');
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task | undefined> => {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.titulo = updates.title;
      if (updates.description !== undefined) updateData.descricao = updates.description;
      if (updates.status !== undefined) {
        const validStatus = updates.status === 'todo' || updates.status === 'in_progress' || 
                           updates.status === 'review' || updates.status === 'completed' || 
                           updates.status === 'cancelled' ? updates.status : 'todo';
        updateData.status = validStatus;
      }
      if (updates.priority !== undefined) updateData.prioridade = updates.priority;
      if (updates.assignee_id !== undefined) {
        updateData.responsavel = updates.assignee_id;
      }
      if (updates.client_id !== undefined || updates.client?.name !== undefined) {
        updateData.cliente = updates.client_id || updates.client?.name;
      }
      if (updates.project_id !== undefined || updates.project?.name !== undefined) {
        updateData.projeto = updates.project_id || updates.project?.name;
      }
      if (updates.due_date !== undefined || updates.dueDate !== undefined) {
        updateData.data_entrega = updates.due_date || updates.dueDate;
      }
      if (updates.squad !== undefined) updateData.squad = updates.squad;
      if (updates.type_id !== undefined) {
        updateData.tipo_id = updates.type_id;
        updateData.tipo = updates.type_id;
      }
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.custom_fields !== undefined) updateData.campos_customizados = updates.custom_fields;

      const { data, error } = await supabase
        .from('tarefas')
        .update(updateData)
        .eq('id', taskId)
        .select(`
          *,
          profiles!tarefas_responsavel_fkey(name)
        `)
        .single();

      if (error) throw error;

      const transformedTask: Task = {
        id: data.id,
        title: data.titulo,
        description: data.descricao || '',
        status: data.status,
        priority: data.prioridade,
        type_id: data.tipo_id || data.tipo || 'task',
        type: data.tipo || 'task',
        assignee_id: data.responsavel || '',
        assignee: { name: data.profiles?.name || 'Não atribuído' },
        squad: data.squad || 'operacao',
        client_id: data.cliente || '',
        client: { name: data.cliente || 'Cliente não informado' },
        project_id: data.projeto,
        project: data.projeto ? { name: data.projeto } : undefined,
        due_date: data.data_entrega || '',
        dueDate: data.data_entrega || '',
        tags: data.tags || [],
        custom_fields: data.campos_customizados || {},
        created_at: data.criado_em,
        updated_at: data.atualizado_em,
        completed_at: data.concluido_em,
        created_by: data.criado_por || '',
        watchers: [],
        comments: [],
        attachments: []
      };

      setTasks(prev => prev.map(task => 
        task.id === taskId ? transformedTask : task
      ));
      toast.success('Tarefa atualizada com sucesso');
      return transformedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Erro ao atualizar tarefa');
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tarefas')
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
