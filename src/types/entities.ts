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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: string;
  hireDate: string;
  avatar?: string;
  activeProjectsCount: number;
  completedProjectsCount: number;
  level: number;
  badges: string[];
  borderColor: string;
  borderPattern: 'solid' | 'stripes' | 'dots' | 'gradient';
  department: string;
  status: 'active' | 'vacation' | 'inactive';
  createdAt: string;
  
  // Novas informações pessoais
  phone?: string;
  birthDate?: string;
  address?: string;
  
  // Novas informações profissionais
  supervisor?: string;
  salary?: number;
  skills: string[];
  
  // Novas informações de produtividade
  taskCompletionRate: number;
  hoursWorkedWeek: number;
  goals: string[];
  points: number;
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
