
import { useState } from 'react';
import { MeetingHistory, MeetingFormData } from '@/types/client-history';

// Mock data for initial meetings
const mockMeetingHistory: MeetingHistory[] = [
  {
    id: 'meeting-1',
    date: '2024-01-15',
    type: 'alinhamento',
    summary: 'Alinhamento sobre objetivos do projeto Q1',
    participants: ['João Silva', 'Maria Santos', 'Carlos Oliveira'],
    duration: 60,
    link: 'https://meet.google.com/abc-def-ghi',
    notes: 'Discussão sobre metas e prazos para o primeiro trimestre.',
    nextActions: ['Elaborar cronograma detalhado', 'Definir recursos necessários'],
    clientId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'meeting-2',
    date: '2024-01-22',
    type: 'aprovacao',
    summary: 'Aprovação da proposta de design',
    participants: ['Ana Costa', 'Pedro Lima'],
    duration: 45,
    link: 'https://zoom.us/j/123456789',
    notes: 'Cliente aprovou 90% das propostas apresentadas.',
    nextActions: ['Ajustar detalhes mencionados', 'Iniciar desenvolvimento'],
    clientId: '1',
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-01-22T14:00:00Z',
  },
];

export const useMeetingHistory = (clientId: string) => {
  const [meetings, setMeetings] = useState<MeetingHistory[]>(
    mockMeetingHistory.filter(meeting => meeting.clientId === clientId)
  );

  const addMeeting = (meetingData: MeetingFormData): MeetingHistory => {
    const newMeeting: MeetingHistory = {
      ...meetingData,
      id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setMeetings(prev => [newMeeting, ...prev]);
    return newMeeting;
  };

  const updateMeeting = (id: string, updates: Partial<MeetingFormData>): void => {
    setMeetings(prev =>
      prev.map(meeting =>
        meeting.id === id
          ? { ...meeting, ...updates, updatedAt: new Date().toISOString() }
          : meeting
      )
    );
  };

  const deleteMeeting = (id: string): void => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));
  };

  return {
    meetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
  };
};
