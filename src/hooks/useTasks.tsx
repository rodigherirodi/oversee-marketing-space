
import { useState, useEffect } from 'react';
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
      
      // Mock data until database is properly set up
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Implementar sistema de login',
          description: 'Criar tela de login com validação e integração com Supabase',
          status: 'todo',
          priority: 'high',
          type_id: 'feature',
          assignee_id: 'user1',
          squad: 'operacao',
          client_id: 'client1',
          due_date: '2025-02-15',
          tags: ['frontend', 'auth'],
          custom_fields: {},
          created_at: '2025-01-31T10:00:00Z',
          updated_at: '2025-01-31T10:00:00Z',
          created_by: 'user1',
          task_type: {
            id: 'feature',
            name: 'Funcionalidade',
            color: '#10B981',
            icon: '⭐'
          },
          assignee: {
            id: 'user1',
            name: 'João Silva',
            email: 'joao@empresa.com'
          },
          watchers: [],
          comments: [],
          attachments: []
        },
        {
          id: '2',
          title: 'Corrigir bug na listagem de tarefas',
          description: 'O filtro por status não está funcionando corretamente',
          status: 'doing',
          priority: 'medium',
          type_id: 'bug',
          assignee_id: 'user2',
          squad: 'operacao',
          client_id: 'client1',
          due_date: '2025-02-10',
          tags: ['bug', 'frontend'],
          custom_fields: {},
          created_at: '2025-01-30T14:30:00Z',
          updated_at: '2025-01-31T09:15:00Z',
          created_by: 'user2',
          task_type: {
            id: 'bug',
            name: 'Bug',
            color: '#EF4444',
            icon: '🐛'
          },
          assignee: {
            id: 'user2',
            name: 'Maria Santos',
            email: 'maria@empresa.com'
          },
          watchers: [],
          comments: [],
          attachments: []
        }
      ];

      setTasks(mockTasks);
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
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        type_id: taskData.type_id || 'task',
        assignee_id: taskData.assignee_id || '',
        squad: taskData.squad || 'Geral',
        client_id: taskData.client_id || '',
        project_id: taskData.project_id,
        due_date: taskData.due_date || new Date().toISOString().split('T')[0],
        tags: taskData.tags || [],
        custom_fields: taskData.custom_fields || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current-user',
        watchers: [],
        comments: [],
        attachments: []
      };

      setTasks(prev => [newTask, ...prev]);
      toast.success('Tarefa criada com sucesso');
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Erro ao criar tarefa');
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task | undefined> => {
    try {
      const updatedTask = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ));
      
      const task = tasks.find(t => t.id === taskId);
      toast.success('Tarefa atualizada com sucesso');
      return task ? { ...task, ...updatedTask } : undefined;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Erro ao atualizar tarefa');
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
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
