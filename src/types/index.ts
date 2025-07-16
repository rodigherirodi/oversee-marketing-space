// Core entity types with relationships
export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  budget?: number;
  progress: number;
  cover?: string;
  color: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  cover?: string;
  color: string;
  status: 'active' | 'inactive' | 'onboarding' | 'churn';
  contractValue?: number;
  startDate: string;
  projects: string[]; // project IDs
  tags: string[];
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt: string;
  updatedAt: string;
  
  // Informações gerais expandidas
  website?: string;
  segment?: string;
  companySize?: 'MEI' | 'PME' | 'Large';
  
  // Contatos
  primaryContact?: {
    name: string;
    phone: string;
    email: string;
  };
  
  financialContact?: {
    name: string;
    phone: string;
    email: string;
  };
  
  // Redes sociais
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  
  // Senhas e acessos
  credentials?: {
    id: string;
    platform: string;
    username: string;
    password: string;
    category: string;
    tags: string[];
  }[];
  
  // Stakeholders
  stakeholders?: {
    id: string;
    name: string;
    role: string;
    relationship: 'decisor' | 'influenciador' | 'operacional';
    email?: string;
    phone?: string;
  }[];
  
  // Gestor responsável
  accountManager?: string;
  
  // Relacionamento
  nps?: {
    score: number;
    date: string;
    collectedBy: string;
    comments?: string;
  }[];
  
  // Temperatura do cliente
  temperature?: 'cold' | 'warm' | 'hot';
  
  // Tipo de contrato
  contractType?: 'recurring' | 'one-time' | 'project-based';
  
  // SLA
  sla?: {
    title: string;
    description: string;
    link?: string;
  };
  
  // Observações
  notes?: string;
  
  // Equipe envolvida
  team?: {
    account: string;
    creative?: string;
    analyst?: string;
    editor?: string;
  };
  
  // Histórico de reuniões
  meetings?: {
    id: string;
    title: string;
    date: string;
    summary: string;
    participants: string[];
  }[];
  
  // Alertas
  alerts?: {
    id: string;
    type: 'warning' | 'info' | 'error';
    message: string;
    createdAt: string;
    resolved: boolean;
  }[];
  
  // Métricas
  metrics?: {
    averageKPI?: number;
    roas?: number;
    reach?: number;
    [key: string]: any;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  clientId: string;
  projectId: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  actualHours?: number;
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assigneeId: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  skills: string[];
  hourlyRate?: number;
  createdAt: string;
}

export interface Commercial {
  id: string;
  title: string;
  clientId: string;
  value: number;
  status: 'lead' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability: number;
  expectedCloseDate: string;
  source: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter types
export interface TaskFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
  clientId?: string;
  projectId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface ProjectFilters {
  status?: string;
  priority?: string;
  clientId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

// Dashboard metrics
export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  inProgressTasks: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  avgTaskCompletionTime: number;
}