
import { useState, useEffect } from 'react';
import { Stakeholder } from '@/components/StakeholderDialog';
import { toast } from 'sonner';

// Initial mock data for stakeholders
const initialStakeholders: Stakeholder[] = [
  {
    id: '1',
    name: 'Maria Silva',
    position: 'CEO',
    department: 'Diretoria',
    email: 'maria@empresa.com',
    phone: '(11) 98765-4321',
    importance: 'high'
  },
  {
    id: '2',
    name: 'José Oliveira',
    position: 'Gerente de Marketing',
    department: 'Marketing',
    email: 'jose@empresa.com',
    phone: '(11) 99876-5432',
    importance: 'medium'
  },
  {
    id: '3',
    name: 'Roberto Santos',
    position: 'Analista de Mídia',
    department: 'Marketing',
    email: 'roberto@empresa.com',
    phone: '(11) 97654-3210',
    importance: 'low'
  }
];

export const useStakeholders = (clientId: string) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial stakeholders data
  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll use the mock data
    setStakeholders(initialStakeholders);
    setLoading(false);
  }, [clientId]);

  // Add a new stakeholder
  const addStakeholder = (stakeholderData: Omit<Stakeholder, 'id'>) => {
    const newStakeholder: Stakeholder = {
      ...stakeholderData,
      id: crypto.randomUUID()
    };
    
    setStakeholders(prev => [...prev, newStakeholder]);
    toast.success('Stakeholder adicionado com sucesso');
  };

  // Update an existing stakeholder
  const updateStakeholder = (id: string, stakeholderData: Omit<Stakeholder, 'id'>) => {
    setStakeholders(prev => 
      prev.map(stakeholder => 
        stakeholder.id === id ? { ...stakeholderData, id } : stakeholder
      )
    );
    toast.success('Stakeholder atualizado com sucesso');
  };

  // Delete a stakeholder
  const deleteStakeholder = (id: string) => {
    setStakeholders(prev => prev.filter(stakeholder => stakeholder.id !== id));
    toast.success('Stakeholder removido com sucesso');
  };

  return {
    stakeholders,
    loading,
    addStakeholder,
    updateStakeholder,
    deleteStakeholder
  };
};
