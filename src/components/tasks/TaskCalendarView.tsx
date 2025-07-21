
import React, { useState } from 'react';
import { Task } from '@/types/entities';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCalendarViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ 
  tasks, 
  onEditTask 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), date));
  };

  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    return getTasksForDate(selectedDate);
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex gap-6">
        {/* Calendar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h3>
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

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentDate}
            onMonthChange={setCurrentDate}
            className="rounded-md border"
            modifiers={{
              hasTask: (date) => getTasksForDate(date).length > 0,
            }}
            modifiersClassNames={{
              hasTask: "bg-blue-50 font-semibold",
            }}
          />

          {/* Task indicators on calendar */}
          <div className="mt-4">
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((day, index) => {
                const tasksForDay = getTasksForDate(day);
                return (
                  <div key={index} className="h-8 p-1">
                    {tasksForDay.length > 0 && (
                      <div className="flex gap-0.5">
                        {tasksForDay.slice(0, 3).map((task, taskIndex) => (
                          <div
                            key={taskIndex}
                            className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}
                            title={task.title}
                          />
                        ))}
                        {tasksForDay.length > 3 && (
                          <div className="text-xs text-gray-500 ml-1">
                            +{tasksForDay.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task list for selected date */}
        <div className="w-80 border-l pl-6">
          <h4 className="font-medium mb-4">
            {selectedDate 
              ? `Tarefas para ${format(selectedDate, 'dd/MM/yyyy')}`
              : 'Selecione uma data'
            }
          </h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getTasksForSelectedDate().map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onEditTask(task)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-sm line-clamp-2">{task.title}</h5>
                  <Badge
                    className={`text-xs ml-2 ${getPriorityColor(task.priority)} text-white`}
                  >
                    {task.priority === 'high' ? 'Alta' : 
                     task.priority === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                </div>
                
                {task.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{task.assignee.split(' ')[0]}</span>
                  <span>{task.squad}</span>
                </div>
              </div>
            ))}
            
            {getTasksForSelectedDate().length === 0 && selectedDate && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma tarefa para este dia</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
