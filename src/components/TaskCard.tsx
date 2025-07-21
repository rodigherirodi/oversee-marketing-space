
import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  AlertCircle, 
  Clock,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Building,
  FolderOpen
} from 'lucide-react';
import { Task, TaskType } from '../types/entities';
import { useTaskContext } from '@/contexts/TaskContext';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onEdit }) => {
  const { taskTypes } = useTaskContext();
  const [showDetails, setShowDetails] = useState(false);

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  };

  const getTaskType = (typeId: string) => taskTypes.find(type => type.id === typeId);
  const taskType = getTaskType(task.type);

  const isOverdue = new Date(task.dueDate) < new Date();
  const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleCardClick = () => {
    onEdit(task);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h4>
        <button 
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Task Type */}
      {taskType && (
        <div className="mb-3">
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border"
            style={{
              backgroundColor: `${taskType.color}20`,
              borderColor: `${taskType.color}40`,
              color: taskType.color
            }}
          >
            <span>{taskType.icon}</span>
            <span>{taskType.name}</span>
          </span>
        </div>
      )}

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-200"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-gray-500 text-xs">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Priority and Due Date */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded-md border ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        
        <div className={`flex items-center space-x-1 text-xs ${
          isOverdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-gray-500'
        }`}>
          <Calendar className="w-3 h-3" />
          <span>
            {daysUntilDue === 0 ? 'Hoje' : 
             daysUntilDue === 1 ? 'Amanhã' : 
             daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d atrasado` :
             `${daysUntilDue}d`}
          </span>
        </div>
      </div>

      {/* Client and Project */}
      <div className="text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-1 mb-1">
          <Building className="w-3 h-3" />
          <span className="truncate">{task.client.name}</span>
        </div>
        {task.project && (
          <div className="flex items-center space-x-1">
            <FolderOpen className="w-3 h-3" />
            <span className="truncate">{task.project.name}</span>
          </div>
        )}
      </div>

      {/* Squad */}
      <div className="mb-3">
        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
          {task.squad}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {task.assignee.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-xs text-gray-600 truncate max-w-20">
            {task.assignee.split(' ')[0]}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button 
            className="text-gray-400 hover:text-gray-600 p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageSquare className="w-3 h-3" />
            {task.comments.length > 0 && (
              <span className="text-xs">{task.comments.length}</span>
            )}
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Paperclip className="w-3 h-3" />
            {task.attachments.length > 0 && (
              <span className="text-xs">{task.attachments.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Progress indicator for tasks in progress */}
      {task.status === 'doing' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progresso</span>
            <span>65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};
