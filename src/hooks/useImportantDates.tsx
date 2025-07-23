
import { useState } from 'react';
import { ImportantDate } from '@/types/client-profile';

const mockImportantDates: ImportantDate[] = [
  {
    id: '1',
    event: 'Renovação de Contrato',
    date: '2024-12-15',
    status: 'scheduled',
    clientId: '1'
  },
  {
    id: '2',
    event: 'Revisão Trimestral',
    date: '2024-03-30',
    status: 'completed',
    clientId: '1'
  }
];

export const useImportantDates = () => {
  const [importantDates, setImportantDates] = useState<ImportantDate[]>(mockImportantDates);

  const getDatesByClient = (clientId: string): ImportantDate[] => {
    return importantDates.filter(date => date.clientId === clientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const addImportantDate = (clientId: string, data: Omit<ImportantDate, 'id' | 'clientId'>): ImportantDate => {
    const newDate: ImportantDate = {
      ...data,
      id: Date.now().toString(),
      clientId
    };
    
    setImportantDates(prev => [...prev, newDate]);
    return newDate;
  };

  const updateImportantDate = (id: string, data: Partial<ImportantDate>): void => {
    setImportantDates(prev => prev.map(date => 
      date.id === id ? { ...date, ...data } : date
    ));
  };

  const deleteImportantDate = (id: string): void => {
    setImportantDates(prev => prev.filter(date => date.id !== id));
  };

  return {
    getDatesByClient,
    addImportantDate,
    updateImportantDate,
    deleteImportantDate
  };
};
