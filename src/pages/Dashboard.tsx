import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FolderOpen, 
  CheckSquare, 
  AlertCircle,
  DollarSign,
  Clock,
  Target,
  Calendar
} from 'lucide-react';
import { mockTasks, mockProjects, mockClients } from '../data/mockData';

const Dashboard = () => {
  // Calculate metrics
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(task => task.status === 'done').length;
  const overdueTasks = mockTasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== 'done'
  ).length;
  const inProgressTasks = mockTasks.filter(task => task.status === 'doing').length;
  
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(project => project.status === 'active').length;
  const completedProjects = mockProjects.filter(project => project.status === 'completed').length;
  
  const totalClients = mockClients.length;
  const activeClients = mockClients.filter(client => client.status === 'active').length;
  
  const monthlyRevenue = mockClients.reduce((sum, client) => sum + (client.contractValue || 0), 0);

  const metrics = [
    {
      title: 'Total de Tarefas',
      value: totalTasks,
      change: '+12%',
      trend: 'up',
      icon: CheckSquare,
      color: 'bg-blue-500'
    },
    {
      title: 'Tarefas Concluídas',
      value: completedTasks,
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Tarefas Atrasadas',
      value: overdueTasks,
      change: '-3%',
      trend: 'down',
      icon: AlertCircle,
      color: 'bg-red-500'
    },
    {
      title: 'Projetos Ativos',
      value: activeProjects,
      change: '+5%',
      trend: 'up',
      icon: FolderOpen,
      color: 'bg-purple-500'
    },
    {
      title: 'Clientes Ativos',
      value: activeClients,
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${(monthlyRevenue / 1000).toFixed(0)}k`,
      change: '+22%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-emerald-500'
    }
  ];

  const tasksByStatus = [
    { status: 'A Fazer', count: mockTasks.filter(t => t.status === 'todo').length, color: 'bg-gray-400' },
    { status: 'Em Andamento', count: mockTasks.filter(t => t.status === 'doing').length, color: 'bg-blue-500' },
    { status: 'Em Revisão', count: mockTasks.filter(t => t.status === 'review').length, color: 'bg-yellow-500' },
    { status: 'Concluído', count: mockTasks.filter(t => t.status === 'done').length, color: 'bg-green-500' }
  ];

  const projectsByClient = mockClients.map(client => ({
    client: client.name,
    projectCount: client.projects.length,
    value: client.contractValue || 0,
    color: client.color
  }));

  const upcomingDeadlines = mockTasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral das métricas e indicadores</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tarefas por Status</h3>
          <div className="space-y-3">
            {tasksByStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-700">{item.status}</span>
                </div>
                <span className="font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">Total</span>
            <span className="font-bold text-gray-900">{totalTasks}</span>
          </div>
        </div>

        {/* Projects by Client */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Projetos por Cliente</h3>
          <div className="space-y-3">
            {projectsByClient.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.client}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{item.projectCount} projetos</div>
                  <div className="text-xs text-gray-500">
                    R$ {(item.value / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Próximos Prazos</h3>
          <div className="space-y-3">
            {upcomingDeadlines.map((task, index) => {
              const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysUntilDue < 0;
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {mockClients.find(c => c.id === task.clientId)?.name} • {mockProjects.find(p => p.id === task.projectId)?.name}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-1 text-xs ${
                    isOverdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-gray-500'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span>
                      {daysUntilDue === 0 ? 'Hoje' : 
                       daysUntilDue === 1 ? 'Amanhã' : 
                       daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d atrasado` :
                       `${daysUntilDue}d`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Ana Silva criou tarefa "Criação de landing page"</p>
                <p className="text-xs text-gray-500">2 horas atrás</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Carlos Mendes concluiu "Setup Google Analytics"</p>
                <p className="text-xs text-gray-500">4 horas atrás</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Marina Costa enviou para revisão "Copy para social media"</p>
                <p className="text-xs text-gray-500">1 dia atrás</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Novo cliente "Cliente C" adicionado</p>
                <p className="text-xs text-gray-500">2 dias atrás</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;