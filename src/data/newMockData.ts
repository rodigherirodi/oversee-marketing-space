
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

export const mockUserProductivity: UserProductivity[] = [
  {
    userId: '1',
    user: {
      id: '1',
      name: 'Ana Silva',
      avatar: '/placeholder.svg',
      position: 'Gerente de Projetos'
    },
    tasksCompleted: 24,
    tasksInProgress: 8,
    overdueTasks: 2,
    activeProjects: 3,
    completedProjects: 12,
    hoursWorked: 42,
    productivityScore: 87,
    goals: [
      {
        id: '1',
        title: 'Completar 30 tarefas este mês',
        target: 30,
        current: 24,
        deadline: '2024-01-31'
      },
      {
        id: '2',
        title: 'Finalizar 2 projetos',
        target: 2,
        current: 1,
        deadline: '2024-01-31'
      }
    ]
  },
  {
    userId: '2',
    user: {
      id: '2',
      name: 'Carlos Santos',
      avatar: '/placeholder.svg',
      position: 'Designer'
    },
    tasksCompleted: 18,
    tasksInProgress: 6,
    overdueTasks: 1,
    activeProjects: 2,
    completedProjects: 8,
    hoursWorked: 38,
    productivityScore: 79,
    goals: [
      {
        id: '3',
        title: 'Criar 20 artes este mês',
        target: 20,
        current: 16,
        deadline: '2024-01-31'
      }
    ]
  }
];
