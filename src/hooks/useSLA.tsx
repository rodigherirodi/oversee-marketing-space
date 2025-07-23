
import { useState } from 'react';
import { SLAItem } from '@/types/client-profile';

const mockSLAItems: SLAItem[] = [
  {
    id: '1',
    description: 'Tempo de resposta: até 2 horas úteis',
    completed: true,
    clientId: '1'
  },
  {
    id: '2', 
    description: 'Entrega de relatórios mensais até dia 5',
    completed: true,
    clientId: '1'
  },
  {
    id: '3',
    description: 'Suporte técnico 24/7',
    completed: false,
    clientId: '1'
  }
];

export const useSLA = () => {
  const [slaItems, setSLAItems] = useState<SLAItem[]>(mockSLAItems);

  const getSLAByClient = (clientId: string): SLAItem[] => {
    return slaItems.filter(item => item.clientId === clientId);
  };

  const addSLAItem = (clientId: string, data: Omit<SLAItem, 'id' | 'clientId'>): SLAItem => {
    const newItem: SLAItem = {
      ...data,
      id: Date.now().toString(),
      clientId
    };
    
    setSLAItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateSLAItem = (id: string, data: Partial<SLAItem>): void => {
    setSLAItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...data } : item
    ));
  };

  const deleteSLAItem = (id: string): void => {
    setSLAItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    getSLAByClient,
    addSLAItem,
    updateSLAItem,
    deleteSLAItem
  };
};
