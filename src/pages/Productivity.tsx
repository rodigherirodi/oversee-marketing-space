
import React, { useState } from 'react';
import { Target, TrendingUp, Clock, CheckCircle, AlertTriangle, Trophy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mockUserProductivity } from '../data/newMockData';
import { UserProductivity } from '../types/newEntities';

const Productivity = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>(mockUserProductivity[0]?.userId || '');
  const selectedUser = mockUserProductivity.find(u => u.userId === selectedUserId);

  if (!selectedUser) {
    return <div>Usuário não encontrado</div>;
  }

  const completionRate = Math.round((selectedUser.tasksCompleted / (selectedUser.tasksCompleted + selectedUser.tasksInProgress + selectedUser.overdueTasks)) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Produtividade</h1>
              <p className="text-gray-600">Acompanhe a performance individual dos membros da equipe</p>
            </div>
            
            {/* User Selector */}
            <div className="w-64">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar usuário" />
                </SelectTrigger>
                <SelectContent>
                  {mockUserProductivity.map((user) => (
                    <SelectItem key={user.userId} value={user.userId}>
                      <div className="flex items-center gap-2">
                        <img 
                          src={user.user.avatar} 
                          alt={user.user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{user.user.name}</div>
                          <div className="text-sm text-gray-500">{user.user.position}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <img 
                src={selectedUser.user.avatar} 
                alt={selectedUser.user.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <CardTitle className="text-2xl">{selectedUser.user.name}</CardTitle>
                <CardDescription className="text-lg">{selectedUser.user.position}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Score: {selectedUser.productivityScore}
                  </Badge>
                  <Badge variant="outline">
                    {selectedUser.hoursWorked}h trabalhadas
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedUser.tasksCompleted}</div>
              <p className="text-xs text-gray-600 mt-1">Taxa de conclusão: {completionRate}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedUser.tasksInProgress}</div>
              <p className="text-xs text-gray-600 mt-1">Tarefas ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{selectedUser.overdueTasks}</div>
              <p className="text-xs text-gray-600 mt-1">Requer atenção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <Trophy className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedUser.activeProjects}</div>
              <p className="text-xs text-gray-600 mt-1">{selectedUser.completedProjects} concluídos</p>
            </CardContent>
          </Card>
        </div>

        {/* Metas e Objetivos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Metas do Mês</CardTitle>
              <CardDescription>Progresso dos objetivos pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedUser.goals.map((goal) => (
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

          <Card>
            <CardHeader>
              <CardTitle>Performance Semanal</CardTitle>
              <CardDescription>Análise de produtividade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Score de Produtividade</span>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedUser.productivityScore} className="w-20 h-2" />
                    <span className="text-sm font-bold">{selectedUser.productivityScore}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Horas Trabalhadas</span>
                  <span className="text-sm font-bold">{selectedUser.hoursWorked}h</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Média de Conclusão</span>
                  <span className="text-sm font-bold">{completionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Productivity;
