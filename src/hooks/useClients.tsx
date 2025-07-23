
import { useState, useEffect } from 'react';
import { Client } from '@/types/entities';
import { toast } from 'sonner';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // In a real app, this would be an API call
        const mockData = await import('@/data/newMockData');
        
        // Check how clients are exported in the mock data
        if (Array.isArray(mockData.clients)) {
          setClients(mockData.clients);
        } else {
          console.error('No clients found in mock data or incorrect format');
          setClients([]);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID()
    };
    
    setClients(prev => [...prev, newClient]);
  };
  
  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, ...clientData } : client
      )
    );
  };
  
  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };
  
  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient
  };
};
