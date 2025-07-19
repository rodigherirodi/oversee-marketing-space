
export interface CoursoTrilha {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  completed: boolean;
  mandatory: boolean;
  videoUrl?: string;
  materials?: string[];
  topics: string[];
}

export interface MaterialComplementar {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'article';
  url: string;
  description?: string;
}

export interface TrilhaDetalhada {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: number;
  rating: number;
  progress: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  courses: CoursoTrilha[];
  materialsComplements: MaterialComplementar[];
  targetRole: string;
  estimatedHours: number;
  certificate: boolean;
  prerequisites: string[];
  image: string;
  tags: string[];
  category: 'cargo' | 'tema-transversal' | 'onboarding';
  completedCourses: number;
  totalCourses: number;
}

export interface TrilhaProgress {
  trilhaId: string;
  completedCourses: string[];
  startedAt: string;
  lastAccessed: string;
  notes: string;
  certificateEarned: boolean;
}

export interface UserTrilhaData {
  userId: string;
  trilhaProgresses: { [trilhaId: string]: TrilhaProgress };
  totalHoursStudied: number;
  certificatesEarned: number;
  completedTrilhas: number;
}
