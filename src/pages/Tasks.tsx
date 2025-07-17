import React, { useState } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { tasks } from '@/data/mockData';
import { Task } from '@/types/entities';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Tasks = () => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const filterTasks = () => {
    let results = tasks;

    if (searchTerm) {
      results = results.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClient) {
      results = results.filter(task => task.client === selectedClient);
    }

    if (selectedProject) {
      results = results.filter(task => task.project === selectedProject);
    }

    if (selectedStatus) {
      results = results.filter(task => task.status === selectedStatus);
    }

    if (selectedPriority) {
      results = results.filter(task => task.priority === selectedPriority);
    }

    setFilteredTasks(results);
  };

  React.useEffect(() => {
    filterTasks();
  }, [searchTerm, selectedClient, selectedProject, selectedStatus, selectedPriority]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">Gerencie todas as suas tarefas no Kanban</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os clientes</option>
          <option value="cliente-a">Cliente A</option>
          <option value="cliente-b">Cliente B</option>
        </select>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os projetos</option>
          <option value="projeto-website">Website Institucional</option>
          <option value="projeto-app">App Mobile</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="todo">A Fazer</option>
          <option value="in-progress">Em Progresso</option>
          <option value="review">Em Revisão</option>
          <option value="done">Concluído</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </div>

      <KanbanBoard tasks={filteredTasks} />
    </div>
  );
};

export default Tasks;
