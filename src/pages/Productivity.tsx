import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, Clock, TrendingUp, Users, Target, AlertTriangle } from 'lucide-react';
import { useProductivityTasks } from '@/hooks/useProductivityTasks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Productivity = () => {
  const { overdueTasks, todayTasks } = useProductivityTasks();

  const totalTasks = 50;
  const completedTasks = 35;
  const teamMembers = 8;
  const projectDeadline = new Date(2024, 11, 31); // 31 de Dezembro de 2024

  const progress = (completedTasks / totalTasks) * 100;
  const daysUntilDeadline = Math.ceil((projectDeadline.getTime() - Date.now()) / (1000 * 3600 * 24));

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Visão Geral da Produtividade</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Progresso do Projeto */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-gray-500" />
              Progresso do Projeto
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
            <Progress value={progress} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">
              {completedTasks} de {totalTasks} tarefas concluídas
            </p>
          </CardContent>
        </Card>

        {/* Prazo do Projeto */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              Prazo do Projeto
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysUntilDeadline > 0 ? `${daysUntilDeadline} dias` : "Prazo encerrado"}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Data final: {format(projectDeadline, 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        {/* Membros da Equipe */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              Membros da Equipe
            </CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers}</div>
            <p className="text-sm text-gray-500 mt-2">
              Colaboradores engajados no projeto
            </p>
          </CardContent>
        </Card>

        {/* Tarefas Atrasadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-gray-500" />
              Tarefas Atrasadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks.length}</div>
            {overdueTasks.length > 0 ? (
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                {overdueTasks.map((task) => (
                  <li key={task.id}>{task.titulo}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Nenhuma tarefa atrasada.</p>
            )}
          </CardContent>
        </Card>

        {/* Tarefas para Hoje */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              Tarefas para Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTasks.length}</div>
            {todayTasks.length > 0 ? (
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                {todayTasks.map((task) => (
                  <li key={task.id}>{task.titulo}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Nenhuma tarefa para hoje.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Productivity;
