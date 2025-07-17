
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { KanbanBoard } from './KanbanBoard';
import { TaskModal } from './TaskModal';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  client: string;
  project: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
}

const Dashboard = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Cliente A');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Criação de landing page',
      description: 'Desenvolver landing page para campanha de Black Friday',
      status: 'doing',
      priority: 'high',
      assignee: 'Ana Silva',
      client: 'Cliente A',
      project: 'Campanha Black Friday',
      dueDate: '2025-07-20',
      tags: ['design', 'desenvolvimento', 'urgente'],
      createdAt: '2025-07-10'
    },
    {
      id: '2',
      title: 'Análise de métricas',
      description: 'Relatório mensal de performance das campanhas',
      status: 'todo',
      priority: 'medium',
      assignee: 'Carlos Mendes',
      client: 'Cliente B',
      project: 'Relatórios Mensais',
      dueDate: '2025-07-25',
      tags: ['análise', 'relatório'],
      createdAt: '2025-07-12'
    },
    {
      id: '3',
      title: 'Copy para social media',
      description: 'Criação de copies para posts da semana',
      status: 'review',
      priority: 'medium',
      assignee: 'Marina Costa',
      client: 'Cliente A',
      project: 'Social Media',
      dueDate: '2025-07-18',
      tags: ['copywriting', 'social'],
      createdAt: '2025-07-08'
    }
  ]);

  const handleCreateTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, task]);
    setIsTaskModalOpen(false);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        selectedWorkspace={selectedWorkspace}
        onWorkspaceChange={setSelectedWorkspace}
      />
      
      <div className="flex-1 flex flex-col">
        <Header onNewTask={() => setIsTaskModalOpen(true)} />
        
        <main className="flex-1 p-6 overflow-auto">
          <KanbanBoard 
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
          />
        </main>
      </div>

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
