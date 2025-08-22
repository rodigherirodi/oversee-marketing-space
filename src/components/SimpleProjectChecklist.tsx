
import React from 'react';

interface ChecklistItem {
  id: number;
  task: string;
  completed: boolean;
  date: string;
  isLinked: boolean;
}

interface SimpleProjectChecklistProps {
  checklist: ChecklistItem[];
  isEditing: boolean;
  onUpdate: (checklist: ChecklistItem[]) => void;
  projectId: string;
}

const SimpleProjectChecklist: React.FC<SimpleProjectChecklistProps> = ({
  checklist,
  isEditing,
  onUpdate,
  projectId
}) => {
  const toggleTask = (id: number) => {
    const updatedChecklist = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdate(updatedChecklist);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Checklist do Projeto</h3>
      <div className="space-y-2">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-2 border rounded">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleTask(item.id)}
              className="h-4 w-4"
            />
            <span className={item.completed ? 'line-through text-gray-500' : ''}>
              {item.task}
            </span>
            <span className="text-sm text-gray-400 ml-auto">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleProjectChecklist;
