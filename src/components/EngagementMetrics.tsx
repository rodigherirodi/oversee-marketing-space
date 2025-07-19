
import React from 'react';
import { Flame, Clock, Users, Lightbulb, Star } from 'lucide-react';
import { UserProductivity } from '@/types/newEntities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EngagementMetricsProps {
  user: UserProductivity;
}

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ user }) => {
  const metrics = [
    {
      title: 'Streak Ativo',
      value: `${user.activeStreak} dias`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progress: Math.min((user.activeStreak / 30) * 100, 100)
    },
    {
      title: 'Pontualidade',
      value: `${user.punctualityIndex}%`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: user.punctualityIndex
    },
    {
      title: 'Colaboração',
      value: `${user.collaborationIndex}%`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: user.collaborationIndex
    },
    {
      title: 'Inovação',
      value: `${user.innovationScore}%`,
      icon: Lightbulb,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progress: user.innovationScore
    },
    {
      title: 'Satisfação Cliente',
      value: `${user.clientSatisfaction}/5.0`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      progress: (user.clientSatisfaction / 5) * 100
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-3">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center justify-between">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <div className={`px-2 py-1 rounded-full ${metric.bgColor}`}>
                <span className={`text-xs font-bold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-xs font-medium text-gray-600 mb-1">
              {metric.title}
            </div>
            <Progress value={metric.progress} className="h-1" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EngagementMetrics;
