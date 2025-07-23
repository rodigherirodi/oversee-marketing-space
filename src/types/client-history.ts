
export interface MeetingHistory {
  id: string;
  date: string;
  type: 'alinhamento' | 'aprovacao' | 'planejamento' | 'apresentacao' | 'outro';
  summary: string;
  participants: string[];
  duration: number; // em minutos
  link?: string; // Link para gravação ou meeting
  notes?: string;
  attachments?: string[];
  nextActions?: string[];
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingFormData {
  date: string;
  type: 'alinhamento' | 'aprovacao' | 'planejamento' | 'apresentacao' | 'outro';
  summary: string;
  participants: string[];
  duration: number;
  link?: string;
  notes?: string;
  nextActions?: string[];
}
