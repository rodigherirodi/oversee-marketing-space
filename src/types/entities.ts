
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

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  clientId: string;
  client: Client;
  projectId?: string;
  project?: Project;
  dueDate: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: string;
  hireDate: string;
  avatar?: string;
  activeProjectsCount: number;
  level: number;
  badges: string[];
  borderColor: string;
  borderPattern: 'solid' | 'stripes' | 'dots' | 'gradient';
  department: string;
  status: 'active' | 'vacation' | 'inactive';
  createdAt: string;
}

export interface DashboardMetrics {
  totalTasks: number;
  tasksByStatus: {
    todo: number;
    doing: number;
    review: number;
    done: number;
  };
  overdueTasks: number;
  averageCompletionTime: number;
  activeProjects: number;
  completedProjects: number;
  clientsOnboarding: number;
  averageNPS: number;
}
