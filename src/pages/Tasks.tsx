import React, { useState } from 'react';
import { Plus, Filter, Search, Calendar, Users, Tag, X } from 'lucide-react';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import { mockTasks, mockClients, mockProjects, mockTeamMembers } from '../data/mockData';
import { Task, TaskFilters } from '../types';

const Tasks = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Convert mock data to legacy format for compatibility
  const legacyTasks = mockTasks.map(task => ({
    ...task,
    assignee: mockTeamMembers.find(m => m.id === task.assigneeId)?.name || 'Não atribuído',
    client: mockClients.find(c => c.id === task.clientId)?.name || 'Sem cliente',
    project: mockProjects.find(p => p.id === task.projectId)?.name || 'Sem projeto'
  }));

  const [tasks, setTasks] = useState(legacyTasks);

  const handleCreateTask = (newTask: any) => {
    const task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      assignee: mockTeamMembers.find(m => m.id === newTask.assigneeId)?.name || 'Não atribuído',
      client: mockClients.find(c => c.id === newTask.clientId)?.name || 'Sem cliente',
      project: mockProjects.find(p => p.id === newTask.projectId)?.name || 'Sem projeto'
    };
    setTasks([...tasks, task]);
    setIsTaskModalOpen(false);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesAssignee = !filters.assigneeId || task.assigneeId === filters.assigneeId;
    const matchesClient = !filters.clientId || task.clientId === filters.clientId;
    const matchesProject = !filters.projectId || task.projectId === filters.projectId;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesClient && matchesProject;
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tarefas</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as tarefas em formato Kanban</p>
        </div>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Filtros Avançados</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select 
                        value={filters.status || ''}
                        onChange={(e) => setFilters({...filters, status: e.target.value || undefined})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todos</option>
                        <option value="todo">A fazer</option>
                        <option value="doing">Em andamento</option>
                        <option value="review">Em revisão</option>
                        <option value="done">Concluído</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Prioridade</label>
                      <select 
                        value={filters.priority || ''}
                        onChange={(e) => setFilters({...filters, priority: e.target.value || undefined})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todas</option>
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Responsável</label>
                      <select 
                        value={filters.assigneeId || ''}
                        onChange={(e) => setFilters({...filters, assigneeId: e.target.value || undefined})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todos</option>
                        {mockTeamMembers.map(member => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Cliente</label>
                      <select 
                        value={filters.clientId || ''}
                        onChange={(e) => setFilters({...filters, clientId: e.target.value || undefined})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todos</option>
                        {mockClients.map(client => (
                          <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Projeto</label>
                    <select 
                      value={filters.projectId || ''}
                      onChange={(e) => setFilters({...filters, projectId: e.target.value || undefined})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todos</option>
                      {mockProjects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <button
                      onClick={() => setFilters({})}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Limpar filtros
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-gray-500">Filtros ativos:</span>
          {filters.status && (
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-200 flex items-center space-x-1">
              <span>Status: {filters.status}</span>
              <button onClick={() => setFilters({...filters, status: undefined})}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.priority && (
            <span className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-md border border-orange-200 flex items-center space-x-1">
              <span>Prioridade: {filters.priority}</span>
              <button onClick={() => setFilters({...filters, priority: undefined})}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.assigneeId && (
            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md border border-green-200 flex items-center space-x-1">
              <span>Responsável: {mockTeamMembers.find(m => m.id === filters.assigneeId)?.name}</span>
              <button onClick={() => setFilters({...filters, assigneeId: undefined})}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.clientId && (
            <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md border border-purple-200 flex items-center space-x-1">
              <span>Cliente: {mockClients.find(c => c.id === filters.clientId)?.name}</span>
              <button onClick={() => setFilters({...filters, clientId: undefined})}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.projectId && (
            <span className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-md border border-pink-200 flex items-center space-x-1">
              <span>Projeto: {mockProjects.find(p => p.id === filters.projectId)?.name}</span>
              <button onClick={() => setFilters({...filters, projectId: undefined})}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Kanban Board */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <KanbanBoard 
          tasks={filteredTasks}
          onUpdateTask={handleUpdateTask}
        />
      </div>

      {/* Task Modal */}
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

export default Tasks;