
import React, { createContext, useContext, ReactNode } from 'react';
import { useTasks, TaskDTO } from '@/hooks/useTasks';
import { useTaskTypes, TaskType } from '@/hooks/useTaskTypes';
import { useKanbanConfigs, KanbanConfig } from '@/hooks/useKanbanConfigs';
import { TaskFormData } from '@/types/database';

interface TaskContextType {
  // Task operations
  tasks: TaskDTO[];
  loading: boolean;
  error: string | null;
  addTask: (task: Partial<TaskDTO>) => Promise<TaskDTO | undefined>;
  updateTask: (id: string, updates: Partial<TaskDTO>) => Promise<TaskDTO | undefined>;
  deleteTask: (id: string) => Promise<void>;
  refetchTasks: () => Promise<void>;
  
  // Task types
  taskTypes: TaskType[];
  addTaskType: (taskType: Omit<TaskType, 'id'>) => Promise<TaskType | undefined>;
  
  // Kanban operations
  kanbanConfigs: KanbanConfig[];
  currentKanban: KanbanConfig | null;
  setCurrentKanban: (kanban: KanbanConfig) => void;
  addKanbanConfig: (kanban: Omit<KanbanConfig, 'id' | 'stages'>) => Promise<KanbanConfig | undefined>;
  updateKanbanConfig: (id: string, updates: Partial<KanbanConfig>) => Promise<void>;
  deleteKanbanConfig: (id: string) => Promise<void>;
  
  // Utility functions
  getTasksByKanban: (kanbanId: string) => TaskDTO[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    tasks, 
    loading: tasksLoading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask, 
    refetch 
  } = useTasks();
  
  const { taskTypes, addTaskType } = useTaskTypes();
  
  const { 
    kanbanConfigs, 
    currentKanban, 
    setCurrentKanban,
    loading: kanbanLoading,
    addKanbanConfig,
    updateKanbanConfig,
    deleteKanbanConfig
  } = useKanbanConfigs();

  const getTasksByKanban = (kanbanId: string): TaskDTO[] => {
    if (kanbanId === 'geral' || kanbanId === 'all') {
      return tasks;
    }
    
    const kanban = kanbanConfigs.find(k => k.id === kanbanId);
    if (!kanban) return [];
    
    return tasks.filter(task => task.squad === kanban.department);
  };

  // Wrapper functions to match expected return types with proper type conversion
  const addTask = async (task: Partial<TaskDTO>): Promise<TaskDTO | undefined> => {
    try {
      // Convert TaskDTO to TaskFormData
      const taskFormData = {
        titulo: task.titulo || '',
        descricao: task.descricao,
        status: task.status || 'todo',
        prioridade: task.prioridade || 'medium',
        data_entrega: task.data_entrega ? new Date(task.data_entrega) : undefined,
        projeto_id: task.projeto_id,
        cliente_id: task.cliente_id,
        responsavel: task.responsavel || '',
        squad: task.squad || 'operacao',
        tipo: task.tipo || 'task',
        tags: task.tags || [],
      };
      return await createTask(taskFormData);
    } catch (error) {
      return undefined;
    }
  };

  const updateTaskWrapper = async (id: string, updates: Partial<TaskDTO>): Promise<TaskDTO | undefined> => {
    try {
      // Convert TaskDTO updates to TaskFormData
      const taskFormData: Partial<TaskFormData> = {};
      if (updates.titulo !== undefined) taskFormData.titulo = updates.titulo;
      if (updates.descricao !== undefined) taskFormData.descricao = updates.descricao;
      if (updates.status !== undefined) taskFormData.status = updates.status;
      if (updates.prioridade !== undefined) taskFormData.prioridade = updates.prioridade;
      if (updates.data_entrega !== undefined) taskFormData.data_entrega = new Date(updates.data_entrega);
      if (updates.projeto_id !== undefined) taskFormData.projeto_id = updates.projeto_id;
      if (updates.cliente_id !== undefined) taskFormData.cliente_id = updates.cliente_id;
      if (updates.responsavel !== undefined) taskFormData.responsavel = updates.responsavel;
      if (updates.squad !== undefined) taskFormData.squad = updates.squad;
      if (updates.tipo !== undefined) taskFormData.tipo = updates.tipo;
      if (updates.tags !== undefined) taskFormData.tags = updates.tags;
      
      return await updateTask(id, taskFormData);
    } catch (error) {
      return undefined;
    }
  };

  // Fix refetchTasks to return void
  const refetchTasks = async (): Promise<void> => {
    await refetch();
  };

  // Combined loading state
  const loading = tasksLoading || kanbanLoading;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        addTask,
        updateTask: updateTaskWrapper,
        deleteTask,
        refetchTasks,
        taskTypes,
        addTaskType,
        kanbanConfigs,
        currentKanban,
        setCurrentKanban,
        addKanbanConfig,
        updateKanbanConfig,
        deleteKanbanConfig,
        getTasksByKanban,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
