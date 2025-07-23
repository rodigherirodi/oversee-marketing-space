
import { useState } from 'react';
import { NPSRecord } from '@/types/client-profile';
import { toast } from '@/components/ui/use-toast';

// Mock initial data
const initialNPSRecords: NPSRecord[] = [
  {
    id: '1',
    date: '2023-06-15',
    score: 8,
    feedback: 'Equipe muito atenciosa, entregas no prazo.'
  },
  {
    id: '2',
    date: '2023-03-10',
    score: 7,
    feedback: 'Bom atendimento, mas tivemos atrasos em alguns ajustes.'
  },
  {
    id: '3',
    date: '2022-12-05',
    score: 9,
    feedback: 'Excelente trabalho na campanha de fim de ano.'
  }
];

export const useNPSHistory = (clientId: string) => {
  const [npsRecords, setNPSRecords] = useState<NPSRecord[]>(initialNPSRecords);

  const addNPSRecord = (newRecord: Omit<NPSRecord, 'id'>) => {
    const record: NPSRecord = {
      ...newRecord,
      id: `nps-${Date.now()}`
    };
    
    setNPSRecords(prev => [...prev, record]);
    toast({
      title: "NPS registrado",
      description: `Novo registro de NPS adicionado com sucesso.`
    });
    
    return record;
  };

  const updateNPSRecord = (id: string, updatedRecord: Partial<NPSRecord>) => {
    setNPSRecords(prev => 
      prev.map(record => record.id === id ? { ...record, ...updatedRecord } : record)
    );
    
    toast({
      title: "NPS atualizado",
      description: `Registro de NPS atualizado com sucesso.`
    });
  };

  const deleteNPSRecord = (id: string) => {
    setNPSRecords(prev => prev.filter(record => record.id !== id));
    
    toast({
      title: "NPS removido",
      description: `Registro de NPS removido com sucesso.`
    });
  };

  return {
    npsRecords,
    addNPSRecord,
    updateNPSRecord,
    deleteNPSRecord
  };
};
