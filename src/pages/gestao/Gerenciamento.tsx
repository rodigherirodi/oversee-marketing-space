
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gauge, 
  Users, 
  FolderOpen,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  DollarSign,
  Target,
  Activity,
  Calendar
} from 'lucide-react';

const Gerenciamento = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const teamMetrics = [
    {
      name: 'João Silva',
      role: 'Gerente de Projetos',
      projects: 4,
      tasks: 28,
      completion: 92,
      performance: 'excellent'
    },
    {
      name: 'Maria Santos',
      role: 'Designer',
      projects: 6,
      tasks: 35,
      completion: 88,
      performance: 'good'
    },
    {
      name: 'Carlos Oliveira',
      role: 'Desenvolvedor',
      projects: 3,
      tasks: 42,
      completion: 75,
      performance: 'average'
    }
  ];

  const projectHealth = [
    {
      name: 'Website E-commerce',
      client: 'TechStart',
      progress: 85,
      status: 'on-track',
      budget: 95,
      timeline: 'on-time'
    },
    {
      name: 'App Mobile',
      client: 'Inovação Digital',
      progress: 60,
      status: 'at-risk',
      budget: 110,
      timeline: 'delayed'
    },
    {
      name: 'Sistema CRM',
      client: 'Global Corp',
      progress: 40,
      status: 'on-track',
      budget: 85,
      timeline: 'on-time'
    }
  ];

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-700';
      case 'good': return 'bg-blue-100 text-blue-700';
      case 'average': return 'bg-yellow-100 text-yellow-700';
      case 'poor': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-700';
      case 'at-risk': return 'bg-yellow-100 text-yellow-700';
      case 'delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento</h1>
          <p className="text-gray-600">Dashboard executivo de performance e saúde dos projetos</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-gray-600">Projetos Ativos</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+2 este mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-gray-600">Membros do Time</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600">85% produtivos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">147</p>
                <p className="text-sm text-gray-600">Tarefas Concluídas</p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">92% no prazo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">R$ 2.1M</p>
                <p className="text-sm text-gray-600">Receita Este Mês</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+18% vs anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-orange-800">Alertas Importantes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
              <Clock className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Projeto "App Mobile" com atraso de 5 dias</p>
                <p className="text-xs text-gray-600">Cliente: Inovação Digital - Ação necessária</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Orçamento excedido em 10% no projeto "Website E-commerce"</p>
                <p className="text-xs text-gray-600">Revisão necessária com o cliente</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
              <Users className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">3 membros do time com produtividade abaixo de 70%</p>
                <p className="text-xs text-gray-600">Reunião de alinhamento agendada</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance do Time */}
        <Card>
          <CardHeader>
            <CardTitle>Performance do Time</CardTitle>
            <CardDescription>Desempenho individual dos colaboradores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMetrics.map((member) => (
                <div key={member.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    <Badge className={getPerformanceColor(member.performance)}>
                      {member.performance === 'excellent' && 'Excelente'}
                      {member.performance === 'good' && 'Bom'}
                      {member.performance === 'average' && 'Médio'}
                      {member.performance === 'poor' && 'Abaixo'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{member.projects}</p>
                      <p className="text-gray-600">Projetos</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.tasks}</p>
                      <p className="text-gray-600">Tarefas</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.completion}%</p>
                      <p className="text-gray-600">Conclusão</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Progress value={member.completion} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Saúde dos Projetos */}
        <Card>
          <CardHeader>
            <CardTitle>Saúde dos Projetos</CardTitle>
            <CardDescription>Status e progresso dos projetos em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectHealth.map((project) => (
                <div key={project.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">Cliente: {project.client}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === 'on-track' && 'No Prazo'}
                      {project.status === 'at-risk' && 'Em Risco'}
                      {project.status === 'delayed' && 'Atrasado'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Orçamento</p>
                        <p className={`font-medium ${project.budget > 100 ? 'text-red-600' : 'text-green-600'}`}>
                          {project.budget}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cronograma</p>
                        <p className={`font-medium ${project.timeline === 'delayed' ? 'text-red-600' : 'text-green-600'}`}>
                          {project.timeline === 'on-time' ? 'No Prazo' : 'Atrasado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gerenciamento;
