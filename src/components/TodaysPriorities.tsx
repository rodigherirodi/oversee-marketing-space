
import React from 'react';
import { Calendar, Clock, CheckCircle, User, Truck } from 'lucide-react';
import { UserProductivity } from '@/types/newEntities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'text-blue-600';
      case 'delivery':
        return 'text-orange-600';
      case 'task':
      default:
        return 'text-green-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { variant: 'default' as const, text: 'Concluído', color: 'bg-green-100 text-green-700' };
      case 'in-progress':
        return { variant: 'secondary' as const, text: 'Em andamento', color: 'bg-blue-100 text-blue-700' };
      case 'pending':
      default:
        return { variant: 'outline' as const, text: 'Pendente', color: 'bg-gray-100 text-gray-700' };
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
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {user.todaysPriorities.slice(0, 4).map((priority) => {
            const TypeIcon = getTypeIcon(priority.type);
            const statusInfo = getStatusBadge(priority.status);
            
            return (
              <div key={priority.id} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                    {priority.title}
                  </h4>
                  <Badge className={`text-xs ${statusInfo.color} border-0`}>
                    {statusInfo.text}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <TypeIcon className={`w-3 h-3 ${getTypeColor(priority.type)}`} />
                  <span>{getTypeText(priority.type)}</span>
                  
                  {priority.time && (
                    <>
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{priority.time}</span>
                    </>
                  )}
                  
                  {priority.estimatedTime && (
                    <span className="text-purple-600 font-medium">
                      ({priority.estimatedTime})
                    </span>
                  )}
                </div>
                
                {priority.client && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <User className="w-3 h-3" />
                    <span>{priority.client}</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {user.todaysPriorities.length > 4 && (
            <div className="text-center py-2">
              <span className="text-xs text-gray-500">
                +{user.todaysPriorities.length - 4} itens restantes
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysPriorities;
