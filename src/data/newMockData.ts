
import { Briefing, Case, Access, UserProductivity } from '../types/newEntities';

export const mockBriefings: Briefing[] = [
  {
    id: '1',
    title: 'Campanha de Lançamento - Produto X',
    clientId: '1',
    client: { id: '1', name: 'Tech Solutions', logo: '/placeholder.svg' },
    description: 'Desenvolvimento de estratégia completa para lançamento do novo produto da empresa.',
    status: 'review',
    priority: 'high',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    dueDate: '2024-02-01',
    tags: ['marketing', 'lançamento', 'produto'],
    assignee: 'Ana Silva',
    attachments: []
  },
  {
    id: '2',
    title: 'Rebranding Completo',
    clientId: '2',
    client: { id: '2', name: 'Green Energy', logo: '/placeholder.svg' },
    description: 'Projeto de rebranding incluindo nova identidade visual e posicionamento.',
    status: 'approved',
    priority: 'medium',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    dueDate: '2024-03-15',
    tags: ['branding', 'identidade visual'],
    assignee: 'Carlos Santos',
    attachments: []
  }
];

export const mockCases: Case[] = [
  {
    id: '1',
    title: 'Aumento de 300% no Tráfego Orgânico',
    clientId: '1',
    client: { id: '1', name: 'Tech Solutions', logo: '/placeholder.svg' },
    category: 'SEO',
    description: 'Estratégia completa de SEO que resultou em crescimento significativo do tráfego orgânico.',
    summary: 'Implementação de estratégia de SEO técnico e conteúdo que triplicou o tráfego em 6 meses.',
    results: [
      { metric: 'Tráfego Orgânico', before: '2.500', after: '7.500', improvement: '+300%' },
      { metric: 'Posições no Top 10', before: '15', after: '67', improvement: '+347%' },
      { metric: 'Conversões', before: '45', after: '189', improvement: '+320%' }
    ],
    images: ['/placeholder.svg'],
    tags: ['SEO', 'Tráfego', 'Conversão'],
    isPublic: true,
    featured: true,
    createdAt: '2024-01-01',
    projectId: '1'
  },
  {
    id: '2',
    title: 'Campanha de Ads com ROI de 500%',
    clientId: '2',
    client: { id: '2', name: 'Green Energy', logo: '/placeholder.svg' },
    category: 'Paid Ads',
    description: 'Campanha estratégica no Google Ads e Facebook que gerou ROI excepcional.',
    summary: 'Otimização completa de campanhas resultou em ROI 5x maior que a média do setor.',
    results: [
      { metric: 'ROI', before: '150%', after: '500%', improvement: '+233%' },
      { metric: 'CPA', before: 'R$ 85', after: 'R$ 35', improvement: '-59%' },
      { metric: 'Conversões', before: '120', after: '450', improvement: '+275%' }
    ],
    images: ['/placeholder.svg'],
    tags: ['Google Ads', 'Facebook Ads', 'ROI'],
    isPublic: true,
    featured: false,
    createdAt: '2024-01-15'
  }
];

export const mockAccess: Access[] = [
  {
    id: '1',
    platform: 'Google Ads',
    clientId: '1',
    client: { id: '1', name: 'Tech Solutions', logo: '/placeholder.svg' },
    login: 'admin@techsolutions.com',
    password: 'TechAds2024!',
    url: 'https://ads.google.com',
    category: 'ads',
    isActive: true,
    lastUsed: '2024-01-20',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    platform: 'Meta Business',
    clientId: '1',
    client: { id: '1', name: 'Tech Solutions', logo: '/placeholder.svg' },
    login: 'marketing@techsolutions.com',
    password: 'MetaBiz2024#',
    url: 'https://business.facebook.com',
    category: 'ads',
    isActive: true,
    lastUsed: '2024-01-19',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-19'
  },
  {
    id: '3',
    platform: 'Google Analytics',
    clientId: '2',
    client: { id: '2', name: 'Green Energy', logo: '/placeholder.svg' },
    login: 'analytics@greenenergy.com',
    password: 'Green2024Analytics$',
    url: 'https://analytics.google.com',
    category: 'analytics',
    isActive: true,
    lastUsed: '2024-01-18',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18'
  }
];

// Dados expandidos para o usuário atual
export const mockCurrentUser: UserProductivity = {
  userId: '1',
  user: {
    id: '1',
    name: 'Ana Silva',
    avatar: '/placeholder.svg',
    position: 'Gerente de Projetos'
  },
  department: 'Marketing Digital',
  level: 8,
  badges: ['🏆', '⭐', '💎', '🚀', '🎯', '⚡', '🔥', '💪'],
  
  // Border customization (like team members)
  borderPattern: 'gradient',
  borderColor: '#3b82f6',
  
  // Personal/Professional Info
  hireDate: '2022-03-15',
  timeInCompany: '2 anos e 4 meses',
  lastPromotion: {
    date: '2023-08-01',
    previousRole: 'Analista Sênior'
  },
  timezone: 'GMT-3 (São Paulo)',
  certifications: [
    { name: 'PMP', validUntil: '2025-12-31', issuer: 'PMI' },
    { name: 'Scrum Master', validUntil: '2024-08-15', issuer: 'Scrum Alliance' },
    { name: 'Google Analytics', validUntil: '2024-10-20', issuer: 'Google' }
  ],
  keyProjects: ['Campanha Black Friday 2023', 'Rebranding Cliente X', 'Plataforma E-commerce'],
  
  // Engagement Metrics
  activeStreak: 23,
  punctualityIndex: 94,
  collaborationIndex: 78,
  innovationScore: 85,
  clientSatisfaction: 4.7,
  
  // Task metrics
  tasksCompleted: 47,
  tasksOpen: 12,
  tasksInProgress: 8,
  overdueTasks: 3,
  overdueTasksList: [
    { 
      id: '1', 
      title: 'Revisão do material publicitário', 
      client: 'Tech Solutions',
      dueDate: '2024-01-18', 
      priority: 'high',
      daysOverdue: 2
    },
    { 
      id: '2', 
      title: 'Aprovação do briefing', 
      client: 'Green Energy',
      dueDate: '2024-01-19', 
      priority: 'medium',
      daysOverdue: 1
    },
    { 
      id: '3', 
      title: 'Entrega do relatório mensal', 
      client: 'StartupTech',
      dueDate: '2024-01-20', 
      priority: 'high',
      daysOverdue: 0
    }
  ],
  
  // Today's priorities
  todaysPriorities: [
    {
      id: '1',
      title: 'Reunião de alinhamento estratégico',
      type: 'meeting',
      time: '14:00',
      client: 'Tech Solutions',
      status: 'pending',
      estimatedTime: '1h'
    },
    {
      id: '2',
      title: 'Entrega do layout final',
      type: 'delivery',
      time: '17:00',
      client: 'Design Corp',
      status: 'in-progress',
      estimatedTime: '2h'
    },
    {
      id: '3',
      title: 'Review do código front-end',
      type: 'task',
      time: '16:30',
      status: 'pending',
      estimatedTime: '45min'
    },
    {
      id: '4',
      title: 'Call com cliente internacional',
      type: 'meeting',
      time: '10:00',
      client: 'Global Inc',
      status: 'completed',
      estimatedTime: '30min'
    }
  ],
  
  // Project metrics
  activeProjects: 5,
  completedProjects: 23,
  hoursWorkedWeek: 42,
  hoursWorkedMonth: 168,
  productivityScore: 87,
  avgCompletionTime: 2.3,
  collaborativeProjects: 3,
  individualProjects: 2,
  
  skills: [
    { name: 'Gestão de Projetos', level: 95 },
    { name: 'Marketing Digital', level: 88 },
    { name: 'Análise de Dados', level: 76 },
    { name: 'Liderança', level: 84 },
    { name: 'Comunicação', level: 91 }
  ],
  tasksByPriority: {
    high: 8,
    medium: 15,
    low: 24
  },
  monthlyEvolution: [
    { month: 'Set', score: 82 },
    { month: 'Out', score: 85 },
    { month: 'Nov', score: 84 },
    { month: 'Dez', score: 89 },
    { month: 'Jan', score: 87 }
  ],
  recentAchievements: [
    { badge: '🏆', name: 'Top Performer', date: '2024-01-15' },
    { badge: '⚡', name: 'Fast Delivery', date: '2024-01-10' },
    { badge: '🎯', name: 'Goal Crusher', date: '2024-01-05' }
  ],
  pointsHistory: [
    { date: '2024-01-20', points: 150, activity: 'Projeto concluído' },
    { date: '2024-01-18', points: 50, activity: 'Tarefa urgente finalizada' },
    { date: '2024-01-15', points: 100, activity: 'Meta mensal atingida' }
  ],
  goals: [
    {
      id: '1',
      title: 'Completar 50 tarefas este mês',
      target: 50,
      current: 47,
      deadline: '2024-01-31'
    },
    {
      id: '2',
      title: 'Finalizar 3 projetos grandes',
      target: 3,
      current: 2,
      deadline: '2024-01-31'
    },
    {
      id: '3',
      title: 'Atingir 90% de produtividade',
      target: 90,
      current: 87,
      deadline: '2024-01-31'
    }
  ]
};

export const mockUserProductivity: UserProductivity[] = [mockCurrentUser];
