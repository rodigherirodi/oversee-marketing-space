import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TaskProvider } from '@/contexts/TaskContext';
import ProjectForm from '@/components/project/ProjectForm';
import ProjectChecklist from '@/components/project/ProjectChecklist';
import { useSupabaseProjects, SupabaseProject } from '@/hooks/useSupabaseProjects';

const ProjectDetailContent = () => {
  const { id } = useParams();
  const { profiles, clients } = useSupabaseProjects();
  
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Criação de wireframe da landing page", completed: true, date: "05/10/2024", isLinked: false },
    { id: 2, task: "Aprovação do layout pelo cliente", completed: true, date: "08/10/2024", isLinked: false },
    { id: 3, task: "Produção das peças gráficas", completed: false, date: "15/10/2024", isLinked: false },
    { id: 4, task: "Desenvolvimento da landing page", completed: false, date: "20/10/2024", isLinked: false },
    { id: 5, task: "Criação dos e-mails marketing", completed: false, date: "25/10/2024", isLinked: false },
    { id: 6, task: "Configuração das campanhas de tráfego", completed: false, date: "28/10/2024", isLinked: false },
    { id: 7, task: "Lançamento da campanha", completed: false, date: "01/11/2024", isLinked: false }
  ]);

  // React Query for fetching project data with proper caching
  const {
    data: project,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['project', id],
    queryFn: async (): Promise<SupabaseProject> => {
      if (!id) throw new Error('Project ID is required');
      
      const { data, error } = await supabase
        .from('projetos')
        .select(`
          id, 
          titulo, 
          cliente, 
          cliente_id,
          status, 
          prioridade, 
          data_inicio, 
          data_entrega, 
          progresso, 
          equipe, 
          tags, 
          responsavel, 
          briefing, 
          escopo, 
          observacoes, 
          materiais, 
          criado_em, 
          atualizado_em,
          clientes(nome)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Project not found');

      return {
        ...data,
        cliente_nome: data.clientes?.nome || data.cliente
      } as SupabaseProject;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 10000,
    retry: 1
  });

  const handleUpdateSuccess = (updatedProject: SupabaseProject) => {
    // Invalidate and refetch the query to keep data in sync
    refetch();
  };

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">ID do projeto não encontrado</h1>
          <p className="text-gray-600">URL inválida ou projeto não especificado.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h1>
          <p className="text-gray-600">O projeto solicitado não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.titulo}</h1>
          <p className="text-gray-600">Detalhes e configurações do projeto</p>
        </div>

        <ProjectForm 
          project={project}
          profiles={profiles}
          clients={clients}
          onUpdateSuccess={handleUpdateSuccess}
        />

        <div className="mt-12">
          <ProjectChecklist
            checklist={checklist}
            isEditing={false}
            onUpdate={setChecklist}
            projectId={project.id}
          />
        </div>
      </div>
    </div>
  );
};

const ProjectDetail = () => {
  return (
    <TaskProvider>
      <ProjectDetailContent />
    </TaskProvider>
  );
};

export default ProjectDetail;
