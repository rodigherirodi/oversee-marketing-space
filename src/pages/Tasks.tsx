
import React, { useState } from 'react';
import { Plus, Filter, Calendar, List, LayoutGrid, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskListView } from '@/components/tasks/TaskListView';
import { TaskCalendarView } from '@/components/tasks/TaskCalendarView';
import { TaskModal } from '@/components/TaskModal';
import { TaskConfigDialog } from '@/components/tasks/TaskConfigDialog';
import { KanbanSelector } from '@/components/tasks/KanbanSelector';
import { TaskProvider, useTaskContext } from '@/contexts/TaskContext';

const TasksContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const { 
    tasks, 
    loading, 
    addTask, 
    updateTask, 
    deleteTask, 
    taskTypes, 
    currentKanban 
  } = useTaskContext();

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || 
                           (assigneeFilter === 'me' ? task.assignee?.name === 'Current User' : true);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsCreatingTask(true);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsCreatingTask(false);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask(taskId);
    }
  };

  const handleTaskSubmit = async (taskData: any) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      setIsCreatingTask(false);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setIsCreatingTask(false);
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    await updateTask(taskId, updates);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tarefas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas tarefas e acompanhe o progresso dos projetos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsConfigDialogOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button onClick={handleNewTask}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Kanban Selector */}
      <KanbanSelector />

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              {currentKanban?.stages?.map(stage => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="me">Minhas Tarefas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Views */}
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <KanbanBoard 
            tasks={filteredTasks as any}
            onUpdateTask={handleUpdateTask}
            onEditTask={handleEditTask}
            kanbanConfig={currentKanban}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <TaskListView 
            tasks={filteredTasks as any}
            taskTypes={taskTypes}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <TaskCalendarView 
            tasks={filteredTasks as any}
            onEditTask={handleEditTask}
          />
        </TabsContent>
      </Tabs>

      {/* Task Modal */}
      <TaskModal
        editTask={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
      />

      {/* Task Configuration Dialog */}
      <TaskConfigDialog
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
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
