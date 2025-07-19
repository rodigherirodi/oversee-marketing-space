
import React from 'react';
import { Calendar, Clock, CheckCircle, User, Truck } from 'lucide-react';
import { UserProductivity } from '@/types/newEntities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TodaysPrioritiesProps {
  user: UserProductivity;
}

const TodaysPriorities: React.FC<TodaysPrioritiesProps> = ({ user }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return Calendar;
      case 'delivery':
        return Truck;
      case 'task':
      default:
        return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'pending':
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓ Concluído';
      case 'in-progress':
        return '⏳ Em andamento';
      case 'pending':
      default:
        return '⏸ Pendente';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'Reunião';
      case 'delivery':
        return 'Entrega';
      case 'task':
      default:
        return 'Tarefa';
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700 text-sm">
          <Calendar className="w-4 h-4" />
          Prioridades de Hoje ({user.todaysPriorities.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {user.todaysPriorities.map((priority) => {
          const TypeIcon = getTypeIcon(priority.type);
          
          return (
            <div 
              key={priority.id} 
              className="flex items-start gap-3 py-2 px-1 hover:bg-white hover:bg-opacity-60 rounded cursor-pointer transition-colors text-sm"
            >
              <TypeIcon className={`w-4 h-4 mt-0.5 ${getStatusColor(priority.status)}`} />
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {priority.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                  <span>{getTypeText(priority.type)}</span>
                  
                  {priority.time && (
                    <>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{priority.time}</span>
                    </>
                  )}
                  
                  {priority.client && (
                    <>
                      <span>•</span>
                      <User className="w-3 h-3" />
                      <span>{priority.client}</span>
                    </>
                  )}
                  
                  {priority.estimatedTime && (
                    <>
                      <span>•</span>
                      <span className="text-purple-600 font-medium">
                        ({priority.estimatedTime})
                      </span>
                    </>
                  )}
                  
                  <span>•</span>
                  <span className={getStatusColor(priority.status)}>
                    {getStatusText(priority.status)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {user.todaysPriorities.length > 4 && (
          <div className="text-center py-2 text-xs text-gray-500">
            +{user.todaysPriorities.length - 4} itens restantes
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysPriorities;
