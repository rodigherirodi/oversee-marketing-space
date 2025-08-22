import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskDTO } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Clock, CheckSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TaskQuickForm from '@/components/project/TaskQuickForm';
import ChecklistTaskCard from '@/components/project/ChecklistTaskCard';
import { TaskModal } from '@/components/TaskModal';

interface ProjectChecklistProps {
  projectId: string;
}

const ProjectChecklist = ({ projectId }: ProjectChecklistProps) => {
  const { tasks, updateTask, deleteTask } = useTaskContext();
  const [showCompleted, setShowCompleted] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDTO | null>(null);

  // Filter tasks for this project
  const projectTasks = tasks.filter(task => task.projeto_id === projectId);
  
  // Separate completed and pending tasks
  const pendingTasks = projectTasks.filter(task => task.status !== 'completed');
  const completedTasks = projectTasks.filter(task => task.status === 'completed');

  const completionRate = projectTasks.length > 0 
    ? Math.round((completedTasks.length / projectTasks.length) * 100) 
    : 0;

  const handleToggleStatus = async (taskId: string, completed: boolean) => {
    const newStatus = completed ? 'completed' : 'todo';
    await updateTask(taskId, { status: newStatus } as any);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask(taskId);
    }
  };

  const handleCreateTask = (data: any) => {
    // The data comes from TaskQuickForm, convert it properly
    const taskData = {
      titulo: data.title,
      descricao: data.description,
      status: data.status,
      prioridade: data.priority,
      data_entrega: data.dueDate ? new Date(data.dueDate) : undefined,
      projeto_id: projectId,
      responsavel: data.assignee,
      squad: data.squad,
      tipo: data.type,
      tags: data.tags || [],
    };

    // Create the task (this will be handled by the form)
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">
            Checklist do Projeto
          </h3>
          <Button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progresso: {completedTasks.length} de {projectTasks.length} tarefas</span>
            <span>{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
              id="show-completed"
            />
            <Label htmlFor="show-completed" className="text-sm">
              Mostrar concluídas ({completedTasks.length})
            </Label>
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      {isCreating && (
        <TaskQuickForm
          itemData={{ title: '', dueDate: '' }}
          projectId={projectId}
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pendentes ({pendingTasks.length})
          </h4>
          {pendingTasks
            .sort((a, b) => new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime())
            .map((task) => (
              <ChecklistTaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {showCompleted && completedTasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Concluídas ({completedTasks.length})
          </h4>
          {completedTasks.map((task) => (
            <ChecklistTaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {projectTasks.length === 0 && (
        <div className="text-center py-8">
          <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma tarefa criada
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando a primeira tarefa do projeto.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            Criar primeira tarefa
          </Button>
        </div>
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={async (data) => {
            await updateTask(editingTask.id, data as any);
            setEditingTask(null);
          }}
          editTask={editingTask}
        />
      )}
    </div>
  );
};

export default ProjectChecklist;
