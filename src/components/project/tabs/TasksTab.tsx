
import React, { useState } from 'react';
import { Project } from '@/types/entities';
import { KanbanBoard } from '@/components/KanbanBoard';
import { mockTasks } from '@/data/mockData';
import { Task } from '@/types/entities';
import { Plus, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TasksTabProps {
  project: Project;
}

const TasksTab: React.FC<TasksTabProps> = ({ project }) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [projectTasks, setProjectTasks] = useState<Task[]>(
    mockTasks.filter(task => task.projectId === project.id)
  );

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setProjectTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tarefas do Projeto</h2>
          <p className="text-gray-600">{projectTasks.length} tarefas encontradas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button 
              variant={viewMode === 'kanban' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('kanban')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard tasks={projectTasks} onUpdateTask={handleUpdateTask} />
      ) : (
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarefa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectTasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'done' ? 'bg-green-100 text-green-700' :
                        task.status === 'doing' ? 'bg-blue-100 text-blue-700' :
                        task.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status === 'todo' ? 'A Fazer' :
                         task.status === 'doing' ? 'Em Progresso' :
                         task.status === 'review' ? 'Em Revisão' : 'Concluído'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.assignee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority === 'high' ? 'Alta' :
                         task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTab;
