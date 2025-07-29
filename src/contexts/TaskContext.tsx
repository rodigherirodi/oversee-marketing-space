
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskType, KanbanConfig, TaskStage } from '@/types/entities';
import { mockTasks, mockTaskTypes, mockKanbanConfigs } from '@/data/mockData';

interface TaskContextType {
  tasks: Task[];
  taskTypes: TaskType[];
  kanbanConfigs: KanbanConfig[];
  currentKanban: KanbanConfig;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setCurrentKanban: (kanban: KanbanConfig) => void;
  addTaskType: (taskType: Omit<TaskType, 'id'>) => void;
  updateKanbanConfig: (id: string, updates: Partial<KanbanConfig>) => void;
  addKanbanConfig: (kanban: Omit<KanbanConfig, 'id'>) => void;
  deleteKanbanConfig: (id: string) => void;
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

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [kanbanConfigs, setKanbanConfigs] = useState<KanbanConfig[]>([]);
  const [currentKanban, setCurrentKanban] = useState<KanbanConfig | null>(null);

  // Initialize with mock data
  useEffect(() => {
    setTasks(mockTasks);
    setTaskTypes(mockTaskTypes);
    setKanbanConfigs(mockKanbanConfigs);
    setCurrentKanban(mockKanbanConfigs[0]);
    
    console.log('TaskContext initialized with mock data:', {
      tasks: mockTasks.length,
      taskTypes: mockTaskTypes.length,
      kanbanConfigs: mockKanbanConfigs.length
    });
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      comments: [],
      attachments: [],
      customFields: {},
      watchers: taskData.watchers || [],
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addTaskType = (taskTypeData: Omit<TaskType, 'id'>) => {
    const newTaskType: TaskType = {
      ...taskTypeData,
      id: `type-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTaskTypes(prev => [...prev, newTaskType]);
  };

  const updateKanbanConfig = (id: string, updates: Partial<KanbanConfig>) => {
    setKanbanConfigs(prev =>
      prev.map(config =>
        config.id === id ? { ...config, ...updates } : config
      )
    );
    
    // Update currentKanban if it's the one being updated
    if (currentKanban?.id === id) {
      setCurrentKanban(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addKanbanConfig = (kanbanData: Omit<KanbanConfig, 'id'>) => {
    const newKanban: KanbanConfig = {
      ...kanbanData,
      id: `kanban-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setKanbanConfigs(prev => [...prev, newKanban]);
  };

  const deleteKanbanConfig = (id: string) => {
    if (id === 'geral') return; // Don't allow deleting the general kanban
    
    setKanbanConfigs(prev => prev.filter(config => config.id !== id));
    
    // If deleting the current kanban, switch to general
    if (currentKanban?.id === id) {
      setCurrentKanban(kanbanConfigs.find(k => k.id === 'geral') || kanbanConfigs[0]);
    }
  };

  const getTasksByKanban = (kanbanId: string) => {
    if (kanbanId === 'geral') {
      return tasks;
    }
    
    const kanban = kanbanConfigs.find(k => k.id === kanbanId);
    if (!kanban) return [];
    
    return tasks.filter(task => task.squad === kanban.department);
  };

  // Don't render until we have the current kanban
  if (!currentKanban) {
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
        taskTypes,
        kanbanConfigs,
        currentKanban,
        addTask,
        updateTask,
        deleteTask,
        setCurrentKanban,
        addTaskType,
        updateKanbanConfig,
        addKanbanConfig,
        deleteKanbanConfig,
        getTasksByKanban,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
