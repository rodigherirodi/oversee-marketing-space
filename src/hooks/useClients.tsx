
import { useState } from 'react';

export interface Client {
  id: string;
  name: string;
}

export const useClients = () => {
  // Mock data for now - replace with actual API calls when clients table is created
  const [clients] = useState<Client[]>([
    { id: '1', name: 'Cliente A' },
    { id: '2', name: 'Cliente B' },
    { id: '3', name: 'Cliente C' }
  ]);

  return {
    clients,
    loading: false
  };
};
