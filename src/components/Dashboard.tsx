
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';

const Dashboard = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('Cliente A');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        selectedWorkspace={selectedWorkspace}
        onWorkspaceChange={setSelectedWorkspace}
      />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Bem-vindo ao Oversee
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Sua plataforma de gestão de projetos e relacionamento com clientes
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tarefas</h3>
                  <p className="text-gray-600">Gerencie todas as suas tarefas no Kanban</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Projetos</h3>
                  <p className="text-gray-600">Acompanhe o progresso de todos os projetos</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Clientes</h3>
                  <p className="text-gray-600">Mantenha o relacionamento com seus clientes</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
