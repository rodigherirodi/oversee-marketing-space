
import { useState } from 'react';
import { MeetingHistory, MeetingFormData } from '@/types/client-history';

// Mock data inicial
const mockMeetings: MeetingHistory[] = [
  {
    id: 'meeting-1',
    date: '2024-01-15',
    type: 'virtual',
    summary: 'Reunião de alinhamento de projeto',
    participants: ['João Silva', 'Maria Santos'],
    duration: 60,
    link: 'https://meet.google.com/abc-def-ghi',
    notes: 'Discutimos os próximos passos do projeto',
    clientId: 'client-1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'meeting-2',
    date: '2024-01-10',
    type: 'presencial',
    summary: 'Apresentação da proposta',
    participants: ['Ana Costa', 'Pedro Lima'],
    duration: 90,
    notes: 'Apresentação bem recebida pelo cliente',
    clientId: 'client-1',
    createdAt: '2024-01-10T14:00:00Z'
  }
];

export const useMeetingHistory = () => {
  const [meetings, setMeetings] = useState<MeetingHistory[]>(mockMeetings);

  const getMeetingsByClient = (clientId: string) => {
    return meetings.filter(meeting => meeting.clientId === clientId);
  };

  const addMeeting = (clientId: string, meetingData: MeetingFormData) => {
    const newMeeting: MeetingHistory = {
      id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...meetingData,
      participants: meetingData.participants.split(',').map(p => p.trim()),
      clientId,
      createdAt: new Date().toISOString()
    };
    setMeetings(prev => [newMeeting, ...prev]);
    return newMeeting;
  };

  const updateMeeting = (id: string, updates: Partial<MeetingFormData>) => {
    setMeetings(prev =>
      prev.map(meeting =>
        meeting.id === id
          ? {
              ...meeting,
              ...updates,
              participants: updates.participants 
                ? updates.participants.split(',').map(p => p.trim())
                : meeting.participants
            }
          : meeting
      )
    );
  };

  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));
  };

  return {
    meetings,
    getMeetingsByClient,
    addMeeting,
    updateMeeting,
    deleteMeeting
  };
};
