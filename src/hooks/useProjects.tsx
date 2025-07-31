
import { useState } from 'react';

export interface Project {
  id: string;
  name: string;
  clientId: string;
}

export const useProjects = () => {
  // Mock data for now - replace with actual API calls when projects table is created
  const [projects] = useState<Project[]>([
    { id: '1', name: 'Projeto Alpha', clientId: '1' },
    { id: '2', name: 'Projeto Beta', clientId: '1' },
    { id: '3', name: 'Projeto Gamma', clientId: '2' },
    { id: '4', name: 'Projeto Delta', clientId: '3' }
  ]);

  return {
    projects,
    loading: false
  };
};
