
import { useState, useEffect } from 'react';
import { Client } from '@/types/entities';
import { toast } from 'sonner';

// Mock clients data for development purposes
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Tech Solutions',
    segment: 'Technology',
    logo: '/placeholder.svg',
    status: 'active',
    size: 'PME',
    address: 'Rua Tecnologia, 123 - São Paulo, SP',
    website: 'https://techsolutions.example.com',
    primaryContact: {
      name: 'João Silva',
      phone: '(11) 98765-4321',
      email: 'joao@techsolutions.example.com',
    },
    financialContact: {
      name: 'Maria Oliveira',
      phone: '(11) 91234-5678',
      email: 'maria@techsolutions.example.com',
    },
    socialMedia: {
      facebook: 'techsolutions',
      instagram: 'techsolutions_br',
      linkedin: 'techsolutions-company',
    },
    contractType: 'recurring',
    temperature: 'hot',
    nps: 9,
    entryDate: '2023-01-15',
    responsibleManager: 'Ana Silva',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Green Energy',
    segment: 'Renewable Energy',
    logo: '/placeholder.svg',
    status: 'active',
    size: 'large',
    address: 'Avenida Sustentável, 456 - Rio de Janeiro, RJ',
    website: 'https://greenenergy.example.com',
    primaryContact: {
      name: 'Carlos Santos',
      phone: '(21) 98765-4321',
      email: 'carlos@greenenergy.example.com',
    },
    financialContact: {
      name: 'Patricia Lima',
      phone: '(21) 91234-5678',
      email: 'patricia@greenenergy.example.com',
    },
    socialMedia: {
      instagram: 'greenenergy_br',
      linkedin: 'greenenergy-company',
    },
    contractType: 'project',
    temperature: 'warm',
    nps: 8,
    entryDate: '2023-03-10',
    responsibleManager: 'Roberto Almeida',
    createdAt: '2023-03-10',
  },
  {
    id: '3',
    name: 'StartupTech',
    segment: 'Technology',
    status: 'onboarding',
    size: 'MEI',
    address: 'Rua Inovação, 789 - Belo Horizonte, MG',
    primaryContact: {
      name: 'Luisa Ferreira',
      phone: '(31) 98765-4321',
      email: 'luisa@startuptech.example.com',
    },
    financialContact: {
      name: 'Pedro Costa',
      phone: '(31) 91234-5678',
      email: 'pedro@startuptech.example.com',
    },
    socialMedia: {},
    contractType: 'one-time',
    temperature: 'cold',
    entryDate: '2024-01-05',
    responsibleManager: 'Fernanda Souza',
    createdAt: '2024-01-05',
  }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a small delay
    const fetchClients = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use our mock data directly
        setTimeout(() => {
          setClients(mockClients);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading clients:', error);
        setClients([]);
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
    toast.success('Cliente adicionado com sucesso!');
  };
  
  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, ...clientData } : client
      )
    );
    toast.success('Cliente atualizado com sucesso!');
  };
  
  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    toast.success('Cliente removido com sucesso!');
  };
  
  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient
  };
};
