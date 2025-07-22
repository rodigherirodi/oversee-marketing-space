
import React, { useState } from 'react';
import { Task } from '@/types/entities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCalendarGridProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDateClick?: (date: Date) => void;
}

export const TaskCalendarGrid: React.FC<TaskCalendarGridProps> = ({ 
  tasks, 
  onEditTask,
  onDateClick 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days for complete weeks
  const startWeekday = monthStart.getDay();
  const endWeekday = monthEnd.getDay();
  
  const paddingStartDays = Array.from({ length: startWeekday }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (startWeekday - i));
    return date;
  });

  const paddingEndDays = Array.from({ length: 6 - endWeekday }, (_, i) => {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + (i + 1));
    return date;
  });

  const allDays = [...paddingStartDays, ...calendarDays, ...paddingEndDays];

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-lg border h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {allDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              className={`border-r border-b last:border-r-0 p-2 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors ${
                !isCurrentMonth ? 'text-gray-400 bg-gray-50/50' : ''
              } ${isTodayDate ? 'bg-blue-50' : ''}`}
              onClick={() => onDateClick?.(day)}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  isTodayDate ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''
                }`}>
                  {day.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {dayTasks.length}
                  </Badge>
                )}
              </div>

              {/* Tasks */}
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                    className={`text-xs p-1.5 rounded border-l-2 cursor-pointer hover:shadow-sm transition-shadow ${getPriorityColor(task.priority)}`}
                  >
                    <div className="font-medium line-clamp-1 text-gray-900">
                      {task.title}
                    </div>
                    <div className="text-gray-600 line-clamp-1">
                      {task.assignee.split(' ')[0]}
                    </div>
                  </div>
                ))}
                
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{dayTasks.length - 3} mais
                  </div>
                )}
              </div>

              {/* Add task button on hover */}
              {isCurrentMonth && (
                <div className="opacity-0 hover:opacity-100 transition-opacity absolute">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateClick?.(day);
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
