
import React from 'react';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Trophy, 
  TrendingUp, 
  Users, 
  User,
  BarChart3,
  Award,
  Calendar,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mockCurrentUser } from '../data/newMockData';

const Productivity = () => {
  const user = mockCurrentUser;
  const totalTasks = user.tasksCompleted + user.tasksOpen + user.tasksInProgress;
  const completionRate = Math.round((user.tasksCompleted / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Produtividade</h1>
        </div>

        {/* User Profile Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img 
                  src={user.user.avatar} 
                  alt={user.user.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.user.name}</h2>
                  <p className="text-lg text-gray-600">{user.user.position} - {user.department}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Nível {user.level}
                    </Badge>
                    <div className="flex gap-1">
                      {user.badges.slice(0, 6).map((badge, index) => (
                        <span key={index} className="text-lg" title={`Badge ${index + 1}`}>
                          {badge}
                        </span>
                      ))}
                      {user.badges.length > 6 && (
                        <span className="text-sm text-gray-500">+{user.badges.length - 6}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{user.productivityScore}%</div>
                <div className="text-sm text-gray-500">Score de Produtividade</div>
                <Progress value={user.productivityScore} className="w-32 mt-2" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{user.hoursWorkedWeek}h</div>
                <div className="text-sm text-gray-500">Esta semana</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{user.hoursWorkedMonth}h</div>
                <div className="text-sm text-gray-500">Este mês</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{completionRate}%</div>
                <div className="text-sm text-gray-500">Taxa de conclusão</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Task Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{user.tasksCompleted}</div>
              <p className="text-xs text-gray-600 mt-1">
                {Math.round((user.tasksCompleted / totalTasks) * 100)}% do total
              </p>
              <Progress value={(user.tasksCompleted / totalTasks) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Abertas</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{user.tasksOpen}</div>
              <p className="text-xs text-gray-600 mt-1">Aguardando início</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{user.tasksInProgress}</div>
              <p className="text-xs text-gray-600 mt-1">Sendo executadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2 h-2" />
              <p className="text-xs text-gray-600 mt-1">Eficiência geral</p>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Tasks */}
        {user.overdueTasks > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Tarefas Atrasadas ({user.overdueTasks})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.overdueTasksList.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance and Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Semanal & Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user.hoursWorkedWeek}h</div>
                  <div className="text-sm text-gray-600">Horas/Semana</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{user.hoursWorkedMonth}h</div>
                  <div className="text-sm text-gray-600">Horas/Mês</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score de Produtividade</span>
                  <span className="font-bold">{user.productivityScore}%</span>
                </div>
                <Progress value={user.productivityScore} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tempo Médio de Conclusão</span>
                  <span className="font-bold">{user.avgCompletionTime} dias</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Projetos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.activeProjects}</div>
                  <div className="text-sm text-gray-600">Ativos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{user.completedProjects}</div>
                  <div className="text-sm text-gray-600">Concluídos</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Colaborativos</span>
                  </div>
                  <span className="font-bold">{user.collaborativeProjects}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Individuais</span>
                  </div>
                  <span className="font-bold">{user.individualProjects}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Prioridade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Alta</span>
                </div>
                <span className="font-bold">{user.tasksByPriority.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Média</span>
                </div>
                <span className="font-bold">{user.tasksByPriority.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Baixa</span>
                </div>
                <span className="font-bold">{user.tasksByPriority.low}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Conquistas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-xl">{achievement.badge}</span>
                  <div>
                    <p className="text-sm font-medium">{achievement.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(achievement.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Pontos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.pointsHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">+{entry.points} pts</p>
                    <p className="text-xs text-gray-500">{entry.activity}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Skills and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills & Competências</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Metas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{goal.title}</span>
                    <span className="text-sm text-gray-500">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Evolução Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-4">
              {user.monthlyEvolution.map((month, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="bg-blue-500 rounded-t w-12 transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(month.score / 100) * 80}px` }}
                    title={`${month.month}: ${month.score}%`}
                  ></div>
                  <span className="text-xs text-gray-600">{month.month}</span>
                  <span className="text-xs font-bold">{month.score}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Productivity;
