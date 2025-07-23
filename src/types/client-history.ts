
export interface MeetingHistory {
  id: string;
  date: string;
  type: 'presencial' | 'virtual' | 'telefone';
  summary: string;
  participants: string[];
  duration: number; // em minutos
  link?: string;
  notes?: string;
  clientId: string;
  createdAt: string;
}

export interface MeetingFormData {
  date: string;
  type: 'presencial' | 'virtual' | 'telefone';
  summary: string;
  participants: string;
  duration: number;
  link?: string;
  notes?: string;
}
