
import { useState } from 'react';
import { Client } from '@/types/entities';
import { mockClients } from '@/data/mockData';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);

  const addClient = (newClient: Omit<Client, 'id' | 'createdAt'>) => {
    const client: Client = {
      ...newClient,
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    setClients(prevClients => [client, ...prevClients]);
    return client;
  };

  return {
    clients,
    addClient,
  };
};
