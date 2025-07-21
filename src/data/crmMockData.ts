
import { Lead, Pipeline, PipelineStage, Activity, CustomField, CRMMetrics } from '@/types/crm';

export const defaultPipeline: Pipeline = {
  id: 'pipeline-1',
  name: 'Pipeline Padrão',
  description: 'Pipeline principal de vendas',
  isDefault: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  stages: [
    { id: 'novo-lead', name: 'Novo Lead', color: 'bg-gray-500', order: 1, probability: 10, isClosedStage: false, stageType: 'open' },
    { id: 'em-contato', name: 'Em Contato', color: 'bg-blue-500', order: 2, probability: 25, isClosedStage: false, stageType: 'open' },
    { id: 'reuniao-1', name: 'Reunião 1 (Pré-Venda)', color: 'bg-yellow-500', order: 3, probability: 40, isClosedStage: false, stageType: 'open' },
    { id: 'reuniao-2', name: 'Reunião 2 (Fechamento)', color: 'bg-orange-500', order: 4, probability: 65, isClosedStage: false, stageType: 'open' },
    { id: 'proposta-enviada', name: 'Proposta Enviada', color: 'bg-purple-500', order: 5, probability: 80, isClosedStage: false, stageType: 'open' },
    { id: 'resgate', name: 'Resgate', color: 'bg-pink-500', order: 6, probability: 90, isClosedStage: false, stageType: 'open' },
    { id: 'venda', name: 'Venda', color: 'bg-green-500', order: 7, probability: 100, isClosedStage: true, stageType: 'won' },
    { id: 'perdido', name: 'Perdido', color: 'bg-red-500', order: 8, probability: 0, isClosedStage: true, stageType: 'lost' }
  ]
};

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
    probability: 25,
    stage: 'em-contato',
    pipelineId: 'pipeline-1',
    assignedTo: 'vendedor-1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    customFields: {
      empresa_tipo: 'Startup',
      funcionarios: '10-50',
      urgencia: 'Alta',
      orcamento_aprovado: true
    },
    score: 75,
    tags: ['hot-lead', 'tecnologia'],
    lastContactAt: new Date('2024-01-15'),
    nextFollowUp: new Date('2024-01-18'),
    status: 'active'
  },
  {
    id: 'lead-2',
    name: 'Maria Santos',
    company: 'Inovação Digital',
    email: 'maria@inovacao.com',
    phone: '(11) 88888-8888',
    position: 'Diretora Comercial',
    source: 'indicacao',
    value: 120000,
    probability: 80,
    stage: 'proposta-enviada',
    pipelineId: 'pipeline-1',
    assignedTo: 'vendedor-2',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    customFields: {
      empresa_tipo: 'Média Empresa',
      funcionarios: '100-500',
      urgencia: 'Média',
      orcamento_aprovado: true
    },
    score: 90,
    tags: ['qualified', 'enterprise'],
    lastContactAt: new Date('2024-01-20'),
    nextFollowUp: new Date('2024-01-22'),
    status: 'active'
  },
  {
    id: 'lead-3',
    name: 'Pedro Costa',
    company: 'Construtora Alpha',
    email: 'pedro@alpha.com',
    phone: '(11) 77777-7777',
    position: 'Gerente de TI',
    source: 'linkedin',
    value: 65000,
    probability: 40,
    stage: 'reuniao-1',
    pipelineId: 'pipeline-1',
    assignedTo: 'vendedor-1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
    customFields: {
      empresa_tipo: 'Construção',
      funcionarios: '50-100',
      urgencia: 'Baixa',
      orcamento_aprovado: false
    },
    score: 60,
    tags: ['warm-lead'],
    lastContactAt: new Date('2024-01-18'),
    nextFollowUp: new Date('2024-01-25'),
    status: 'active'
  },
  {
    id: 'lead-4',
    name: 'Ana Rodrigues',
    company: 'E-commerce Plus',
    email: 'ana@ecommerceplus.com',
    phone: '(11) 66666-6666',
    position: 'CMO',
    source: 'evento',
    value: 95000,
    probability: 90,
    stage: 'resgate',
    pipelineId: 'pipeline-1',
    assignedTo: 'vendedor-2',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21'),
    customFields: {
      empresa_tipo: 'E-commerce',
      funcionarios: '20-50',
      urgencia: 'Alta',
      orcamento_aprovado: true
    },
    score: 95,
    tags: ['hot-lead', 'ecommerce', 'priority'],
    lastContactAt: new Date('2024-01-21'),
    nextFollowUp: new Date('2024-01-23'),
    status: 'active'
  },
  {
    id: 'lead-5',
    name: 'Carlos Mendes',
    company: 'Logística Express',
    email: 'carlos@logistica.com',
    phone: '(11) 55555-5555',
    position: 'Diretor Operacional',
    source: 'cold-call',
    value: 45000,
    probability: 10,
    stage: 'novo-lead',
    pipelineId: 'pipeline-1',
    assignedTo: 'vendedor-3',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    customFields: {
      empresa_tipo: 'Logística',
      funcionarios: '200+',
      urgencia: 'Baixa',
      orcamento_aprovado: false
    },
    score: 35,
    tags: ['cold-lead'],
    status: 'active'
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
    createdBy: 'vendedor-1',
    outcome: 'positive'
  },
  {
    id: 'activity-2',
    leadId: 'lead-2',
    type: 'email',
    title: 'Proposta enviada',
    description: 'Enviei a proposta comercial detalhada conforme discutido na reunião.',
    createdAt: new Date('2024-01-20T14:15:00'),
    createdBy: 'vendedor-2',
    outcome: 'positive'
  }
];

export const customFields: CustomField[] = [
  { id: 'empresa_tipo', name: 'Tipo de Empresa', type: 'select', required: true, options: ['Startup', 'Pequena Empresa', 'Média Empresa', 'Grande Empresa', 'Multinacional'], order: 1 },
  { id: 'funcionarios', name: 'Número de Funcionários', type: 'select', required: false, options: ['1-10', '10-50', '50-100', '100-500', '500+'], order: 2 },
  { id: 'urgencia', name: 'Urgência', type: 'select', required: false, options: ['Baixa', 'Média', 'Alta', 'Crítica'], order: 3 },
  { id: 'orcamento_aprovado', name: 'Orçamento Aprovado', type: 'boolean', required: false, order: 4 },
  { id: 'interesse_principal', name: 'Principal Interesse', type: 'textarea', required: false, order: 5 },
  { id: 'data_decisao', name: 'Data Prevista de Decisão', type: 'date', required: false, order: 6 }
];

export const mockMetrics: CRMMetrics = {
  totalLeads: 5,
  totalValue: 410000,
  conversionRate: 68,
  averageTicket: 82000,
  leadsThisMonth: 3,
  wonThisMonth: 1,
  lostThisMonth: 0,
  pipelineVelocity: 14
};
