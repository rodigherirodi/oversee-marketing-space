import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Star,
  Award,
  Activity
} from 'lucide-react';
import { useProductivityData } from '@/hooks/useProductivityData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import MonthlyEvolutionChart from '@/components/MonthlyEvolutionChart';
import TodaysPriorities from '@/components/TodaysPriorities';
import CompactOverdueTasks from '@/components/CompactOverdueTasks';
import EngagementMetrics from '@/components/EngagementMetrics';
import BorderPattern from '@/components/BorderPattern';

const Productivity = () => {
  const { currentUser: currentUserProfile, isLoading: userLoading } = useCurrentUser();
  const { 
    productivityData: productivity, 
    achievements, 
    pointsHistory, 
    goals, 
    skills, 
    badges, 
    isLoading: productivityLoading 
  } = useProductivityData();

  if (userLoading || productivityLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUserProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Usuário não encontrado</p>
        </div>
      </div>
    );
  }

  const borderPattern = (currentUserProfile.border_pattern || 'solid') as 'solid' | 'stripes' | 'dots' | 'gradient';
  const userBadges = badges.map(badge => typeof badge === 'string' ? badge : badge.badge || '🌟');

  const userProductivity = {
    userId: currentUserProfile.id,
    user: {
      id: currentUserProfile.id,
      name: currentUserProfile.name,
      avatar: currentUserProfile.avatar,
      position: currentUserProfile.position || 'Sem cargo',
    },
    department: currentUserProfile.department || 'operacao',
    level: currentUserProfile.level || 1,
    badges: userBadges,
    borderPattern,
    borderColor: currentUserProfile.border_color || '#3B82F6',
    hireDate: currentUserProfile.hire_date || '',
    timeInCompany: '1 ano',
    nextReview: '2024-06-15',
    timezone: 'America/Sao_Paulo',
    certifications: [],
    keyProjects: [],
    activeStreak: productivity?.active_streak || 0,
    punctualityIndex: productivity?.punctuality_index || 0,
    collaborationIndex: productivity?.collaboration_index || 0,
    innovationScore: productivity?.innovation_score || 0,
    clientSatisfaction: productivity?.client_satisfaction || 0,
    tasksCompleted: 0,
    tasksOpen: 0,
    tasksInProgress: 0,
    overdueTasks: 0,
    overdueTasksList: [],
    todaysPriorities: [],
    activeProjects: productivity?.active_projects || 0,
    completedProjects: productivity?.completed_projects || 0,
    hoursWorkedWeek: currentUserProfile.hours_worked_week || 40,
    hoursWorkedMonth: productivity?.hours_worked_month || 160,
    productivityScore: productivity?.productivity_score || 75,
    avgCompletionTime: productivity?.avg_completion_time || 3.5,
    collaborativeProjects: productivity?.collaborative_projects || 0,
    individualProjects: productivity?.individual_projects || 0,
    skills: skills.map(skill => ({
      name: skill.skill,
      level: skill.level || 1,
    })),
    tasksByPriority: {
      high: 0,
      medium: 0,
      low: 0,
    },
    monthlyEvolution: [],
    recentAchievements: achievements.map(achievement => ({
      badge: achievement.badge,
      name: achievement.name,
      date: achievement.date,
    })),
    pointsHistory: pointsHistory.map(point => ({
      date: point.date,
      points: point.points,
      activity: point.activity,
    })),
    goals: goals.map(goal => ({
      id: goal.id,
      title: goal.title || goal.description,
      target: goal.target_value || 100,
      current: goal.current_value || 0,
      deadline: goal.deadline || goal.target_date || '',
    })),
    lastPromotion: undefined,
  };

  const engagementMetrics = {
    punctualityIndex: productivity?.punctuality_index || 0,
    collaborationIndex: productivity?.collaboration_index || 0,
    innovationScore: productivity?.innovation_score || 0,
    clientSatisfaction: productivity?.client_satisfaction || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header com informações do usuário */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={currentUserProfile.avatar || '/placeholder.svg'}
                  alt={currentUserProfile.name}
                  className="w-full h-full object-cover"
                />
                <BorderPattern
                  pattern={borderPattern}
                  color={currentUserProfile.border_color || '#3B82F6'}
                  className="absolute inset-0 rounded-full"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentUserProfile.name}</h1>
              <p className="text-muted-foreground">{currentUserProfile.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">Level {currentUserProfile.level}</Badge>
                <Badge variant="outline">{currentUserProfile.points || 0} pontos</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {userBadges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-lg">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <TodaysPriorities todayTasks={[]} />
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Produtividade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity?.productivity_score || 0}</div>
            <Progress value={productivity?.productivity_score || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabalhadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity?.hours_worked_month || 0}h</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity?.active_projects || 0}</div>
            <p className="text-xs text-muted-foreground">
              {productivity?.completed_projects || 0} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência Ativa</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivity?.active_streak || 0}</div>
            <p className="text-xs text-muted-foreground">
              dias consecutivos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico e Tarefas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyEvolutionChart />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <CompactOverdueTasks overdueTasks={[]} />
          <EngagementMetrics 
            user={{
              punctualityIndex: productivity?.punctuality_index || 0,
              collaborationIndex: productivity?.collaboration_index || 0,
              innovationScore: productivity?.innovation_score || 0,
              clientSatisfaction: productivity?.client_satisfaction || 0,
            }}
          />
        </div>
      </div>

      {/* Conquistas e Objetivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="text-2xl">{achievement.badge}</div>
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-sm text-muted-foreground">{achievement.date}</p>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma conquista ainda
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{goal.title || goal.description}</p>
                      <Badge variant="outline">{goal.current_value || 0}/{goal.target_value || 100}</Badge>
                    </div>
                    <Progress value={((goal.current_value || 0) / (goal.target_value || 100)) * 100} />
                    {(goal.deadline || goal.target_date) && (
                      <p className="text-xs text-muted-foreground">
                        Prazo: {goal.deadline || goal.target_date}
                      </p>
                    )}
                  </div>
                ))}
                {goals.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum objetivo definido
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Productivity;
