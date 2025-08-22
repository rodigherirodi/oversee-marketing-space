
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProjectFormDialog } from '@/components/ProjectFormDialog';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { Plus, Search, Edit, Trash2, Users, Calendar, Target } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { ProjectDTO, ProjectFormData } from '@/types/database';

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects', search],
    queryFn: async () => {
      let query = supabase
        .from('projetos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (search) {
        query = query.ilike('titulo', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      return data as ProjectDTO[];
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: ProjectFormData) => {
      const insertData = {
        titulo: newProject.titulo,
        cliente_id: newProject.cliente_id,
        status: newProject.status,
        prioridade: newProject.prioridade,
        data_inicio: newProject.data_inicio?.toISOString().split('T')[0],
        data_entrega: newProject.data_entrega?.toISOString().split('T')[0],
        progresso: newProject.progresso,
        equipe: newProject.equipe,
        responsavel: newProject.responsavel,
        briefing: newProject.briefing,
        escopo: newProject.escopo,
        observacoes: newProject.observacoes,
      };

      const { data, error } = await supabase
        .from('projetos')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
      return data as ProjectDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto criado com sucesso!');
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar projeto: ${error.message}`);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProjectFormData }) => {
      const updateData: any = {};
      
      if (updates.titulo !== undefined) updateData.titulo = updates.titulo;
      if (updates.cliente_id !== undefined) updateData.cliente_id = updates.cliente_id;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.prioridade !== undefined) updateData.prioridade = updates.prioridade;
      if (updates.data_inicio !== undefined) {
        updateData.data_inicio = updates.data_inicio?.toISOString().split('T')[0];
      }
      if (updates.data_entrega !== undefined) {
        updateData.data_entrega = updates.data_entrega?.toISOString().split('T')[0];
      }
      if (updates.progresso !== undefined) updateData.progresso = updates.progresso;
      if (updates.equipe !== undefined) updateData.equipe = updates.equipe;
      if (updates.responsavel !== undefined) updateData.responsavel = updates.responsavel;
      if (updates.briefing !== undefined) updateData.briefing = updates.briefing;
      if (updates.escopo !== undefined) updateData.escopo = updates.escopo;
      if (updates.observacoes !== undefined) updateData.observacoes = updates.observacoes;

      const { data, error } = await supabase
        .from('projetos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }
      return data as ProjectDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto atualizado com sucesso!');
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar projeto: ${error.message}`);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto excluído com sucesso!');
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir projeto: ${error.message}`);
    },
  });

  const handleCreate = async (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };

  const handleUpdate = async (id: string, data: ProjectFormData) => {
    updateProjectMutation.mutate({ id, updates: data });
  };

  const handleDelete = async (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  const openDeleteDialog = (id: string) => {
    setProjectIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setProjectIdToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return <div>Carregando projetos...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar projetos.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Buscar projeto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <Card key={project.id} className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Link to={`/project/${project.id}`} className="hover:underline">
                  {project.titulo}
                </Link>
                <Badge variant="secondary">{project.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  Equipe: {project.equipe || 'Não especificado'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Entrega: {project.data_entrega ? format(new Date(project.data_entrega), 'dd/MM/yyyy', { locale: ptBR }) : 'Não especificado'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="w-4 h-4 mr-1" />
                  Prioridade: {project.prioridade || 'Não especificado'}
                </div>
              </div>
              <Progress value={project.progresso} className="mb-4" />
              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteDialog(project.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreate}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={() => {
          if (projectIdToDelete) {
            handleDelete(projectIdToDelete);
          }
        }}
        title="Excluir projeto"
        description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
        isDeleting={deleteProjectMutation.isPending}
      />
    </div>
  );
};

export default Projects;
