
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
  department: string;
  level: number;
  badges: string[];
  tasksCompleted: number;
  tasksOpen: number;
  tasksInProgress: number;
  overdueTasks: number;
  overdueTasksList: {
    id: string;
    title: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  activeProjects: number;
  completedProjects: number;
  hoursWorkedWeek: number;
  hoursWorkedMonth: number;
  productivityScore: number;
  avgCompletionTime: number;
  collaborativeProjects: number;
  individualProjects: number;
  skills: {
    name: string;
    level: number;
  }[];
  tasksByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  monthlyEvolution: {
    month: string;
    score: number;
  }[];
  recentAchievements: {
    badge: string;
    name: string;
    date: string;
  }[];
  pointsHistory: {
    date: string;
    points: number;
    activity: string;
  }[];
  goals: {
    id: string;
    title: string;
    target: number;
    current: number;
    deadline: string;
  }[];
}
