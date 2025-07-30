
import React, { createContext, useContext, ReactNode } from 'react';
import { useTasks, Task } from '@/hooks/useTasks';
import { useTaskTypes, TaskType } from '@/hooks/useTaskTypes';
import { useKanbanConfigs, KanbanConfig } from '@/hooks/useKanbanConfigs';

interface TaskContextType {
  // Task operations
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Partial<Task>) => Promise<Task | undefined>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | undefined>;
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
  getTasksByKanban: (kanbanId: string) => Task[];
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
    refetch: refetchTasks 
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

  const getTasksByKanban = (kanbanId: string): Task[] => {
    if (kanbanId === 'geral' || kanbanId === 'all') {
      return tasks;
    }
    
    const kanban = kanbanConfigs.find(k => k.id === kanbanId);
    if (!kanban) return [];
    
    return tasks.filter(task => task.squad === kanban.department);
  };

  // Wrapper functions to match expected return types
  const addTask = async (task: Partial<Task>): Promise<Task | undefined> => {
    try {
      return await createTask(task);
    } catch (error) {
      return undefined;
    }
  };

  const updateTaskWrapper = async (id: string, updates: Partial<Task>): Promise<Task | undefined> => {
    try {
      return await updateTask(id, updates);
    } catch (error) {
      return undefined;
    }
  };

  // Combined loading state
  const loading = tasksLoading || kanbanLoading;

  // Show loading only during initial fetch
  if (loading && tasks.length === 0 && kanbanConfigs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
