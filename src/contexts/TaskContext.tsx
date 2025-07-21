
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
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>(mockTaskTypes);
  const [kanbanConfigs, setKanbanConfigs] = useState<KanbanConfig[]>(mockKanbanConfigs);
  const [currentKanban, setCurrentKanban] = useState<KanbanConfig>(mockKanbanConfigs[0]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      comments: [],
      attachments: [],
      customFields: {},
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
  };

  const getTasksByKanban = (kanbanId: string) => {
    if (kanbanId === 'geral') {
      return tasks;
    }
    
    const kanban = kanbanConfigs.find(k => k.id === kanbanId);
    if (!kanban) return [];
    
    return tasks.filter(task => task.squad === kanban.department);
  };

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
        getTasksByKanban,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
