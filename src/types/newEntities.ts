
export interface Briefing {
  id: string;
  title: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    logo?: string;
  };
  description: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  attachments?: string[];
  assignee: string;
}

export interface Case {
  id: string;
  title: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    logo?: string;
  };
  category: string;
  description: string;
  summary: string;
  results: {
    metric: string;
    before: string;
    after: string;
    improvement: string;
  }[];
  images: string[];
  tags: string[];
  isPublic: boolean;
  featured: boolean;
  createdAt: string;
  projectId?: string;
}

export interface Access {
  id: string;
  platform: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    logo?: string;
  };
  login: string;
  password: string;
  url?: string;
  notes?: string;
  category: 'social' | 'ads' | 'analytics' | 'email' | 'hosting' | 'other';
  isActive: boolean;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProductivity {
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    position: string;
  };
  tasksCompleted: number;
  tasksInProgress: number;
  overdueTasks: number;
  activeProjects: number;
  completedProjects: number;
  hoursWorked: number;
  productivityScore: number;
  goals: {
    id: string;
    title: string;
    target: number;
    current: number;
    deadline: string;
  }[];
}
