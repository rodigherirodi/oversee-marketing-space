
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Users, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { mockTasks, mockProjects, mockClients } from '../data/mockData';

const AnalyticalDashboard = () => {
  // Calcular métricas
  const totalTasks = mockTasks.length;
  const tasksByStatus = {
    todo: mockTasks.filter(t => t.status === 'todo').length,
    doing: mockTasks.filter(t => t.status === 'doing').length,
    review: mockTasks.filter(t => t.status === 'review').length,
    done: mockTasks.filter(t => t.status === 'done').length,
  };
  
  const overdueTasks = mockTasks.filter(t => new Date(t.dueDate) < new Date()).length;
  const activeProjects = mockProjects.filter(p => p.status === 'in-progress').length;
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
  const clientsOnboarding = mockClients.filter(c => c.status === 'onboarding').length;
  const averageNPS = Math.round(mockClients.reduce((acc, c) => acc + (c.nps || 0), 0) / mockClients.length);

  // Dados para gráficos
  const taskStatusData = [
    { name: 'A Fazer', value: tasksByStatus.todo, color: '#6b7280' },
    { name: 'Em Andamento', value: tasksByStatus.doing, color: '#3b82f6' },
    { name: 'Em Revisão', value: tasksByStatus.review, color: '#f59e0b' },
    { name: 'Concluído', value: tasksByStatus.done, color: '#10b981' },
  ];

  const projectProgressData = mockProjects.map(p => ({
    name: p.name,
    progress: p.progress,
    status: p.status
  }));

  const clientDistributionData = [
    { name: 'MEI', value: mockClients.filter(c => c.size === 'MEI').length, color: '#8b5cf6' },
    { name: 'PME', value: mockClients.filter(c => c.size === 'PME').length, color: '#06b6d4' },
    { name: 'Grande Porte', value: mockClients.filter(c => c.size === 'large').length, color: '#f97316' },
  ];

  // Dados de performance mensal (mock)
  const monthlyPerformanceData = [
    { month: 'Jan', tasks: 45, projects: 8, clients: 12 },
    { month: 'Fev', tasks: 52, projects: 10, clients: 15 },
    { month: 'Mar', tasks: 48, projects: 9, clients: 14 },
    { month: 'Abr', tasks: 61, projects: 12, clients: 18 },
    { month: 'Mai', tasks: 55, projects: 11, clients: 16 },
    { month: 'Jun', tasks: 67, projects: 13, clients: 20 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Analítico</h1>
          <p className="text-gray-600">Visão geral da performance e indicadores da agência</p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-2">Total de Tarefas</div>
                <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
                <div className="text-sm text-green-600 mt-1">+12% vs mês anterior</div>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-2">Tarefas Atrasadas</div>
                <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
                <div className="text-sm text-red-600 mt-1">Requer atenção</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-2">Projetos Ativos</div>
                <div className="text-2xl font-bold text-blue-600">{activeProjects}</div>
                <div className="text-sm text-blue-600 mt-1">{completedProjects} concluídos</div>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-2">NPS Médio</div>
                <div className="text-2xl font-bold text-green-600">{averageNPS}</div>
                <div className="text-sm text-green-600 mt-1">Excelente</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Segunda linha de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-2">Clientes em Onboarding</div>
                <div className="text-2xl font-bold text-purple-600">{clientsOnboarding}</div>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-2">Tempo Médio de Conclusão</div>
                <div className="text-2xl font-bold text-orange-600">5.2 dias</div>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-600 text-sm font-medium mb-2">Taxa de Conclusão</div>
                <div className="text-2xl font-bold text-cyan-600">87%</div>
              </div>
              <Target className="w-8 h-8 text-cyan-600" />
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribuição de Tarefas por Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Tarefas por Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Progresso dos Projetos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso dos Projetos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segunda linha de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Mensal */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="clients" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição de Clientes por Porte */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Clientes por Porte</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clientDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {clientDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticalDashboard;
