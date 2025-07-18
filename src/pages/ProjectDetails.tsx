
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockProjects } from '@/data/mockData';
import { Project } from '@/types/entities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectHeader from '@/components/project/ProjectHeader';
import GeneralTab from '@/components/project/tabs/GeneralTab';
import TasksTab from '@/components/project/tabs/TasksTab';
import HistoryTab from '@/components/project/tabs/HistoryTab';
import ResultsTab from '@/components/project/tabs/ResultsTab';
import TestsTab from '@/components/project/tabs/TestsTab';
import DocumentsTab from '@/components/project/tabs/DocumentsTab';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(
    mockProjects.find(p => p.id === id) || null
  );

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Projeto não encontrado</h2>
          <p className="text-gray-600 mb-4">O projeto que você está procurando não existe.</p>
          <Button onClick={() => navigate('/projects')}>
            Voltar para Projetos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="tests">Testes</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <GeneralTab project={project} />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <TasksTab project={project} />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <HistoryTab project={project} />
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <ResultsTab project={project} />
        </TabsContent>
        
        <TabsContent value="tests" className="mt-6">
          <TestsTab project={project} />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <DocumentsTab project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
