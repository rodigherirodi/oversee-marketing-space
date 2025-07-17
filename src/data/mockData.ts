import { Project, Client, Task, TeamMember, Commercial } from '../types';

// Mock team members
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@company.com',
    avatar: undefined,
    role: 'Designer',
    department: 'Design',
    status: 'active',
    skills: ['UI/UX', 'Figma', 'Design System'],
    hourlyRate: 80,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    email: 'carlos@company.com',
    avatar: undefined,
    role: 'Analista',
    department: 'Analytics',
    status: 'active',
    skills: ['Google Analytics', 'Data Studio', 'SQL'],
    hourlyRate: 75,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Marina Costa',
    email: 'marina@company.com',
    avatar: undefined,
    role: 'Copywriter',
    department: 'Content',
    status: 'active',
    skills: ['Copywriting', 'Content Strategy', 'SEO'],
    hourlyRate: 70,
    createdAt: '2024-01-20'
  }
];

// Mock clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Cliente A',
    email: 'contato@clientea.com',
    phone: '+55 11 99999-9999',
    company: 'Empresa A Ltda',
    avatar: undefined,
    cover: undefined,
    color: '#3B82F6',
    status: 'active',
    contractValue: 50000,
    startDate: '2024-01-01',
    projects: ['1', '3'],
    tags: ['Premium', 'E-commerce'],
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zip: '01234-567'
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Cliente B',
    email: 'contato@clienteb.com',
    phone: '+55 11 88888-8888',
    company: 'Empresa B S.A.',
    avatar: undefined,
    cover: undefined,
    color: '#8B5CF6',
    status: 'active',
    contractValue: 30000,
    startDate: '2024-02-01',
    projects: ['2'],
    tags: ['SaaS', 'Tech'],
    address: {
      street: 'Av. Paulista, 456',
      city: 'São Paulo',
      state: 'SP',
      zip: '01234-567'
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-02-01'
  },
  {
    id: '3',
    name: 'Cliente C',
    email: 'contato@clientec.com',
    phone: '+55 11 77777-7777',
    company: 'Startup C',
    avatar: undefined,
    cover: undefined,
    color: '#10B981',
    status: 'onboarding',
    contractValue: 25000,
    startDate: '2024-03-01',
    projects: [],
    tags: ['Startup', 'Fintech'],
    createdAt: '2024-02-15',
    updatedAt: '2024-03-01'
  }
];

// Mock projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Campanha Black Friday',
    description: 'Campanha completa para Black Friday com landing page, ads e email marketing',
    clientId: '1',
    status: 'active',
    priority: 'high',
    startDate: '2024-10-01',
    endDate: '2024-11-30',
    budget: 25000,
    progress: 65,
    cover: undefined,
    color: '#F59E0B',
    tags: ['E-commerce', 'Campanha', 'Black Friday'],
    createdAt: '2024-10-01',
    updatedAt: '2024-10-15'
  },
  {
    id: '2',
    name: 'Relatórios Mensais',
    description: 'Automação e padronização dos relatórios mensais de performance',
    clientId: '2',
    status: 'active',
    priority: 'medium',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    budget: 15000,
    progress: 40,
    cover: undefined,
    color: '#8B5CF6',
    tags: ['Analytics', 'Automação', 'Relatórios'],
    createdAt: '2024-09-01',
    updatedAt: '2024-10-01'
  },
  {
    id: '3',
    name: 'Social Media',
    description: 'Gestão completa das redes sociais com conteúdo e engajamento',
    clientId: '1',
    status: 'active',
    priority: 'medium',
    startDate: '2024-08-01',
    endDate: '2024-12-31',
    budget: 20000,
    progress: 80,
    cover: undefined,
    color: '#EC4899',
    tags: ['Social Media', 'Conteúdo', 'Engajamento'],
    createdAt: '2024-08-01',
    updatedAt: '2024-10-10'
  }
];

// Mock tasks with relationships
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Criação de landing page',
    description: 'Desenvolver landing page para campanha de Black Friday',
    status: 'doing',
    priority: 'high',
    assigneeId: '1',
    clientId: '1',
    projectId: '1',
    dueDate: '2024-10-20',
    tags: ['design', 'desenvolvimento', 'urgente'],
    createdAt: '2024-10-10',
    updatedAt: '2024-10-12',
    estimatedHours: 24,
    actualHours: 16
  },
  {
    id: '2',
    title: 'Análise de métricas',
    description: 'Relatório mensal de performance das campanhas',
    status: 'todo',
    priority: 'medium',
    assigneeId: '2',
    clientId: '2',
    projectId: '2',
    dueDate: '2024-10-25',
    tags: ['análise', 'relatório'],
    createdAt: '2024-10-12',
    updatedAt: '2024-10-12',
    estimatedHours: 8,
    actualHours: 0
  },
  {
    id: '3',
    title: 'Copy para social media',
    description: 'Criação de copies para posts da semana',
    status: 'review',
    priority: 'medium',
    assigneeId: '3',
    clientId: '1',
    projectId: '3',
    dueDate: '2024-10-18',
    tags: ['copywriting', 'social'],
    createdAt: '2024-10-08',
    updatedAt: '2024-10-15',
    estimatedHours: 6,
    actualHours: 5
  },
  {
    id: '4',
    title: 'Setup Google Analytics',
    description: 'Configurar eventos e conversões no GA4',
    status: 'done',
    priority: 'high',
    assigneeId: '2',
    clientId: '1',
    projectId: '1',
    dueDate: '2024-10-15',
    tags: ['analytics', 'tracking'],
    createdAt: '2024-10-05',
    updatedAt: '2024-10-14',
    estimatedHours: 4,
    actualHours: 3
  }
];

// Mock commercial data
export const mockCommercials: Commercial[] = [
  {
    id: '1',
    title: 'Proposta - Empresa D',
    clientId: '4',
    value: 45000,
    status: 'proposal',
    probability: 70,
    expectedCloseDate: '2024-11-15',
    source: 'Indicação',
    notes: 'Cliente interessado em campanhas de performance',
    createdAt: '2024-10-01',
    updatedAt: '2024-10-10'
  },
  {
    id: '2',
    title: 'Negociação - Startup E',
    clientId: '5',
    value: 30000,
    status: 'negotiation',
    probability: 50,
    expectedCloseDate: '2024-10-30',
    source: 'Website',
    notes: 'Aguardando aprovação do orçamento',
    createdAt: '2024-09-20',
    updatedAt: '2024-10-05'
  }
];