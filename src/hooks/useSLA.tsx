
import { useState } from 'react';
import { SLAItem } from '@/types/client-profile';
import { toast } from '@/components/ui/use-toast';

// Mock initial data
const initialSLAItems: SLAItem[] = [
  {
    id: '1',
    title: 'Gestão de Mídias Sociais',
    description: '12 posts por mês, 4 stories por semana, relatório mensal de métricas',
    metrics: '5% de crescimento mensal de engajamento',
    status: 'active'
  },
  {
    id: '2',
    title: 'SEO & Analytics',
    description: 'Otimização mensal de palavras-chave, análise de concorrentes, relatório trimestral',
    metrics: 'Aumento de 10% no tráfego orgânico por trimestre',
    status: 'active'
  },
  {
    id: '3',
    title: 'Email Marketing',
    description: '2 campanhas por mês, segmentação de base, A/B testing',
    metrics: 'Taxa de abertura mínima de 25%, CTR de 3%',
    status: 'reviewing'
  }
];

export const useSLA = (clientId: string) => {
  const [slaItems, setSLAItems] = useState<SLAItem[]>(initialSLAItems);

  const addSLAItem = (newItem: Omit<SLAItem, 'id'>) => {
    const slaItem: SLAItem = {
      ...newItem,
      id: `sla-${Date.now()}`
    };
    
    setSLAItems(prev => [...prev, slaItem]);
    toast({
      title: "Item de SLA adicionado",
      description: `${slaItem.title} foi adicionado com sucesso.`
    });
    
    return slaItem;
  };

  const updateSLAItem = (id: string, updatedItem: Partial<SLAItem>) => {
    setSLAItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updatedItem } : item)
    );
    
    toast({
      title: "Item de SLA atualizado",
      description: `O item de SLA foi atualizado com sucesso.`
    });
  };

  const deleteSLAItem = (id: string) => {
    setSLAItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Item de SLA removido",
      description: `O item de SLA foi removido com sucesso.`
    });
  };

  return {
    slaItems,
    addSLAItem,
    updateSLAItem,
    deleteSLAItem
  };
};
