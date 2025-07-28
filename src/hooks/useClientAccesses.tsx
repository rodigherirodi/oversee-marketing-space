
import { useState } from 'react';
import { ClientAccess } from '@/types/client-data';
import { useToast } from '@/hooks/use-toast';

// Mock initial data
const mockAccesses: ClientAccess[] = [
  {
    id: '1',
    platform: 'Google Analytics',
    username: 'cliente@empresa.com',
    password: 'senha123',
    notes: 'Acesso de administrador',
    clientId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    platform: 'WordPress',
    username: 'admin',
    password: 'wp123456',
    notes: 'Acesso ao painel',
    clientId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    platform: 'Meta Business',
    username: 'marketing@cliente.com',
    password: 'meta2023',
    notes: 'Acesso limitado',
    clientId: '1',
    createdAt: new Date().toISOString(),
  },
];

export const useClientAccesses = (clientId: string) => {
  const [accesses, setAccesses] = useState<ClientAccess[]>(mockAccesses);
  const { toast } = useToast();

  const clientAccesses = accesses.filter(a => a.clientId === clientId);

  const addAccess = (newAccess: Omit<ClientAccess, 'id' | 'createdAt'>) => {
    const access: ClientAccess = {
      ...newAccess,
      id: `access-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    setAccesses(prev => [...prev, access]);
    
    toast({
      title: "Acesso adicionado",
      description: "O acesso foi adicionado com sucesso.",
    });
    
    return access;
  };

  const updateAccess = (id: string, updates: Partial<ClientAccess>) => {
    setAccesses(prev => 
      prev.map(access => 
        access.id === id ? { ...access, ...updates } : access
      )
    );
    
    toast({
      title: "Acesso atualizado",
      description: "Os dados do acesso foram atualizados com sucesso.",
    });
  };

  const deleteAccess = (id: string) => {
    setAccesses(prev => prev.filter(a => a.id !== id));
    
    toast({
      title: "Acesso removido",
      description: "O acesso foi removido com sucesso.",
    });
  };

  return {
    accesses: clientAccesses,
    addAccess,
    updateAccess,
    deleteAccess,
  };
};
