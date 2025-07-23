
import { useState } from 'react';
import { Meeting, MeetingFormData } from '@/types/client-history';

// Mock data for meetings
const mockMeetings: Meeting[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'alinhamento',
    summary: 'Reunião de alinhamento sobre novo projeto',
    participants: ['Maria Santos', 'João Silva'],
    duration: '1h30min',
    link: 'https://meet.google.com/abc-defg-hij',
    notes: 'Cliente demonstrou interesse em expandir o escopo',
    clientId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'Maria Santos'
  },
  {
    id: '2',
    date: '2024-01-22',
    type: 'apresentacao',
    summary: 'Apresentação da proposta inicial',
    participants: ['Maria Santos', 'Carlos Lima', 'Ana Silva'],
    duration: '2h',
    link: 'https://teams.microsoft.com/l/meetup-join/xyz',
    notes: 'Proposta aprovada com algumas modificações',
    clientId: '1',
    createdAt: '2024-01-22T14:00:00Z',
    createdBy: 'Maria Santos'
  },
  {
    id: '3',
    date: '2024-02-05',
    type: 'aprovacao',
    summary: 'Aprovação final do projeto',
    participants: ['Maria Santos', 'Pedro Costa'],
    duration: '45min',
    link: 'https://zoom.us/j/123456789',
    clientId: '1',
    createdAt: '2024-02-05T16:00:00Z',
    createdBy: 'Pedro Costa'
  }
];

export const useMeetingHistory = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);

  const getMeetingsByClient = (clientId: string): Meeting[] => {
    return meetings.filter(meeting => meeting.clientId === clientId);
  };

  const addMeeting = (clientId: string, data: MeetingFormData): Meeting => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...data,
      participants: data.participants || [],
      clientId,
      createdAt: new Date().toISOString(),
      createdBy: 'Usuário Atual' // In real app, this would come from auth context
    };
    
    setMeetings(prev => [...prev, newMeeting]);
    return newMeeting;
  };

  const updateMeeting = (id: string, data: Partial<MeetingFormData>): Meeting | null => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === id ? { ...meeting, ...data } : meeting
    ));
    
    return meetings.find(meeting => meeting.id === id) || null;
  };

  const deleteMeeting = (id: string): boolean => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));
    return true;
  };

  return {
    getMeetingsByClient,
    addMeeting,
    updateMeeting,
    deleteMeeting
  };
};
