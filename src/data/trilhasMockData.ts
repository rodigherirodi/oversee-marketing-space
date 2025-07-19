
import { TrilhaDetalhada } from '../types/trilhas';

export const mockTrilhasDetalhadas: TrilhaDetalhada[] = [
  {
    id: '1',
    title: 'Gerente de Projetos - Completo',
    description: 'Trilha completa para formação de gestores de projeto com metodologias ágeis e ferramentas modernas',
    duration: '45 horas',
    students: 156,
    rating: 4.9,
    progress: 65,
    level: 'Intermediário',
    targetRole: 'gerente-projetos',
    estimatedHours: 45,
    certificate: true,
    prerequisites: ['Experiência básica em gestão', 'Conhecimento de Excel'],
    image: '📊',
    tags: ['Gestão', 'Agile', 'Liderança', 'Scrum'],
    category: 'cargo',
    completedCourses: 5,
    totalCourses: 8,
    courses: [
      {
        id: 'gp-1',
        title: 'Fundamentos da Gestão de Projetos',
        description: 'Conceitos básicos, ciclo de vida de projetos e metodologias tradicionais',
        duration: '6 horas',
        order: 1,
        completed: true,
        mandatory: true,
        topics: ['PMI', 'Escopo', 'Tempo', 'Custos'],
        materials: ['slides-fundamentos.pdf', 'checklist-projeto.pdf']
      },
      {
        id: 'gp-2',
        title: 'Metodologias Ágeis - Scrum',
        description: 'Scrum framework, papéis, eventos e artefatos',
        duration: '8 horas',
        order: 2,
        completed: true,
        mandatory: true,
        topics: ['Scrum Master', 'Product Owner', 'Sprint', 'Backlog'],
        videoUrl: 'https://example.com/scrum-course'
      },
      {
        id: 'gp-3',
        title: 'Liderança e Comunicação',
        description: 'Habilidades de liderança e comunicação para gestores',
        duration: '5 horas',
        order: 3,
        completed: true,
        mandatory: true,
        topics: ['Liderança', 'Comunicação', 'Feedback', 'Conflitos']
      },
      {
        id: 'gp-4',
        title: 'Ferramentas de Gestão - ClickUp',
        description: 'Dominando o ClickUp para gestão de projetos e equipes',
        duration: '4 horas',
        order: 4,
        completed: true,
        mandatory: true,
        topics: ['ClickUp', 'Automação', 'Relatórios', 'Dashboards']
      },
      {
        id: 'gp-5',
        title: 'Gestão de Stakeholders',
        description: 'Como gerenciar expectativas e relacionamentos com stakeholders',
        duration: '3 horas',
        order: 5,
        completed: true,
        mandatory: true,
        topics: ['Stakeholders', 'Expectativas', 'Comunicação', 'Negociação']
      },
      {
        id: 'gp-6',
        title: 'Métricas e KPIs de Projeto',
        description: 'Definindo e acompanhando métricas de sucesso',
        duration: '4 horas',
        order: 6,
        completed: false,
        mandatory: true,
        topics: ['KPIs', 'Métricas', 'ROI', 'Performance']
      },
      {
        id: 'gp-7',
        title: 'Gestão de Riscos',
        description: 'Identificação, análise e tratamento de riscos',
        duration: '5 horas',
        order: 7,
        completed: false,
        mandatory: true,
        topics: ['Riscos', 'Análise', 'Mitigação', 'Contingência']
      },
      {
        id: 'gp-8',
        title: 'Gestão de Mudanças',
        description: 'Como conduzir mudanças organizacionais com sucesso',
        duration: '4 horas',
        order: 8,
        completed: false,
        mandatory: false,
        topics: ['Change Management', 'Resistência', 'Comunicação', 'Adoção']
      }
    ],
    materialsComplements: [
      {
        id: 'mat-1',
        title: 'Template de Plano de Projeto',
        type: 'pdf',
        url: '/materials/template-plano-projeto.pdf',
        description: 'Template completo para iniciar qualquer projeto'
      },
      {
        id: 'mat-2',
        title: 'Checklist de Gestão de Riscos',
        type: 'pdf',
        url: '/materials/checklist-riscos.pdf'
      },
      {
        id: 'mat-3',
        title: 'Artigo: Melhores Práticas em Scrum',
        type: 'article',
        url: 'https://example.com/scrum-best-practices'
      }
    ]
  },
  {
    id: '2',
    title: 'Analista de Tráfego - Performance',
    description: 'Especialização completa em tráfego pago e análise de performance digital',
    duration: '55 horas',
    students: 284,
    rating: 4.8,
    progress: 30,
    level: 'Intermediário',
    targetRole: 'analista-trafego',
    estimatedHours: 55,
    certificate: true,
    prerequisites: ['Conhecimento básico de marketing digital'],
    image: '📈',
    tags: ['Google Ads', 'Facebook Ads', 'Analytics', 'Performance'],
    category: 'cargo',
    completedCourses: 4,
    totalCourses: 12,
    courses: [
      {
        id: 'at-1',
        title: 'Fundamentos do Tráfego Pago',
        description: 'Conceitos básicos, tipos de campanha e métricas fundamentais',
        duration: '5 horas',
        order: 1,
        completed: true,
        mandatory: true,
        topics: ['CPC', 'CPM', 'CTR', 'ROI', 'ROAS']
      },
      {
        id: 'at-2',
        title: 'Google Ads - Iniciante',
        description: 'Configuração de contas, campanhas de pesquisa e display',
        duration: '8 horas',
        order: 2,
        completed: true,
        mandatory: true,
        topics: ['Search Ads', 'Display', 'Keywords', 'Quality Score']
      },
      {
        id: 'at-3',
        title: 'Facebook e Instagram Ads',
        description: 'Meta Business Manager, públicos e criativos',
        duration: '6 horas',
        order: 3,
        completed: true,
        mandatory: true,
        topics: ['Meta Business', 'Públicos', 'Pixel', 'Criativos']
      },
      {
        id: 'at-4',
        title: 'Google Analytics 4',
        description: 'Configuração, análise e relatórios no GA4',
        duration: '7 horas',
        order: 4,
        completed: true,
        mandatory: true,
        topics: ['GA4', 'Eventos', 'Conversões', 'Funis']
      }
      // ... mais cursos
    ],
    materialsComplements: [
      {
        id: 'mat-at-1',
        title: 'Planilha de Controle de Campanhas',
        type: 'pdf',
        url: '/materials/planilha-campanhas.xlsx'
      },
      {
        id: 'mat-at-2',
        title: 'Guia de Otimização de Anúncios',
        type: 'pdf',
        url: '/materials/guia-otimizacao.pdf'
      }
    ]
  },
  {
    id: '3',
    title: 'Novo Colaborador - Onboarding',
    description: 'Trilha de integração para novos membros da equipe',
    duration: '20 horas',
    students: 98,
    rating: 4.7,
    progress: 0,
    level: 'Iniciante',
    targetRole: 'novo-colaborador',
    estimatedHours: 20,
    certificate: true,
    prerequisites: [],
    image: '🎯',
    tags: ['Onboarding', 'Cultura', 'Ferramentas', 'Processos'],
    category: 'onboarding',
    completedCourses: 0,
    totalCourses: 6,
    courses: [
      {
        id: 'nc-1',
        title: 'Bem-vindo à Empresa',
        description: 'História, missão, valores e cultura organizacional',
        duration: '2 horas',
        order: 1,
        completed: false,
        mandatory: true,
        topics: ['História', 'Valores', 'Cultura', 'Organograma']
      },
      {
        id: 'nc-2',
        title: 'Ferramentas Essenciais',
        description: 'ClickUp, Slack, Google Workspace e outras ferramentas',
        duration: '4 horas',
        order: 2,
        completed: false,
        mandatory: true,
        topics: ['ClickUp', 'Slack', 'Google', 'Asana']
      }
      // ... mais cursos
    ],
    materialsComplements: [
      {
        id: 'mat-nc-1',
        title: 'Manual do Colaborador',
        type: 'pdf',
        url: '/materials/manual-colaborador.pdf'
      }
    ]
  },
  {
    id: '4',
    title: 'Designer UX/UI - Avançado',
    description: 'Especialização em design de interfaces e experiência do usuário',
    duration: '40 horas',
    students: 167,
    rating: 4.9,
    progress: 100,
    level: 'Avançado',
    targetRole: 'designer',
    estimatedHours: 40,
    certificate: true,
    prerequisites: ['Conhecimento básico de design', 'Figma básico'],
    image: '🎨',
    tags: ['UX', 'UI', 'Figma', 'Design Systems'],
    category: 'cargo',
    completedCourses: 9,
    totalCourses: 9,
    courses: [
      {
        id: 'ds-1',
        title: 'Fundamentos de UX Design',
        description: 'Princípios de experiência do usuário e design thinking',
        duration: '6 horas',
        order: 1,
        completed: true,
        mandatory: true,
        topics: ['UX', 'Design Thinking', 'Personas', 'Jornada']
      }
      // ... mais cursos
    ],
    materialsComplements: []
  }
];

// Dados simulados de progresso do usuário
export const mockUserTrilhaData = {
  userId: '1',
  trilhaProgresses: {
    '1': {
      trilhaId: '1',
      completedCourses: ['gp-1', 'gp-2', 'gp-3', 'gp-4', 'gp-5'],
      startedAt: '2024-01-15',
      lastAccessed: '2024-01-20',
      notes: 'Trilha muito completa! Gostei especialmente da parte de Scrum.',
      certificateEarned: false
    },
    '2': {
      trilhaId: '2',
      completedCourses: ['at-1', 'at-2', 'at-3', 'at-4'],
      startedAt: '2024-01-10',
      lastAccessed: '2024-01-18',
      notes: '',
      certificateEarned: false
    },
    '4': {
      trilhaId: '4',
      completedCourses: ['ds-1'], // todos os cursos
      startedAt: '2024-01-01',
      lastAccessed: '2024-01-15',
      notes: 'Excelente trilha! Aprendi muito sobre design systems.',
      certificateEarned: true
    }
  },
  totalHoursStudied: 85,
  certificatesEarned: 1,
  completedTrilhas: 1
};
