
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface ChecklistItem {
  id: number;
  task: string;
  completed: boolean;
  date: string;
}

interface ProjectChecklistProps {
  checklist: ChecklistItem[];
  isEditing: boolean;
  onUpdate: (checklist: ChecklistItem[]) => void;
}

const ProjectChecklist = ({ checklist, isEditing, onUpdate }: ProjectChecklistProps) => {
  const [editedChecklist, setEditedChecklist] = useState(checklist);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');

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
        date: newDate
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

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cronograma / Etapas</h2>
      <div className="space-y-3">
        {editedChecklist.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleChecklistItem(item.id)}
              disabled={!isEditing}
            />
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
        ))}
        
        {isEditing && (
          <div className="flex items-center gap-3 py-2 border-t pt-4">
            <div className="w-6" /> {/* Spacer for checkbox alignment */}
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
    </section>
  );
};

export default ProjectChecklist;
