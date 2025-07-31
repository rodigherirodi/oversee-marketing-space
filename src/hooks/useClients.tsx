
import { useState } from 'react';
import { Client } from '@/types/entities';

export const useClients = () => {
  // Mock data for now - replace with actual API calls when clients table is created
  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      segment: 'Tecnologia',
      logo: '🏢',
      cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
      status: 'active',
      size: 'large',
      address: 'São Paulo, SP',
      website: 'https://techcorp.com',
      primaryContact: {
        name: 'Ana Silva',
        phone: '(11) 99999-9999',
        email: 'ana@techcorp.com'
      },
      financialContact: {
        name: 'Carlos Mendes',
        phone: '(11) 88888-8888',
        email: 'carlos@techcorp.com'
      },
      socialMedia: {
        linkedin: 'https://linkedin.com/company/techcorp',
        instagram: 'https://instagram.com/techcorp'
      },
      contractType: 'recurring',
      temperature: 'hot',
      nps: 9,
      entryDate: '2024-01-15',
      responsibleManager: 'Marina Costa',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'E-commerce Plus',
      segment: 'E-commerce',
      logo: '🛒',
      cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      status: 'active',
      size: 'PME',
      address: 'Rio de Janeiro, RJ',
      website: 'https://ecommerceplus.com',
      primaryContact: {
        name: 'João Santos',
        phone: '(21) 99999-9999',
        email: 'joao@ecommerceplus.com'
      },
      financialContact: {
        name: 'Maria Oliveira',
        phone: '(21) 88888-8888',
        email: 'maria@ecommerceplus.com'
      },
      socialMedia: {
        facebook: 'https://facebook.com/ecommerceplus',
        instagram: 'https://instagram.com/ecommerceplus'
      },
      contractType: 'project',
      temperature: 'warm',
      nps: 8,
      entryDate: '2024-02-20',
      responsibleManager: 'Pedro Lima',
      createdAt: '2024-02-20'
    }
  ]);

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    console.log('Adding client:', clientData);
    // This would add to the state in a real implementation
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    console.log('Updating client:', id, clientData);
    // This would update the state in a real implementation
  };

  return {
    clients,
    loading: false,
    addClient,
    updateClient
  };
};
