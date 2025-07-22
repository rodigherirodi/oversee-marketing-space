
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link, ExternalLink, Unlink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types/entities';
import { useToast } from '@/hooks/use-toast';
import TaskLinkSelector from './TaskLinkSelector';
import TaskQuickForm from './TaskQuickForm';
import ChecklistTaskCard from './ChecklistTaskCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  projectId?: string;
}

const ProjectChecklist = ({ checklist, isEditing, onUpdate, projectId }: ProjectChecklistProps) => {
  const { tasks, addTask, updateTask } = useTaskContext();
  const { toast } = useToast();
  const [editedChecklist, setEditedChecklist] = useState(checklist);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [linkingItemId, setLinkingItemId] = useState<number | null>(null);
  const [creatingTaskId, setCreatingTaskId] = useState<number | null>(null);

  // Get project tasks
  const projectTasks = tasks.filter(task => task.projectId === projectId);

  // Sync checklist with linked tasks
  useEffect(() => {
    const syncedChecklist = editedChecklist.map(item => {
      if (item.taskId) {
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
    const updated = editedChecklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setEditedChecklist(updated);
    onUpdate(updated);
  };

  const updateTask = (id: number, field: 'task' | 'date', value: string) => {
    const updated = editedChecklist.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setEditedChecklist(updated);
    onUpdate(updated);
  };

  const addTask = () => {
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

  const removeTask = (id: number) => {
    const updated = editedChecklist.filter(item => item.id !== id);
    setEditedChecklist(updated);
    onUpdate(updated);
  };

  const handleLinkToTask = (checklistId: number, taskId: string) => {
    const linkedTask = tasks.find(task => task.id === taskId);
    if (!linkedTask) return;

    const updated = editedChecklist.map(item => 
      item.id === checklistId 
        ? { 
            ...item, 
            taskId, 
            taskStatus: linkedTask.status, 
            isLinked: true,
            completed: linkedTask.status === 'done' || linkedTask.status === 'completed',
            lastSync: new Date().toISOString()
          } 
        : item
    );
    
    setEditedChecklist(updated);
    onUpdate(updated);
    setLinkingItemId(null);
    
    toast({
      title: "Tarefa vinculada",
      description: `Etapa "${item?.task}" foi vinculada à tarefa "${linkedTask.title}".`
    });
  };

  const handleUnlinkTask = (checklistId: number) => {
    const updated = editedChecklist.map(item => 
      item.id === checklistId 
        ? { 
            ...item, 
            taskId: undefined, 
            taskStatus: undefined, 
            isLinked: false,
            lastSync: undefined
          } 
        : item
    );
    
    setEditedChecklist(updated);
    onUpdate(updated);
    
    toast({
      title: "Tarefa desvinculada",
      description: "A etapa foi desvinculada da tarefa."
    });
  };

  const handleCreateTaskFromChecklist = (checklistItem: ChecklistItem, taskData: Partial<Task>) => {
    if (!projectId) return;

    const newTaskData: Omit<Task, 'id' | 'createdAt'> = {
      title: checklistItem.task,
      description: `Tarefa criada a partir da etapa: ${checklistItem.task}`,
      status: 'todo',
      priority: taskData.priority || 'medium',
      type: taskData.type || 'task',
      assignee: taskData.assignee || '',
      watchers: taskData.watchers || [],
      squad: taskData.squad || 'Gestão',
      clientId: taskData.clientId || '',
      client: taskData.client || {} as any,
      projectId: projectId,
      dueDate: checklistItem.date.split('/').reverse().join('-'),
      tags: taskData.tags || [],
      comments: [],
      attachments: [],
      customFields: {}
    };

    addTask(newTaskData);
    
    // Find the created task (it will be the most recent one)
    setTimeout(() => {
      const createdTask = tasks.find(task => 
        task.title === checklistItem.task && task.projectId === projectId
      );
      
      if (createdTask) {
        handleLinkToTask(checklistItem.id, createdTask.id);
      }
    }, 100);

    setCreatingTaskId(null);
    
    toast({
      title: "Tarefa criada",
      description: `Nova tarefa "${checklistItem.task}" foi criada e vinculada.`
    });
  };

  const getStatusIcon = (item: ChecklistItem) => {
    if (!item.isLinked) {
      return item.completed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : null;
    }
    
    switch (item.taskStatus) {
      case 'done':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress':
      case 'doing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const linkedCount = editedChecklist.filter(item => item.isLinked).length;
  const totalCount = editedChecklist.length;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Cronograma / Etapas</h2>
        {totalCount > 0 && (
          <div className="text-sm text-gray-500">
            {linkedCount} de {totalCount} etapas vinculadas
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {editedChecklist.map((item) => {
          const linkedTask = item.taskId ? tasks.find(task => task.id === item.taskId) : null;
          
          return (
            <div key={item.id} className="flex items-center gap-3 py-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleChecklistItem(item.id)}
                  disabled={!isEditing || item.isLinked}
                />
                {getStatusIcon(item)}
              </div>
              
              {isEditing ? (
                <>
                  <Input
                    value={item.task}
                    onChange={(e) => updateTask(item.id, 'task', e.target.value)}
                    className={`flex-1 text-base h-8 ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}
                  />
                  <Input
                    type="date"
                    value={item.date.split('/').reverse().join('-')}
                    onChange={(e) => {
                      const formattedDate = new Date(e.target.value).toLocaleDateString('pt-BR');
                      updateTask(item.id, 'date', formattedDate);
                    }}
                    className="w-40 h-8 text-sm"
                  />
                  
                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1">
                        <span className="sr-only">Ações</span>
                        ⋮
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!item.isLinked ? (
                        <>
                          <DropdownMenuItem onClick={() => setCreatingTaskId(item.id)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Converter em Tarefa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLinkingItemId(item.id)}>
                            <Link className="w-4 h-4 mr-2" />
                            Vincular Tarefa Existente
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => window.open(`/tasks?task=${item.taskId}`, '_blank')}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir Tarefa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUnlinkTask(item.id)}>
                            <Unlink className="w-4 h-4 mr-2" />
                            Desvincular
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => removeTask(item.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover Etapa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <span className={`flex-1 text-base ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {item.task}
                  </span>
                  <span className="text-sm text-gray-500">até {item.date}</span>
                  {item.isLinked && linkedTask && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/tasks?task=${item.taskId}`, '_blank')}
                      className="p-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          );
        })}
        
        {/* Linked Task Cards */}
        {editedChecklist.map((item) => {
          const linkedTask = item.taskId ? tasks.find(task => task.id === item.taskId) : null;
          
          return linkedTask ? (
            <ChecklistTaskCard
              key={`task-${item.id}`}
              task={linkedTask}
              checklistItem={item}
              onUnlink={() => handleUnlinkTask(item.id)}
            />
          ) : null;
        })}
        
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
              onClick={addTask}
              disabled={!newTask.trim() || !newDate}
              className="text-green-600 hover:text-green-700 p-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Task Link Selector Modal */}
      {linkingItemId && (
        <TaskLinkSelector
          isOpen={true}
          onClose={() => setLinkingItemId(null)}
          onSelect={(taskId) => handleLinkToTask(linkingItemId, taskId)}
          projectTasks={projectTasks}
          excludeLinkedTasks={editedChecklist.filter(item => item.taskId).map(item => item.taskId!)}
        />
      )}

      {/* Task Quick Form Modal */}
      {creatingTaskId && (
        <TaskQuickForm
          isOpen={true}
          onClose={() => setCreatingTaskId(null)}
          onSubmit={(taskData) => {
            const checklistItem = editedChecklist.find(item => item.id === creatingTaskId);
            if (checklistItem) {
              handleCreateTaskFromChecklist(checklistItem, taskData);
            }
          }}
          checklistItem={editedChecklist.find(item => item.id === creatingTaskId)!}
          projectId={projectId}
        />
      )}
    </section>
  );
};

export default ProjectChecklist;
