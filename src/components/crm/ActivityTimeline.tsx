
import React from 'react';
import { LeadActivity } from '@/types/crm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  CheckSquare,
  Users,
  Clock
} from 'lucide-react';

interface ActivityTimelineProps {
  activities: LeadActivity[];
  onActivityAdd: (activity: LeadActivity) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities
}) => {
  const getActivityIcon = (type: LeadActivity['type']) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'note': return FileText;
      case 'task': return CheckSquare;
      case 'follow_up': return Clock;
      default: return FileText;
    }
  };

  const getActivityColor = (type: LeadActivity['type']) => {
    switch (type) {
      case 'call': return 'text-blue-600 bg-blue-50';
      case 'email': return 'text-green-600 bg-green-50';
      case 'meeting': return 'text-purple-600 bg-purple-50';
      case 'note': return 'text-gray-600 bg-gray-50';
      case 'task': return 'text-orange-600 bg-orange-50';
      case 'follow_up': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getOutcomeBadge = (outcome?: LeadActivity['outcome']) => {
    if (!outcome) return null;
    
    const variants = {
      positive: 'bg-green-100 text-green-700',
      negative: 'bg-red-100 text-red-700',
      neutral: 'bg-gray-100 text-gray-700'
    };

    const labels = {
      positive: 'Positivo',
      negative: 'Negativo',
      neutral: 'Neutro'
    };

    return (
      <Badge className={`text-xs ${variants[outcome]}`}>
        {labels[outcome]}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getActivityTypeLabel = (type: LeadActivity['type']) => {
    const labels = {
      call: 'Ligação',
      email: 'E-mail',
      meeting: 'Reunião',
      note: 'Nota',
      task: 'Tarefa',
      follow_up: 'Follow-up'
    };
    return labels[type] || type;
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Nenhuma atividade registrada</p>
      </div>
    );
  }

  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedActivities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        const colorClass = getActivityColor(activity.type);
        
        return (
          <Card key={activity.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <div className="flex items-center gap-2">
                      {getOutcomeBadge(activity.outcome)}
                      <Badge variant="outline" className="text-xs">
                        {getActivityTypeLabel(activity.type)}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Por {activity.createdBy}</span>
                    <span>{formatDate(activity.createdAt)}</span>
                  </div>
                  
                  {activity.dueDate && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                      <Calendar className="w-3 h-3" />
                      <span>Vencimento: {formatDate(activity.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Timeline connector */}
              {index < sortedActivities.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
