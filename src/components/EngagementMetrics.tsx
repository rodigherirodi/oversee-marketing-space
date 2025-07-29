
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Lightbulb, Target, Star } from 'lucide-react';
import { UserProductivity } from '@/types/newEntities';

interface EngagementMetricsProps {
  user: UserProductivity;
}

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ user }) => {
  const metrics = [
    {
      title: 'Colaboração',
      value: user.collaborationIndex,
      icon: Users,
      color: 'text-blue-600',
      description: 'Projetos em equipe'
    },
    {
      title: 'Inovação',
      value: user.innovationScore,
      icon: Lightbulb,
      color: 'text-yellow-600',
      description: 'Soluções criativas'
    },
    {
      title: 'Pontualidade',
      value: user.punctualityIndex,
      icon: Target,
      color: 'text-green-600',
      description: 'Entregas no prazo'
    },
    {
      title: 'Satisfação Cliente',
      value: user.clientSatisfaction * 20, // Convert to percentage
      icon: Star,
      color: 'text-purple-600',
      description: `${user.clientSatisfaction}/5 estrelas`
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bom';
    return 'Precisa Melhorar';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Métricas de Engajamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div key={metric.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${metric.color}`} />
                    <span className="font-medium text-sm">{metric.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getScoreColor(metric.value)}`}
                    >
                      {getScoreLabel(metric.value)}
                    </Badge>
                    <span className="text-sm font-medium">{metric.value}%</span>
                  </div>
                </div>
                <Progress value={metric.value} className="h-2" />
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm text-blue-900 mb-2">Resumo do Desempenho</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Projetos Ativos</p>
              <p className="font-medium text-blue-900">{user.activeProjects}</p>
            </div>
            <div>
              <p className="text-blue-700">Projetos Concluídos</p>
              <p className="font-medium text-blue-900">{user.completedProjects}</p>
            </div>
            <div>
              <p className="text-blue-700">Horas/Semana</p>
              <p className="font-medium text-blue-900">{user.hoursWorkedWeek}h</p>
            </div>
            <div>
              <p className="text-blue-700">Sequência Ativa</p>
              <p className="font-medium text-blue-900">{user.activeStreak} dias</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementMetrics;
