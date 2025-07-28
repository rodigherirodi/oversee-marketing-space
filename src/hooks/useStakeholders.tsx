
import { useState } from 'react';
import { Stakeholder } from '@/types/client-data';
import { useToast } from '@/hooks/use-toast';

// Mock initial data
const mockStakeholders: Stakeholder[] = [
  {
    id: '1',
    name: 'Maria Silva',
    position: 'CEO',
    department: 'Diretoria',
    email: 'maria@empresa.com',
    phone: '(11) 98765-4321',
    importance: 'high',
    clientId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'José Oliveira',
    position: 'Gerente de Marketing',
    department: 'Marketing',
    email: 'jose@empresa.com',
    phone: '(11) 99876-5432',
    importance: 'medium',
    clientId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Roberto Santos',
    position: 'Analista de Mídia',
    department: 'Marketing',
    email: 'roberto@empresa.com',
    phone: '(11) 97654-3210',
    importance: 'low',
    clientId: '1',
    createdAt: new Date().toISOString(),
  },
];

export const useStakeholders = (clientId: string) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(mockStakeholders);
  const { toast } = useToast();

  const clientStakeholders = stakeholders.filter(s => s.clientId === clientId);

  const addStakeholder = (newStakeholder: Omit<Stakeholder, 'id' | 'createdAt'>) => {
    const stakeholder: Stakeholder = {
      ...newStakeholder,
      id: `stakeholder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    setStakeholders(prev => [...prev, stakeholder]);
    
    toast({
      title: "Stakeholder adicionado",
      description: "O stakeholder foi adicionado com sucesso.",
    });
    
    return stakeholder;
  };

  const updateStakeholder = (id: string, updates: Partial<Stakeholder>) => {
    setStakeholders(prev => 
      prev.map(stakeholder => 
        stakeholder.id === id ? { ...stakeholder, ...updates } : stakeholder
      )
    );
    
    toast({
      title: "Stakeholder atualizado",
      description: "Os dados do stakeholder foram atualizados com sucesso.",
    });
  };

  const deleteStakeholder = (id: string) => {
    setStakeholders(prev => prev.filter(s => s.id !== id));
    
    toast({
      title: "Stakeholder removido",
      description: "O stakeholder foi removido com sucesso.",
    });
  };

  return {
    stakeholders: clientStakeholders,
    addStakeholder,
    updateStakeholder,
    deleteStakeholder,
  };
};
