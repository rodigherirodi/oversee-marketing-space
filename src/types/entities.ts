
export interface Client {
  id: string;
  name: string;
  segment: string;
  logo?: string;
  cover?: string;
  status: 'active' | 'inactive' | 'onboarding';
  size: 'MEI' | 'PME' | 'large';
  address: string;
  website?: string;
  primaryContact: {
    name: string;
    phone: string;
    email: string;
  };
  financialContact: {
    name: string;
    phone: string;
    email: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  contractType: 'recurring' | 'project' | 'one-time';
  temperature: 'cold' | 'warm' | 'hot';
  nps?: number;
  entryDate: string;
  responsibleManager: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  client: Client;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  budget?: number;
  cover?: string;
  tags: string[];
  teamMembers: string[];
  progress: number;
  createdAt: string;
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface KanbanConfig {
  id: string;
  name: string;
  department: string;
  color: string;
  stages: TaskStage[];
}

export interface TaskStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // Now dynamic based on kanban stages
  priority: 'low' | 'medium' | 'high';
  type: string; // Reference to TaskType
  assignee: string;
  watchers: string[]; // New field for multiple watchers
  squad: string;
  clientId: string;
  client: Client;
  projectId?: string;
  project?: Project;
  dueDate: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
  customFields: Record<string, any>;
}

export interface TaskComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

// Atualizado para corresponder aos dados do Supabase
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  position?: string;
  department: string;
  avatar?: string;
  phone?: string;
  birth_date?: string;
  hire_date?: string;
  address?: string;
  status?: string;
  level: number;
  points: number;
  task_completion_rate: number;
  active_projects_count: number;
  completed_projects_count: number;
  hours_worked_week: number;
  border_pattern?: string;
  border_color?: string;
  created_at: string;
  updated_at?: string;
  
  // Campos calculados/transformados para compatibilidade
  hireDate?: string;
  birthDate?: string;
  activeProjectsCount?: number;
  completedProjectsCount?: number;
  taskCompletionRate?: number;
  hoursWorkedWeek?: number;
  borderPattern?: 'solid' | 'stripes' | 'dots' | 'gradient';
  borderColor?: string;
  badges?: string[];
  skills?: string[];
  goals?: string[];
  createdAt?: string;
  supervisor?: string;
  salary?: number;
}

export interface DashboardMetrics {
  totalTasks: number;
  tasksByStatus: Record<string, number>;
  overdueTasks: number;
  averageCompletionTime: number;
  activeProjects: number;
  completedProjects: number;
  clientsOnboarding: number;
  averageNPS: number;
}
