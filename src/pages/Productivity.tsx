
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
import { useTaskContext } from '@/contexts/TaskContext';
import { UserProductivity } from '@/types/newEntities';

const Productivity = () => {
  const { currentUserProfile, isLoading: userLoading } = useCurrentUser();
  const { productivity, achievements, pointsHistory, goals, isLoading: productivityLoading } = useProductivityData();
  const { tasks } = useTaskContext();

  // Get today's tasks
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => 
    task.dueDate && task.dueDate.startsWith(today)
  );

  // Get overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  });

  // Transform currentUserProfile to UserProductivity format
  const mockUserProductivity: UserProductivity = {
    userId: currentUserProfile?.id || 'mock-user-id',
    user: {
      id: currentUserProfile?.id || 'mock-user-id',
      name: currentUserProfile?.name || 'Usuário',
      avatar: currentUserProfile?.avatar,
      position: currentUserProfile?.position || 'Desenvolvedor'
    },
    department: currentUserProfile?.department || 'operacao',
    level: currentUserProfile?.level || 1,
    badges: ['🌟', '🚀'], // Default badges since they don't exist in the profile
    borderPattern: 'solid',
    borderColor: currentUserProfile?.border_color || '#3b82f6',
    hireDate: currentUserProfile?.hire_date || '2024-01-01',
    timeInCompany: '1 ano',
    nextReview: '2024-12-31',
    timezone: 'America/Sao_Paulo',
    certifications: [],
    keyProjects: ['Projeto A', 'Projeto B'],
    activeStreak: 12,
    punctualityIndex: 95,
    collaborationIndex: 88,
    innovationScore: 92,
    clientSatisfaction: 4.7,
    tasksCompleted: 45,
    tasksOpen: 8,
    tasksInProgress: 5,
    overdueTasks: overdueTasks.length,
    overdueTasksList: overdueTasks.map(task => ({
      id: task.id,
      title: task.title,
      client: task.client.name,
      dueDate: task.dueDate,
      priority: task.priority,
      daysOverdue: Math.ceil((new Date().getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24))
    })),
    todaysPriorities: todayTasks.slice(0, 5).map(task => ({
      id: task.id,
      title: task.title,
      type: 'task' as const,
      client: task.client.name,
      status: task.status === 'completed' ? 'completed' : task.status === 'in-progress' ? 'in-progress' : 'pending',
      estimatedTime: '2h'
    })),
    activeProjects: currentUserProfile?.active_projects_count || 3,
    completedProjects: currentUserProfile?.completed_projects_count || 12,
    hoursWorkedWeek: 40,
    hoursWorkedMonth: 168,
    productivityScore: 85,
    avgCompletionTime: 2.8,
    collaborativeProjects: 8,
    individualProjects: 7,
    skills: [
      { name: 'React', level: 4 },
      { name: 'TypeScript', level: 3 },
      { name: 'Node.js', level: 3 }
    ],
    tasksByPriority: {
      high: 3,
      medium: 8,
      low: 5
    },
    monthlyEvolution: [
      { month: 'Jan', score: 80 },
      { month: 'Fev', score: 82 },
      { month: 'Mar', score: 85 }
    ],
    recentAchievements: [
      { badge: '⏰', name: 'Entrega no Prazo', date: '2024-01-15' },
      { badge: '🤝', name: 'Colaboração', date: '2024-01-10' }
    ],
    pointsHistory: [
      { date: '2024-01-15', points: 50, activity: 'Tarefa concluída' },
      { date: '2024-01-14', points: 30, activity: 'Code review' }
    ],
    goals: [
      { id: '1', title: 'Concluir 5 projetos', target: 5, current: 3, deadline: '2024-03-31' },
      { id: '2', title: 'Melhorar produtividade', target: 90, current: 85, deadline: '2024-02-28' }
    ]
  };

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
          <TodaysPriorities todayTasks={todayTasks} />
          <MonthlyEvolutionChart />
          <EngagementMetrics user={mockUserProductivity} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <CompactOverdueTasks overdueTasks={overdueTasks} />
          
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
