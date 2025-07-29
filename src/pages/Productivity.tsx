
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, Trophy, Users, TrendingUp } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useProductivityData } from '@/hooks/useProductivityData';
import TodaysPriorities from '@/components/TodaysPriorities';
import CompactOverdueTasks from '@/components/CompactOverdueTasks';
import MonthlyEvolutionChart from '@/components/MonthlyEvolutionChart';
import EngagementMetrics from '@/components/EngagementMetrics';

const Productivity = () => {
  const { currentUserProfile, isLoading: userLoading } = useCurrentUser();
  const { productivity, achievements, pointsHistory, goals, isLoading: productivityLoading } = useProductivityData();

  if (userLoading || productivityLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtividade</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu desempenho e evolução pessoal
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Nível {currentUserProfile?.level || 1}
        </Badge>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Produtividade</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity?.productivity_score || 85}%</div>
            <Progress value={productivity?.productivity_score || 85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabalhadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity?.hours_worked_month || 168}h</div>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity?.active_projects || 3}</div>
            <p className="text-xs text-muted-foreground mt-1">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Cliente</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity?.client_satisfaction || 4.7}/5</div>
            <p className="text-xs text-muted-foreground mt-1">Média geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <TodaysPriorities />
          <MonthlyEvolutionChart />
          <EngagementMetrics />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <CompactOverdueTasks />
          
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Conquistas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.badge}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(achievement.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Metas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">{goal.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {goal.current_value}/{goal.target_value}
                    </span>
                  </div>
                  <Progress 
                    value={(goal.current_value / goal.target_value) * 100} 
                    className="h-2" 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Productivity;
