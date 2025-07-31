
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Project, Client } from '@/types/entities';

const mockClients: Client[] = [
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
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      // Mock data until database is properly set up
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Campanha Black Friday',
          description: 'Campanha completa para Black Friday com landing page e materiais',
          clientId: '1',
          client: mockClients[0],
          status: 'in-progress',
          priority: 'high',
          startDate: '2024-10-01',
          endDate: '2024-11-30',
          budget: 50000,
          cover: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
          tags: ['marketing', 'e-commerce', 'campanha'],
          teamMembers: ['Ana Silva', 'Carlos Mendes', 'Marina Costa'],
          progress: 65,
          createdAt: '2024-10-01'
        },
        {
          id: '2',
          name: 'Rebranding Completo',
          description: 'Renovação completa da identidade visual e materiais',
          clientId: '2',
          client: mockClients[1],
          status: 'review',
          priority: 'medium',
          startDate: '2024-09-15',
          endDate: '2024-12-15',
          budget: 30000,
          cover: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop',
          tags: ['branding', 'design', 'identidade'],
          teamMembers: ['João Santos', 'Maria Oliveira'],
          progress: 40,
          createdAt: '2024-09-15'
        }
      ];

      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project | undefined> => {
    try {
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        ...projectData,
        createdAt: new Date().toISOString()
      };
      
      setProjects(prev => [...prev, newProject]);
      toast.success('Projeto criado com sucesso');
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Erro ao criar projeto');
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    addProject,
    refetch: fetchProjects
  };
};
