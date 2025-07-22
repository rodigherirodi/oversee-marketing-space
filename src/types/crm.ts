
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  source: 'website' | 'linkedin' | 'indicacao' | 'evento' | 'cold-call' | 'outro';
  value: number;
  probability: number;
  stage: string;
  pipelineId: string;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  customFields: Record<string, any>;
  score: number;
  tags: string[];
  lastContactAt?: Date;
  nextFollowUp?: Date;
  status: 'active' | 'won' | 'lost';
  lostReason?: string;
  wonDate?: Date;
  description?: string;
  segment?: string;
  relatedContacts: RelatedContact[];
  oneTimeValue: number;
  recurringValue: number;
  activities: LeadActivity[];
}

export interface RelatedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  isPrimary: boolean;
}

export interface LeadActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'follow_up';
  title: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  dueDate?: Date;
  completed: boolean;
  outcome?: 'positive' | 'negative' | 'neutral';
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  probability: number;
  isClosedStage: boolean;
  stageType: 'open' | 'won' | 'lost';
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'stage_change';
  title: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  dueDate?: Date;
  completed?: boolean;
  outcome?: 'positive' | 'negative' | 'neutral';
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'multiselect' | 'textarea' | 'boolean';
  required: boolean;
  options?: string[];
  defaultValue?: any;
  order: number;
}

export interface LeadFilters {
  search?: string;
  stage?: string;
  assignedTo?: string;
  source?: string;
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  minValue?: number;
  maxValue?: number;
}

export interface CRMMetrics {
  totalLeads: number;
  totalValue: number;
  conversionRate: number;
  averageTicket: number;
  wonThisMonth: number;
  pipelineVelocity: number;
  averageSalesCycle: number;
  activeProposals: number;
}

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  source: 'website' | 'linkedin' | 'indicacao' | 'evento' | 'cold-call' | 'outro';
  value: number;
  pipelineId: string;
  assignedTo: string;
  tags: string[];
  customFields: Record<string, any>;
}
