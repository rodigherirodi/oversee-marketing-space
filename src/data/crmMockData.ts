import { Lead, Pipeline, PipelineStage, Activity, CustomField, CRMMetrics, RelatedContact, LeadActivity, LeadProduct } from '@/types/crm';

export const pipelines: Pipeline[] = [
  {
    id: 'padrao',
    name: 'Padrão',
    description: 'Pipeline geral para todos os tipos de leads',
    isDefault: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    stages: [
      { id: 'em-contato', name: 'Em Contato', color: 'bg-blue-500', order: 1, probability: 25, isClosedStage: false, stageType: 'open' },
      { id: 'reuniao', name: 'Reunião', color: 'bg-yellow-500', order: 2, probability: 50, isClosedStage: false, stageType: 'open' },
      { id: 'proposta-enviada', name: 'Proposta Enviada', color: 'bg-purple-500', order: 3, probability: 75, isClosedStage: false, stageType: 'open' },
      { id: 'venda', name: 'Venda', color: 'bg-green-500', order: 4, probability: 100, isClosedStage: true, stageType: 'won' },
      { id: 'perdido', name: 'Perdido', color: 'bg-red-500', order: 5, probability: 0, isClosedStage: true, stageType: 'lost' }
    ]
  },
  {
    id: 'assessoria',
    name: 'Assessoria',
    description: 'Pipeline específico para serviços de assessoria',
    isDefault: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    stages: [
      { id: 'em-contato', name: 'Em Contato', color: 'bg-blue-500', order: 1, probability: 25, isClosedStage: false, stageType: 'open' },
      { id: 'reuniao', name: 'Reunião', color: 'bg-yellow-500', order: 2, probability: 50, isClosedStage: false, stageType: 'open' },
      { id: 'proposta-enviada', name: 'Proposta Enviada', color: 'bg-purple-500', order: 3, probability: 75, isClosedStage: false, stageType: 'open' },
      { id: 'venda', name: 'Venda', color: 'bg-green-500', order: 4, probability: 100, isClosedStage: true, stageType: 'won' },
      { id: 'perdido', name: 'Perdido', color: 'bg-red-500', order: 5, probability: 0, isClosedStage: true, stageType: 'lost' }
    ]
  },
  {
    id: 'produtora',
    name: 'Produtora',
    description: 'Pipeline para serviços de produção',
    isDefault: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    stages: [
      { id: 'em-contato', name: 'Em Contato', color: 'bg-blue-500', order: 1, probability: 25, isClosedStage: false, stageType: 'open' },
      { id: 'reuniao', name: 'Reunião', color: 'bg-yellow-500', order: 2, probability: 50, isClosedStage: false, stageType: 'open' },
      { id: 'proposta-enviada', name: 'Proposta Enviada', color: 'bg-purple-500', order: 3, probability: 75, isClosedStage: false, stageType: 'open' },
      { id: 'venda', name: 'Venda', color: 'bg-green-500', order: 4, probability: 100, isClosedStage: true, stageType: 'won' },
      { id: 'perdido', name: 'Perdido', color: 'bg-red-500', order: 5, probability: 0, isClosedStage: true, stageType: 'lost' }
    ]
  },
  {
    id: 'consultoria',
    name: 'Consultoria',
    description: 'Pipeline para serviços de consultoria',
    isDefault: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    stages: [
      { id: 'em-contato', name: 'Em Contato', color: 'bg-blue-500', order: 1, probability: 25, isClosedStage: false, stageType: 'open' },
      { id: 'reuniao', name: 'Reunião', color: 'bg-yellow-500', order: 2, probability: 50, isClosedStage: false, stageType: 'open' },
      { id: 'proposta-enviada', name: 'Proposta Enviada', color: 'bg-purple-500', order: 3, probability: 75, isClosedStage: false, stageType: 'open' },
      { id: 'venda', name: 'Venda', color: 'bg-green-500', order: 4, probability: 100, isClosedStage: true, stageType: 'won' },
      { id: 'perdido', name: 'Perdido', color: 'bg-red-500', order: 5, probability: 0, isClosedStage: true, stageType: 'lost' }
    ]
  }
];

export const defaultPipeline = pipelines[0];

export const availableTags = [
  'hot-lead', 'qualified', 'enterprise', 'startup', 'tecnologia', 'ecommerce', 
  'consultoria', 'assessoria', 'produtora', 'priority', 'warm-lead', 'cold-lead'
];

export const availableSegments = [
  'Tecnologia', 'E-commerce', 'Consultoria', 'Educação', 'Saúde', 
  'Financeiro', 'Varejo', 'Indústria', 'Serviços', 'Outro'
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'João Silva',
    company: 'TechStart Ltda',
    email: 'joao@techstart.com',
    phone: '(11) 99999-9999',
    position: 'CEO',
    source: 'website',
    value: 85000,
    oneTimeValue: 85000,
    recurringValue: 0,
    probability: 25,
    stage: 'em-contato',
    pipelineId: 'assessoria',
    assignedTo: 'Maria Santos',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    customFields: {
      empresa_tipo: 'Startup',
      funcionarios: '10-50',
      urgencia: 'Alta'
    },
    score: 75,
    tags: ['hot-lead', 'tecnologia'],
    lastContactAt: new Date('2024-01-15'),
    nextFollowUp: new Date('2024-01-18'),
    status: 'active',
    description: 'Empresa de tecnologia em crescimento, buscando assessoria para expansão. CEO muito engajado e com orçamento definido.',
    segment: 'Tecnologia',
    relatedContacts: [
      {
        id: 'contact-1',
        name: 'João Silva',
        email: 'joao@techstart.com',
        phone: '(11) 99999-9999',
        position: 'CEO',
        isPrimary: true
      },
      {
        id: 'contact-2',
        name: 'Maria Oliveira',
        email: 'maria@techstart.com',
        phone: '(11) 88888-8888',
        position: 'CTO',
        isPrimary: false
      }
    ],
    activities: [
      {
        id: 'activity-1',
        type: 'call',
        title: 'Primeira ligação',
        description: 'Conversei com João sobre as necessidades da empresa. Demonstrou muito interesse.',
        createdAt: new Date('2024-01-15T10:30:00'),
        createdBy: 'Maria Santos',
        completed: true,
        outcome: 'positive'
      }
    ],
    products: [
      {
        id: 'product-1',
        name: 'Assessoria Estratégica',
        value: 65000,
        quantity: 1,
        isRecurring: false
      },
      {
        id: 'product-2',
        name: 'Suporte Técnico',
        value: 20000,
        quantity: 1,
        isRecurring: false
      }
    ]
  },
  {
    id: 'lead-2',
    name: 'Ana Costa',
    company: 'Inovação Digital',
    email: 'ana@inovacao.com',
    phone: '(11) 88888-8888',
    position: 'Diretora Comercial',
    source: 'indicacao',
    value: 120000,
    oneTimeValue: 80000,
    recurringValue: 40000,
    probability: 75,
    stage: 'proposta-enviada',
    pipelineId: 'produtora',
    assignedTo: 'Carlos Lima',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    customFields: {
      empresa_tipo: 'Média Empresa',
      funcionarios: '100-500',
      urgencia: 'Média'
    },
    score: 90,
    tags: ['qualified', 'enterprise'],
    lastContactAt: new Date('2024-01-20'),
    nextFollowUp: new Date('2024-01-22'),
    status: 'active',
    description: 'Empresa consolidada no mercado, buscando parceria estratégica para crescimento digital.',
    segment: 'E-commerce',
    relatedContacts: [
      {
        id: 'contact-3',
        name: 'Ana Costa',
        email: 'ana@inovacao.com',
        phone: '(11) 88888-8888',
        position: 'Diretora Comercial',
        isPrimary: true
      }
    ],
    activities: [
      {
        id: 'activity-2',
        type: 'email',
        title: 'Proposta enviada',
        description: 'Enviei proposta detalhada conforme discutido na reunião.',
        createdAt: new Date('2024-01-20T14:15:00'),
        createdBy: 'Carlos Lima',
        completed: true,
        outcome: 'positive'
      }
    ],
    products: [
      {
        id: 'product-3',
        name: 'Consultoria Estratégica',
        value: 80000,
        quantity: 1,
        isRecurring: false
      },
      {
        id: 'product-4',
        name: 'Suporte Mensal',
        value: 10000,
        quantity: 4,
        isRecurring: true
      }
    ]
  },
  {
    id: 'lead-3',
    name: 'Pedro Mendes',
    company: 'Construtora Alpha',
    email: 'pedro@alpha.com',
    phone: '(11) 77777-7777',
    position: 'Gerente de TI',
    source: 'linkedin',
    value: 65000,
    oneTimeValue: 65000,
    recurringValue: 0,
    probability: 50,
    stage: 'reuniao',
    pipelineId: 'consultoria',
    assignedTo: 'Maria Santos',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    customFields: {
      empresa_tipo: 'Construção',
      funcionarios: '50-100',
      urgencia: 'Baixa'
    },
    score: 60,
    tags: ['warm-lead'],
    lastContactAt: new Date('2024-01-18'),
    nextFollowUp: new Date('2024-01-25'),
    status: 'active',
    description: 'Construtora tradicional interessada em modernizar processos de TI.',
    segment: 'Indústria',
    relatedContacts: [
      {
        id: 'contact-4',
        name: 'Pedro Mendes',
        email: 'pedro@alpha.com',
        phone: '(11) 77777-7777',
        position: 'Gerente de TI',
        isPrimary: true
      }
    ],
    activities: [],
    products: []
  },
  {
    id: 'lead-4',
    name: 'Lucia Rodrigues',
    company: 'E-commerce Plus',
    email: 'lucia@ecommerceplus.com',
    phone: '(11) 66666-6666',
    position: 'CMO',
    source: 'evento',
    value: 95000,
    oneTimeValue: 95000,
    recurringValue: 0,
    probability: 100,
    stage: 'venda',
    pipelineId: 'assessoria',
    assignedTo: 'Carlos Lima',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21'),
    customFields: {
      empresa_tipo: 'E-commerce',
      funcionarios: '20-50',
      urgencia: 'Alta'
    },
    score: 95,
    tags: ['hot-lead', 'ecommerce', 'priority'],
    lastContactAt: new Date('2024-01-21'),
    status: 'won',
    wonDate: new Date('2024-01-21'),
    description: 'Cliente fechado! E-commerce em crescimento que precisava de assessoria estratégica.',
    segment: 'E-commerce',
    relatedContacts: [
      {
        id: 'contact-5',
        name: 'Lucia Rodrigues',
        email: 'lucia@ecommerceplus.com',
        phone: '(11) 66666-6666',
        position: 'CMO',
        isPrimary: true
      }
    ],
    activities: [
      {
        id: 'activity-3',
        type: 'meeting',
        title: 'Fechamento da venda',
        description: 'Reunião de fechamento bem-sucedida. Cliente assinou contrato.',
        createdAt: new Date('2024-01-21T16:00:00'),
        createdBy: 'Carlos Lima',
        completed: true,
        outcome: 'positive'
      }
    ],
    products: [
      {
        id: 'product-5',
        name: 'Pacote Completo',
        value: 95000,
        quantity: 1,
        isRecurring: false
      }
    ]
  },
  {
    id: 'lead-5',
    name: 'Ricardo Santos',
    company: 'Logística Express',
    email: 'ricardo@logistica.com',
    phone: '(11) 55555-5555',
    position: 'Diretor Operacional',
    source: 'cold-call',
    value: 45000,
    oneTimeValue: 30000,
    recurringValue: 15000,
    probability: 25,
    stage: 'em-contato',
    pipelineId: 'produtora',
    assignedTo: 'Ana Silva',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    customFields: {
      empresa_tipo: 'Logística',
      funcionarios: '200+',
      urgencia: 'Baixa'
    },
    score: 35,
    tags: ['cold-lead'],
    status: 'active',
    description: 'Empresa de logística com interesse inicial em nossos serviços.',
    segment: 'Serviços',
    relatedContacts: [
      {
        id: 'contact-6',
        name: 'Ricardo Santos',
        email: 'ricardo@logistica.com',
        phone: '(11) 55555-5555',
        position: 'Diretor Operacional',
        isPrimary: true
      }
    ],
    activities: [],
    products: []
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    leadId: 'lead-1',
    type: 'call',
    title: 'Primeira ligação',
    description: 'Conversei com João sobre as necessidades da empresa. Ele demonstrou interesse e agendamos uma reunião.',
    createdAt: new Date('2024-01-15T10:30:00'),
    createdBy: 'Maria Santos',
    outcome: 'positive'
  },
  {
    id: 'activity-2',
    leadId: 'lead-2',
    type: 'email',
    title: 'Proposta enviada',
    description: 'Enviei a proposta comercial detalhada conforme discutido na reunião.',
    createdAt: new Date('2024-01-20T14:15:00'),
    createdBy: 'Carlos Lima',
    outcome: 'positive'
  }
];

export const customFields: CustomField[] = [
  { id: 'empresa_tipo', name: 'Tipo de Empresa', type: 'select', required: true, options: ['Startup', 'Pequena Empresa', 'Média Empresa', 'Grande Empresa', 'Multinacional'], order: 1 },
  { id: 'funcionarios', name: 'Número de Funcionários', type: 'select', required: false, options: ['1-10', '10-50', '50-100', '100-500', '500+'], order: 2 },
  { id: 'urgencia', name: 'Urgência', type: 'select', required: false, options: ['Baixa', 'Média', 'Alta', 'Crítica'], order: 3 }
];

export const calculateMetrics = (leads: Lead[], selectedPipeline: string): CRMMetrics => {
  const filteredLeads = selectedPipeline === 'padrao' 
    ? leads 
    : leads.filter(lead => lead.pipelineId === selectedPipeline);
    
  const activeLeads = filteredLeads.filter(lead => lead.status === 'active');
  const wonLeads = filteredLeads.filter(lead => lead.status === 'won');
  const wonThisMonth = wonLeads.filter(lead => 
    lead.wonDate && new Date(lead.wonDate).getMonth() === new Date().getMonth()
  ).length;
  
  // Calcular ciclo de venda médio
  const averageSalesCycle = wonLeads.length > 0 
    ? Math.round(wonLeads.reduce((sum, lead) => {
        if (lead.wonDate) {
          const days = Math.floor((lead.wonDate.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }
        return sum;
      }, 0) / wonLeads.length)
    : 0;
  
  // Contar propostas ativas (leads no estágio "proposta-enviada")
  const activeProposals = activeLeads.filter(lead => lead.stage === 'proposta-enviada').length;
  
  return {
    totalLeads: filteredLeads.length,
    totalValue: activeLeads.reduce((sum, lead) => sum + lead.value, 0),
    conversionRate: filteredLeads.length > 0 ? Math.round((wonLeads.length / filteredLeads.length) * 100) : 0,
    averageTicket: wonLeads.length > 0 ? Math.round(wonLeads.reduce((sum, lead) => sum + lead.value, 0) / wonLeads.length) : 0,
    wonThisMonth,
    pipelineVelocity: 14,
    averageSalesCycle,
    activeProposals
  };
};
