
import { useState } from 'react';
import { Client } from '@/types/entities';
import { mockClients } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const { toast } = useToast();

  const addClient = (newClient: Omit<Client, 'id' | 'createdAt'>) => {
    const client: Client = {
      ...newClient,
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    setClients(prevClients => [client, ...prevClients]);
    return client;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === id ? { ...client, ...updates } : client
      )
    );
    
    toast({
      title: "Cliente atualizado",
      description: "Os dados do cliente foram atualizados com sucesso.",
    });
  };

  console.log('Clients loaded:', clients.length);

  return {
    clients,
    addClient,
    updateClient,
  };
};
