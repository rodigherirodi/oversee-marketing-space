
import { useState } from 'react';
import { MeetingHistory } from '@/types/client-history';

const mockMeetings: MeetingHistory[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'alinhamento',
    summary: 'Alinhamento inicial do projeto',
    participants: ['João Silva', 'Maria Santos'],
    duration: '1h 30min',
    link: 'https://meet.google.com/abc-defg-hij',
    notes: 'Definidos os principais objetivos',
    clientId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'João Silva'
  },
  {
    id: '2',
    date: '2024-01-22',
    type: 'apresentacao',
    summary: 'Apresentação da proposta',
    participants: ['João Silva', 'Maria Santos', 'Pedro Costa'],
    duration: '2h',
    clientId: '1',
    createdAt: '2024-01-22T14:00:00Z',
    createdBy: 'Maria Santos'
  }
];

export const useMeetingHistory = () => {
  const [meetings, setMeetings] = useState<MeetingHistory[]>(mockMeetings);

  const getMeetingsByClient = (clientId: string) => {
    return meetings
      .filter(meeting => meeting.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addMeeting = (newMeeting: Omit<MeetingHistory, 'id' | 'createdAt' | 'createdBy'>) => {
    const meeting: MeetingHistory = {
      ...newMeeting,
      id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      createdBy: 'Usuario Atual'
    };
    
    setMeetings(prev => [...prev, meeting]);
    return meeting;
  };

  const updateMeeting = (id: string, updates: Partial<MeetingHistory>) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === id ? { ...meeting, ...updates } : meeting
    ));
  };

  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));
  };

  return {
    getMeetingsByClient,
    addMeeting,
    updateMeeting,
    deleteMeeting
  };
};
