
import { useState } from 'react';
import { ClientNote } from '@/types/client-history';

const mockNotes: ClientNote[] = [
  {
    id: '1',
    content: 'Cliente muito receptivo às propostas apresentadas',
    date: '2024-01-15',
    author: 'João Silva',
    clientId: '1',
    createdAt: '2024-01-15T15:30:00Z'
  },
  {
    id: '2',
    content: 'Necessário revisar orçamento na próxima reunião',
    date: '2024-01-22',
    author: 'Maria Santos',
    clientId: '1',
    createdAt: '2024-01-22T16:45:00Z'
  }
];

export const useClientNotes = () => {
  const [notes, setNotes] = useState<ClientNote[]>(mockNotes);

  const getNotesByClient = (clientId: string) => {
    return notes
      .filter(note => note.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const addNote = (newNote: Omit<ClientNote, 'id' | 'createdAt'>) => {
    const note: ClientNote = {
      ...newNote,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    setNotes(prev => [...prev, note]);
    return note;
  };

  return {
    getNotesByClient,
    addNote
  };
};
