
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'social' | 'professional' | 'celebration';
  description: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  isUserAttending: boolean;
}

export interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'task' | 'meeting';
  completed: boolean;
  dueDate?: string;
  duration?: string;
}

export interface CareerLevel {
  id: string;
  title: string;
  department: string;
  level: number;
  salaryRange: {
    min: number;
    max: number;
  };
  requirements: string[];
  benefits: string[];
}

export interface Recognition {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  achievement: string;
  date: string;
  kudos: number;
  category: 'performance' | 'teamwork' | 'innovation' | 'leadership';
}

export interface CultureSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  materials: {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'quiz';
    url?: string;
    duration?: string;
  }[];
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Happy Hour Mensal',
    date: '2024-01-25',
    time: '18:00',
    type: 'social',
    description: 'Confraternização mensal da equipe no terraço',
    location: 'Terraço da Agência',
    attendees: 15,
    maxAttendees: 25,
    isUserAttending: true
  },
  {
    id: '2',
    title: 'Workshop de Liderança',
    date: '2024-01-30',
    time: '14:00',
    type: 'professional',
    description: 'Desenvolvimento de habilidades de liderança',
    location: 'Sala de Reuniões',
    attendees: 8,
    maxAttendees: 12,
    isUserAttending: false
  },
  {
    id: '3',
    title: 'Aniversário da Empresa',
    date: '2024-02-15',
    time: '19:00',
    type: 'celebration',
    description: 'Celebração dos 5 anos da agência',
    location: 'Salão de Eventos',
    attendees: 35,
    isUserAttending: true
  }
];

export const mockOnboardingItems: OnboardingItem[] = [
  {
    id: '1',
    title: 'Leitura do Manual da Empresa',
    description: 'Conhecer valores, missão e políticas internas',
    type: 'document',
    completed: true
  },
  {
    id: '2',
    title: 'Vídeo de Boas-vindas do CEO',
    description: 'Mensagem de boas-vindas e visão da empresa',
    type: 'video',
    completed: true,
    duration: '10 min'
  },
  {
    id: '3',
    title: 'Reunião com RH',
    description: 'Apresentação de benefícios e procedimentos',
    type: 'meeting',
    completed: false,
    dueDate: '2024-01-25'
  },
  {
    id: '4',
    title: 'Setup do Ambiente de Trabalho',
    description: 'Configuração de equipamentos e acessos',
    type: 'task',
    completed: false,
    dueDate: '2024-01-23'
  }
];

export const mockCareerLevels: CareerLevel[] = [
  {
    id: '1',
    title: 'Analista Junior',
    department: 'Marketing Digital',
    level: 1,
    salaryRange: { min: 3500, max: 4500 },
    requirements: [
      'Ensino superior completo',
      'Conhecimento básico em ferramentas digitais',
      'Proatividade e vontade de aprender'
    ],
    benefits: ['VR', 'VT', 'Plano de saúde']
  },
  {
    id: '2',
    title: 'Analista Pleno',
    department: 'Marketing Digital',
    level: 2,
    salaryRange: { min: 4500, max: 6500 },
    requirements: [
      '2+ anos de experiência',
      'Domínio de ferramentas de análise',
      'Capacidade de liderar pequenos projetos'
    ],
    benefits: ['VR', 'VT', 'Plano de saúde', 'PLR']
  },
  {
    id: '3',
    title: 'Analista Senior',
    department: 'Marketing Digital',
    level: 3,
    salaryRange: { min: 6500, max: 9000 },
    requirements: [
      '4+ anos de experiência',
      'Liderança de projetos complexos',
      'Mentoria de junior/pleno'
    ],
    benefits: ['VR', 'VT', 'Plano de saúde', 'PLR', 'Home Office']
  }
];

export const mockRecognitions: Recognition[] = [
  {
    id: '1',
    employeeName: 'Ana Silva',
    employeeAvatar: '/placeholder.svg',
    achievement: 'Superou meta de vendas em 150% no último trimestre',
    date: '2024-01-20',
    kudos: 12,
    category: 'performance'
  },
  {
    id: '2',
    employeeName: 'Pedro Lima',
    employeeAvatar: '/placeholder.svg',
    achievement: 'Desenvolveu nova funcionalidade que otimizou o processo em 30%',
    date: '2024-01-18',
    kudos: 8,
    category: 'innovation'
  },
  {
    id: '3',
    employeeName: 'Marina Costa',
    employeeAvatar: '/placeholder.svg',
    achievement: 'Liderou com sucesso a integração de novo membro da equipe',
    date: '2024-01-15',
    kudos: 15,
    category: 'leadership'
  }
];

export const mockCultureSections: CultureSection[] = [
  {
    id: '1',
    title: 'Nossos Valores',
    description: 'Conheça os valores fundamentais que guiam nossa cultura',
    icon: '🎯',
    materials: [
      { id: '1', title: 'Guia dos Valores', type: 'pdf', duration: '15 min' },
      { id: '2', title: 'Vídeo Explicativo', type: 'video', duration: '8 min' },
      { id: '3', title: 'Quiz sobre Valores', type: 'quiz', duration: '5 min' }
    ]
  },
  {
    id: '2',
    title: 'Código de Conduta',
    description: 'Diretrizes para um ambiente de trabalho respeitoso',
    icon: '⚖️',
    materials: [
      { id: '4', title: 'Manual de Conduta', type: 'pdf', duration: '20 min' },
      { id: '5', title: 'Casos Práticos', type: 'video', duration: '12 min' }
    ]
  },
  {
    id: '3',
    title: 'Diversidade e Inclusão',
    description: 'Nosso compromisso com um ambiente diverso e inclusivo',
    icon: '🌈',
    materials: [
      { id: '6', title: 'Políticas de D&I', type: 'pdf', duration: '10 min' },
      { id: '7', title: 'Treinamento D&I', type: 'video', duration: '25 min' }
    ]
  }
];
