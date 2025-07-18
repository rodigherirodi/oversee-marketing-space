import { Client, Project, Task, TeamMember } from '../types/entities';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    segment: 'Tecnologia',
    logo: '🏢',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    status: 'active',
    size: 'large',
    address: 'São Paulo, SP',
    website: 'https://techcorp.com',
    primaryContact: {
      name: 'Ana Silva',
      phone: '(11) 99999-9999',
      email: 'ana@techcorp.com'
    },
    financialContact: {
      name: 'Carlos Mendes',
      phone: '(11) 88888-8888',
      email: 'carlos@techcorp.com'
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/techcorp',
      instagram: 'https://instagram.com/techcorp'
    },
    contractType: 'recurring',
    temperature: 'hot',
    nps: 9,
    entryDate: '2024-01-15',
    responsibleManager: 'Marina Costa',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'E-commerce Plus',
    segment: 'E-commerce',
    logo: '🛒',
    cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    status: 'active',
    size: 'PME',
    address: 'Rio de Janeiro, RJ',
    website: 'https://ecommerceplus.com',
    primaryContact: {
      name: 'João Santos',
      phone: '(21) 99999-9999',
      email: 'joao@ecommerceplus.com'
    },
    financialContact: {
      name: 'Maria Oliveira',
      phone: '(21) 88888-8888',
      email: 'maria@ecommerceplus.com'
    },
    socialMedia: {
      facebook: 'https://facebook.com/ecommerceplus',
      instagram: 'https://instagram.com/ecommerceplus'
    },
    contractType: 'project',
    temperature: 'warm',
    nps: 8,
    entryDate: '2024-02-20',
    responsibleManager: 'Pedro Lima',
    createdAt: '2024-02-20'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Campanha Black Friday',
    description: 'Campanha completa para Black Friday com landing page e materiais',
    clientId: '1',
    client: mockClients[0],
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-10-01',
    endDate: '2024-11-30',
    budget: 50000,
    cover: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    tags: ['marketing', 'e-commerce', 'campanha'],
    teamMembers: ['Ana Silva', 'Carlos Mendes', 'Marina Costa'],
    progress: 65,
    createdAt: '2024-10-01'
  },
  {
    id: '2',
    name: 'Rebranding Completo',
    description: 'Renovação completa da identidade visual e materiais',
    clientId: '2',
    client: mockClients[1],
    status: 'review',
    priority: 'medium',
    startDate: '2024-09-15',
    endDate: '2024-12-15',
    budget: 30000,
    cover: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
    tags: ['branding', 'design', 'identidade'],
    teamMembers: ['João Santos', 'Maria Oliveira'],
    progress: 40,
    createdAt: '2024-09-15'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Criação de landing page',
    description: 'Desenvolver landing page para campanha de Black Friday',
    status: 'doing',
    priority: 'high',
    assignee: 'Ana Silva',
    clientId: '1',
    client: mockClients[0],
    projectId: '1',
    project: mockProjects[0],
    dueDate: '2024-11-20',
    tags: ['design', 'desenvolvimento', 'urgente'],
    createdAt: '2024-11-10'
  },
  {
    id: '2',
    title: 'Análise de métricas',
    description: 'Relatório mensal de performance das campanhas',
    status: 'todo',
    priority: 'medium',
    assignee: 'Carlos Mendes',
    clientId: '2',
    client: mockClients[1],
    projectId: '2',
    project: mockProjects[1],
    dueDate: '2024-11-25',
    tags: ['análise', 'relatório'],
    createdAt: '2024-11-12'
  },
  {
    id: '3',
    title: 'Copy para social media',
    description: 'Criação de copies para posts da semana',
    status: 'review',
    priority: 'medium',
    assignee: 'Marina Costa',
    clientId: '1',
    client: mockClients[0],
    projectId: '1',
    project: mockProjects[0],
    dueDate: '2024-11-18',
    tags: ['copywriting', 'social'],
    createdAt: '2024-11-08'
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Marina Costa',
    email: 'marina@agencia.com',
    position: 'Gerente de Projetos',
    hireDate: '2022-01-15',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b766?w=200&h=200&fit=crop&crop=face',
    activeProjectsCount: 8,
    level: 9,
    badges: ['🏆', '⭐', '💎', '🚀'],
    borderColor: 'hsl(217, 91%, 60%)',
    borderPattern: 'gradient',
    department: 'Gestão',
    status: 'active'
  },
  {
    id: '2',
    name: 'Pedro Lima',
    email: 'pedro@agencia.com',
    position: 'Desenvolvedor Sênior',
    hireDate: '2021-05-20',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    activeProjectsCount: 5,
    level: 8,
    badges: ['💻', '⚡', '🔥'],
    borderColor: 'hsl(142, 76%, 36%)',
    borderPattern: 'stripes',
    department: 'Tecnologia',
    status: 'active'
  },
  {
    id: '3',
    name: 'Ana Silva',
    email: 'ana@agencia.com',
    position: 'UX/UI Designer',
    hireDate: '2023-03-10',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    activeProjectsCount: 6,
    level: 7,
    badges: ['🎨', '✨', '🏅'],
    borderColor: 'hsl(280, 100%, 70%)',
    borderPattern: 'dots',
    department: 'Design',
    status: 'active'
  },
  {
    id: '4',
    name: 'Carlos Mendes',
    email: 'carlos@agencia.com',
    position: 'Analista de Dados',
    hireDate: '2022-08-05',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    activeProjectsCount: 3,
    level: 6,
    badges: ['📊', '🧮', '📈'],
    borderColor: 'hsl(25, 95%, 53%)',
    borderPattern: 'solid',
    department: 'Análise',
    status: 'active'
  },
  {
    id: '5',
    name: 'Sofia Rodrigues',
    email: 'sofia@agencia.com',
    position: 'Copywriter',
    hireDate: '2023-01-12',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    activeProjectsCount: 4,
    level: 5,
    badges: ['✍️', '📝', '💡'],
    borderColor: 'hsl(340, 82%, 52%)',
    borderPattern: 'gradient',
    department: 'Conteúdo',
    status: 'active'
  },
  {
    id: '6',
    name: 'João Santos',
    email: 'joao@agencia.com',
    position: 'Designer Gráfico',
    hireDate: '2023-06-18',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    activeProjectsCount: 7,
    level: 6,
    badges: ['🖌️', '🎨', '⭐'],
    borderColor: 'hsl(197, 37%, 24%)',
    borderPattern: 'stripes',
    department: 'Design',
    status: 'vacation'
  },
  {
    id: '7',
    name: 'Maria Oliveira',
    email: 'maria@agencia.com',
    position: 'Social Media Manager',
    hireDate: '2022-11-30',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
    activeProjectsCount: 9,
    level: 8,
    badges: ['📱', '📈', '💫', '🌟'],
    borderColor: 'hsl(262, 83%, 58%)',
    borderPattern: 'dots',
    department: 'Marketing',
    status: 'active'
  },
  {
    id: '8',
    name: 'Roberto Silva',
    email: 'roberto@agencia.com',
    position: 'Desenvolvedor Frontend',
    hireDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    activeProjectsCount: 2,
    level: 4,
    badges: ['⚛️', '🌐'],
    borderColor: 'hsl(43, 96%, 56%)',
    borderPattern: 'solid',
    department: 'Tecnologia',
    status: 'active'
  }
];
