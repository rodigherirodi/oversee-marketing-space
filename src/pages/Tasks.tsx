
import React, { useState } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskListView } from '@/components/tasks/TaskListView';
import { TaskCalendarView } from '@/components/tasks/TaskCalendarView';
import { KanbanSelector } from '@/components/tasks/KanbanSelector';
import { TaskConfigDialog } from '@/components/tasks/TaskConfigDialog';
import { TaskModal } from '@/components/TaskModal';
import { TaskProvider, useTaskContext } from '@/contexts/TaskContext';
import { mockClients, mockProjects, mockTeamMembers } from '@/data/mockData';
import { Task } from '@/types/entities';
import { Search, Filter, Plus, List, Calendar, Kanban, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ViewMode = 'kanban' | 'list' | 'calendar';

const TasksContent = () => {
  const { 
    tasks, 
    taskTypes, 
    currentKanban, 
    addTask, 
    updateTask, 
    deleteTask, 
    getTasksByKanban 
  } = useTaskContext();
  
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedSquad, setSelectedSquad] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Get filtered tasks
  const getFilteredTasks = () => {
    let results = getTasksByKanban(currentKanban.id);

    if (searchTerm) {
      results = results.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClient) {
      results = results.filter(task => task.clientId === selectedClient);
    }

    if (selectedProject) {
      results = results.filter(task => task.projectId === selectedProject);
    }

    if (selectedAssignee) {
      results = results.filter(task => task.assignee === selectedAssignee);
    }

    if (selectedSquad) {
      results = results.filter(task => task.squad === selectedSquad);
    }

    if (selectedType) {
      results = results.filter(task => task.type === selectedType);
    }

    if (selectedPriority) {
      results = results.filter(task => task.priority === selectedPriority);
    }

    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      results = results.filter(task => {
        const dueDate = new Date(task.dueDate);
        const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        
        switch (dateFilter) {
          case 'today':
            return taskDate.getTime() === today.getTime();
          case 'week':
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            return taskDate >= today && taskDate <= weekEnd;
          case 'overdue':
            return taskDate < today;
          default:
            return true;
        }
      });
    }

    return results;
  };

  const filteredTasks = getFilteredTasks();

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(taskData);
    setIsTaskModalOpen(false);
  };

  const handleUpdateTask = (taskData: Task) => {
    updateTask(taskData.id, taskData);
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTask(taskId);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClient('');
    setSelectedProject('');
    setSelectedAssignee('');
    setSelectedSquad('');
    setSelectedType('');
    setSelectedPriority('');
    setDateFilter('');
  };

  const activeFiltersCount = [
    searchTerm,
    selectedClient,
    selectedProject,
    selectedAssignee,
    selectedSquad,
    selectedType,
    selectedPriority,
    dateFilter
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">Gerencie todas as suas tarefas</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsConfigModalOpen(true)}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button onClick={() => setIsTaskModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-4">
          <KanbanSelector />
          
          {/* View Mode Selector */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <Kanban className="w-4 h-4 mr-1" />
              Kanban
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Calendário
            </Button>
          </div>
        </div>

        {/* Task Count and Filters Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''}
          </span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" onClick={clearFilters} className="cursor-pointer">
              {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
        {/* Search */}
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

        {/* Type Filter */}
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            {taskTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span>{type.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Assignee Filter */}
        <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos os responsáveis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os responsáveis</SelectItem>
            {mockTeamMembers.map((member) => (
              <SelectItem key={member.id} value={member.name}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Squad Filter */}
        <Select value={selectedSquad} onValueChange={setSelectedSquad}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos os squads" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os squads</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Tecnologia">Tecnologia</SelectItem>
            <SelectItem value="Conteúdo">Conteúdo</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Análise">Análise</SelectItem>
            <SelectItem value="Gestão">Gestão</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas as prioridades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as prioridades</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as datas</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="overdue">Em atraso</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Content based on view mode */}
      {viewMode === 'kanban' && (
        <KanbanBoard 
          tasks={filteredTasks} 
          onUpdateTask={updateTask}
          onEditTask={handleEditTask}
          kanbanConfig={currentKanban}
        />
      )}

      {viewMode === 'list' && (
        <TaskListView
          tasks={filteredTasks}
          taskTypes={taskTypes}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {viewMode === 'calendar' && (
        <TaskCalendarView
          tasks={filteredTasks}
          onEditTask={handleEditTask}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        clients={mockClients}
        projects={mockProjects}
        editTask={editingTask}
      />

      {/* Config Modal */}
      <TaskConfigDialog
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
};

const Tasks = () => {
  return (
    <TaskProvider>
      <TasksContent />
    </TaskProvider>
  );
};

export default Tasks;
