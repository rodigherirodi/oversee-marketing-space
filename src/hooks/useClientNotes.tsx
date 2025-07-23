
import { useState } from 'react';
import { ClientNote } from '@/types/client-history';

// Mock data for client notes
const mockNotes: ClientNote[] = [
  {
    id: '1',
    content: 'Cliente mencionou interesse em expandir para mercado internacional no próximo trimestre.',
    date: '2024-01-20',
    author: 'Maria Santos',
    clientId: '1',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    content: 'Importante: cliente prefere comunicação por email durante as manhãs.',
    date: '2024-01-25',
    author: 'Carlos Lima',
    clientId: '1',
    createdAt: '2024-01-25T09:15:00Z'
  },
  {
    id: '3',
    content: 'Feedback positivo sobre a última entrega. Cliente satisfeito com os prazos.',
    date: '2024-02-01',
    author: 'Ana Silva',
    clientId: '1',
    createdAt: '2024-02-01T16:45:00Z'
  }
];

export const useClientNotes = () => {
  const [notes, setNotes] = useState<ClientNote[]>(mockNotes);

  const getNotesByClient = (clientId: string): ClientNote[] => {
    return notes.filter(note => note.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const addNote = (clientId: string, content: string): ClientNote => {
    const newNote: ClientNote = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString().split('T')[0],
      author: 'Usuário Atual', // In real app, this would come from auth context
      clientId,
      createdAt: new Date().toISOString()
    };
    
    setNotes(prev => [...prev, newNote]);
    return newNote;
  };

  return {
    getNotesByClient,
    addNote
  };
};
