
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Projects from '../pages/Projects';
import Clients from '../pages/Clients';
import Commercial from '../pages/Commercial';

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

const MainLayout = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('Cliente A');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'projects':
        return <Projects />;
      case 'clients':
        return <Clients />;
      case 'commercial':
        return <Commercial />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        selectedWorkspace={selectedWorkspace}
        onWorkspaceChange={setSelectedWorkspace}
      />
      
      <div className="flex-1 flex flex-col">
        <Header onNewTask={() => {}} />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
