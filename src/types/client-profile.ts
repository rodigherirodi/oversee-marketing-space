
export interface NPSRecord {
  id: string;
  date: string;
  score: number;
  responsible: string;
  comment: string;
  clientId: string;
}

export interface ImportantDate {
  id: string;
  event: string;
  date: string;
  status: 'pending' | 'scheduled' | 'completed';
  clientId: string;
}

export interface SLAItem {
  id: string;
  description: string;
  completed: boolean;
  clientId: string;
}

export interface PageLink {
  id: string;
  name: string;
  url: string;
  type: 'landing' | 'institutional' | 'other';
  status: 'active' | 'inactive';
  link?: string;
  startDate?: string;
  endDate?: string;
  clientId: string;
}
