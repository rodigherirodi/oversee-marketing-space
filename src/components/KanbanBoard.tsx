
import React from 'react';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: any[];
  onUpdateTask: (taskId: string, updates: any) => void;
  onEditTask: (task: any) => void;
  kanbanConfig: any | null;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  tasks, 
  onUpdateTask, 
  onEditTask, 
  kanbanConfig 
}) => {
  if (!kanbanConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando kanban...</p>
      </div>
    );
  }

  const columns = kanbanConfig.stages
    .sort((a: any, b: any) => a.order_position - b.order_position)
    .map((stage: any) => ({
      id: stage.id,
      title: stage.name,
      color: `border-t-4`,
      borderColor: stage.color,
      count: tasks.filter(task => task.status === stage.id).length
    }));

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onUpdateTask(taskId, { status });
  };

  return (
    <div className="flex space-x-6 h-full overflow-x-auto pb-6">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div 
            className={`bg-white rounded-lg ${column.color} p-4 mb-4 shadow-sm`}
            style={{ borderTopColor: column.borderColor }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{column.title}</h3>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {column.count}
              </span>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-3 min-h-96">
            {tasks
              .filter(task => task.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="cursor-move"
                >
                  <TaskCard 
                    task={task} 
                    onUpdate={onUpdateTask}
                    onEdit={onEditTask}
                  />
                </div>
              ))}
            
            {/* Empty State */}
            {tasks.filter(task => task.status === column.id).length === 0 && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-sm">Nenhuma tarefa</p>
                <p className="text-gray-400 text-xs">Arraste tarefas aqui</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
