
export interface PageLink {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'draft' | 'archived';
  dateRange: string; // "YYYY-MM-DD to YYYY-MM-DD"
  link: string; // URL or document link
}

export interface NPSRecord {
  id: string;
  date: string;
  score: number;
  feedback: string;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'renewal' | 'review' | 'milestone' | 'other';
}

export interface SLAItem {
  id: string;
  title: string;
  description: string;
  metrics: string;
  status: 'active' | 'reviewing' | 'completed';
}
