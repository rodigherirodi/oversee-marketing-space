
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link, ExternalLink, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/hooks/useTasks';
import TaskLinkSelector from './TaskLinkSelector';
import TaskQuickForm from './TaskQuickForm';
import ChecklistTaskCard from './ChecklistTaskCard';

interface ChecklistItem {
  id: number;
  task: string;
  completed: boolean;
  date: string;
  taskId?: string;
  taskStatus?: string;
  isLinked: boolean;
  lastSync?: string;
}

interface ProjectChecklistProps {
  checklist: ChecklistItem[];
  isEditing: boolean;
  onUpdate: (checklist: ChecklistItem[]) => void;
  projectId: string;
}

const ProjectChecklist = ({ checklist, isEditing, onUpdate, projectId }: ProjectChecklistProps) => {
  const { tasks, addTask: createTask, updateTask, getTasksByKanban } = useTaskContext();
  const [editedChecklist, setEditedChecklist] = useState(checklist);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [showTaskForm, setShowTaskForm] = useState<number | null>(null);
  const [showTaskSelector, setShowTaskSelector] = useState<number | null>(null);

  // Get project tasks
  const projectTasks = tasks.filter(task => task.project_id === projectId);

  // Sync checklist with task statuses
  useEffect(() => {
    const syncedChecklist = editedChecklist.map(item => {
      if (item.isLinked && item.taskId) {
        const linkedTask = tasks.find(task => task.id === item.taskId);
        if (linkedTask) {
          return {
            ...item,
            taskStatus: linkedTask.status,
            completed: linkedTask.status === 'done' || linkedTask.status === 'completed',
            lastSync: new Date().toISOString()
          };
        }
      }
      return item;
    });
    
    if (JSON.stringify(syncedChecklist) !== JSON.stringify(editedChecklist)) {
      setEditedChecklist(syncedChecklist);
      onUpdate(syncedChecklist);
    }
  }, [tasks, editedChecklist, onUpdate]);

  const toggleChecklistItem = (id: number) => {
    const item = editedChecklist.find(item => item.id === id);
    if (!item) return;

    if (item.isLinked && item.taskId) {
      // Update the linked task status
      const linkedTask = tasks.find(task => task.id === item.taskId);
      if (linkedTask) {
        const newStatus = item.completed ? 'todo' : 'done';
        updateTask(item.taskId, { status: newStatus });
      }
    } else {
      // Update standalone checklist item
      const updated = editedChecklist.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      setEditedChecklist(updated);
      onUpdate(updated);
    }
  };

  const updateChecklistTask = (id: number, field: 'task' | 'date', value: string) => {
    const updated = editedChecklist.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setEditedChecklist(updated);
    onUpdate(updated);
  };

  const addChecklistTask = () => {
    if (newTask.trim() && newDate) {
      const newItem: ChecklistItem = {
        id: Math.max(...editedChecklist.map(item => item.id), 0) + 1,
        task: newTask.trim(),
        completed: false,
        date: newDate,
        isLinked: false
      };
      const updated = [...editedChecklist, newItem];
      setEditedChecklist(updated);
      onUpdate(updated);
      setNewTask('');
      setNewDate('');
    }
  };

  const removeChecklistTask = (id: number) => {
    const updated = editedChecklist.filter(item => item.id !== id);
    setEditedChecklist(updated);
    onUpdate(updated);
  };

  const handleCreateTask = (itemId: number, taskData: Omit<Task, 'id' | 'created_at'>) => {
    // Create the task
    createTask({
      ...taskData,
      project_id: projectId
    });

    // Generate a temporary ID that will match the one created by addTask
    const tempTaskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Update checklist item to link with new task
    // We'll use a setTimeout to allow the task to be created first
    setTimeout(() => {
      // Find the most recently created task for this project
      const projectTasksAfterCreation = tasks.filter(task => task.project_id === projectId);
      const newestTask = projectTasksAfterCreation.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      if (newestTask) {
        const updated = editedChecklist.map(item => 
          item.id === itemId ? {
            ...item,
            taskId: newestTask.id,
            taskStatus: newestTask.status,
            isLinked: true,
            lastSync: new Date().toISOString()
          } : item
        );
        
        setEditedChecklist(updated);
        onUpdate(updated);
      }
    }, 100);
    
    setShowTaskForm(null);
  };

  const handleLinkTask = (itemId: number, taskId: string) => {
    const linkedTask = tasks.find(task => task.id === taskId);
    if (!linkedTask) return;

    const updated = editedChecklist.map(item => 
      item.id === itemId ? {
        ...item,
        taskId: taskId,
        taskStatus: linkedTask.status,
        isLinked: true,
        completed: linkedTask.status === 'done' || linkedTask.status === 'completed',
        lastSync: new Date().toISOString()
      } : item
    );
    
    setEditedChecklist(updated);
    onUpdate(updated);
    setShowTaskSelector(null);
  };

  const handleUnlinkTask = (itemId: number) => {
    const updated = editedChecklist.map(item => 
      item.id === itemId ? {
        ...item,
        taskId: undefined,
        taskStatus: undefined,
        isLinked: false,
        lastSync: undefined
      } : item
    );
    
    setEditedChecklist(updated);
    onUpdate(updated);
  };

  const linkedCount = editedChecklist.filter(item => item.isLinked).length;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Cronograma / Etapas</h2>
        {linkedCount > 0 && (
          <div className="text-sm text-gray-600">
            {linkedCount} de {editedChecklist.length} etapas vinculadas
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {editedChecklist.map((item) => (
          <div key={item.id} className="py-2">
            {item.isLinked ? (
              <ChecklistTaskCard
                item={item}
                task={tasks.find(task => task.id === item.taskId)}
                isEditing={isEditing}
                onToggle={() => toggleChecklistItem(item.id)}
                onUnlink={() => handleUnlinkTask(item.id)}
                onUpdateTask={updateChecklistTask}
                onRemove={() => removeChecklistTask(item.id)}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleChecklistItem(item.id)}
                  disabled={!isEditing}
                />
                {isEditing ? (
                  <>
                    <Input
                      value={item.task}
                      onChange={(e) => updateChecklistTask(item.id, 'task', e.target.value)}
                      className={`flex-1 text-base h-8 ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}
                    />
                    <Input
                      type="date"
                      value={item.date.split('/').reverse().join('-')}
                      onChange={(e) => {
                        const formattedDate = new Date(e.target.value).toLocaleDateString('pt-BR');
                        updateChecklistTask(item.id, 'date', formattedDate);
                      }}
                      className="w-40 h-8 text-sm"
                    />
                    
                    {/* Action buttons for standalone items */}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTaskForm(item.id)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Converter em tarefa"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTaskSelector(item.id)}
                        className="text-green-600 hover:text-green-700 p-1"
                        title="Vincular tarefa existente"
                      >
                        <Link className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChecklistTask(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className={`flex-1 text-base ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {item.task}
                    </span>
                    <span className="text-sm text-gray-500">até {item.date}</span>
                  </>
                )}
              </div>
            )}

            {/* Task Quick Form */}
            {showTaskForm === item.id && (
              <div className="mt-3 ml-9">
                <TaskQuickForm
                  itemData={{
                    title: item.task,
                    dueDate: item.date.split('/').reverse().join('-'),
                  }}
                  projectId={projectId}
                  onSubmit={(taskData) => handleCreateTask(item.id, taskData)}
                  onCancel={() => setShowTaskForm(null)}
                />
              </div>
            )}

            {/* Task Selector */}
            {showTaskSelector === item.id && (
              <div className="mt-3 ml-9">
                <TaskLinkSelector
                  availableTasks={projectTasks.filter(task => 
                    !editedChecklist.some(checkItem => checkItem.taskId === task.id)
                  )}
                  onSelect={(taskId) => handleLinkTask(item.id, taskId)}
                  onCancel={() => setShowTaskSelector(null)}
                />
              </div>
            )}
          </div>
        ))}
        
        {isEditing && (
          <div className="flex items-center gap-3 py-2 border-t pt-4">
            <div className="w-6" />
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nova tarefa..."
              className="flex-1 text-base h-8"
            />
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-40 h-8 text-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={addChecklistTask}
              disabled={!newTask.trim() || !newDate}
              className="text-green-600 hover:text-green-700 p-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectChecklist;
