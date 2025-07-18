
import { useState } from 'react';
import { Project } from '@/types/entities';
import { mockProjects } from '@/data/mockData';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const addProject = (newProject: Omit<Project, 'id' | 'createdAt'>) => {
    const project: Project = {
      ...newProject,
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    setProjects(prevProjects => [project, ...prevProjects]);
    return project;
  };

  return {
    projects,
    addProject,
  };
};
