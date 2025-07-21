
import React from 'react';
import { KanbanConfig } from '@/types/entities';
import { useTaskContext } from '@/contexts/TaskContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export const KanbanSelector: React.FC = () => {
  const { kanbanConfigs, currentKanban, setCurrentKanban } = useTaskContext();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Kanban:</span>
      <Select
        value={currentKanban.id}
        onValueChange={(value) => {
          const kanban = kanbanConfigs.find(k => k.id === value);
          if (kanban) setCurrentKanban(kanban);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: currentKanban.color }}
              />
              {currentKanban.name}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {kanbanConfigs.map((kanban) => (
            <SelectItem key={kanban.id} value={kanban.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: kanban.color }}
                />
                <span>{kanban.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {kanban.department === 'all' ? 'Todos' : kanban.department}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
