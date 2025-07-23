
import { useState } from 'react';
import { ImportantDate } from '@/types/client-profile';
import { toast } from '@/components/ui/use-toast';

// Mock initial data
const initialImportantDates: ImportantDate[] = [
  {
    id: '1',
    title: 'Renovação de Contrato',
    date: '2023-12-31',
    description: 'Data para renovação do contrato anual de serviços.',
    type: 'renewal'
  },
  {
    id: '2',
    title: 'Revisão Semestral',
    date: '2023-07-15',
    description: 'Revisão semestral de performance e ajustes estratégicos.',
    type: 'review'
  },
  {
    id: '3',
    title: 'Entrega de Relatório Anual',
    date: '2023-12-15',
    description: 'Entrega do relatório anual de resultados para o cliente.',
    type: 'milestone'
  }
];

export const useImportantDates = (clientId: string) => {
  const [importantDates, setImportantDates] = useState<ImportantDate[]>(initialImportantDates);

  const addImportantDate = (newDate: Omit<ImportantDate, 'id'>) => {
    const importantDate: ImportantDate = {
      ...newDate,
      id: `date-${Date.now()}`
    };
    
    setImportantDates(prev => [...prev, importantDate]);
    toast({
      title: "Data importante adicionada",
      description: `${importantDate.title} foi adicionada com sucesso.`
    });
    
    return importantDate;
  };

  const updateImportantDate = (id: string, updatedDate: Partial<ImportantDate>) => {
    setImportantDates(prev => 
      prev.map(date => date.id === id ? { ...date, ...updatedDate } : date)
    );
    
    toast({
      title: "Data importante atualizada",
      description: `A data importante foi atualizada com sucesso.`
    });
  };

  const deleteImportantDate = (id: string) => {
    setImportantDates(prev => prev.filter(date => date.id !== id));
    
    toast({
      title: "Data importante removida",
      description: `A data importante foi removida com sucesso.`
    });
  };

  return {
    importantDates,
    addImportantDate,
    updateImportantDate,
    deleteImportantDate
  };
};
