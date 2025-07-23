
export interface Meeting {
  id: string;
  date: string;
  type: 'alinhamento' | 'aprovacao' | 'planejamento' | 'apresentacao' | 'outro';
  summary: string;
  participants: string[];
  duration: string;
  link?: string;
  notes?: string;
  clientId: string;
  createdAt: string;
  createdBy: string;
}

export interface ClientNote {
  id: string;
  content: string;
  date: string;
  author: string;
  clientId: string;
  createdAt: string;
}

export interface MeetingFormData {
  date: string;
  type: 'alinhamento' | 'aprovacao' | 'planejamento' | 'apresentacao' | 'outro';
  summary: string;
  participants: string[];
  duration: string;
  link?: string;
  notes?: string;
}
