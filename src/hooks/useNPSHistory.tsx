
import { useState } from 'react';
import { NPSRecord } from '@/types/client-profile';

const mockNPSRecords: NPSRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    score: 9,
    responsible: 'Maria Santos',
    comment: 'Cliente muito satisfeito com o atendimento',
    clientId: '1'
  },
  {
    id: '2',
    date: '2024-02-20',
    score: 8,
    responsible: 'João Silva',
    comment: 'Bom feedback geral, algumas sugestões de melhoria',
    clientId: '1'
  }
];

export const useNPSHistory = () => {
  const [npsRecords, setNPSRecords] = useState<NPSRecord[]>(mockNPSRecords);

  const getNPSByClient = (clientId: string): NPSRecord[] => {
    return npsRecords.filter(record => record.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addNPSRecord = (clientId: string, data: Omit<NPSRecord, 'id' | 'clientId'>): NPSRecord => {
    const newRecord: NPSRecord = {
      ...data,
      id: Date.now().toString(),
      clientId
    };
    
    setNPSRecords(prev => [...prev, newRecord]);
    return newRecord;
  };

  const updateNPSRecord = (id: string, data: Partial<NPSRecord>): void => {
    setNPSRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...data } : record
    ));
  };

  const deleteNPSRecord = (id: string): void => {
    setNPSRecords(prev => prev.filter(record => record.id !== id));
  };

  return {
    getNPSByClient,
    addNPSRecord,
    updateNPSRecord,
    deleteNPSRecord
  };
};
