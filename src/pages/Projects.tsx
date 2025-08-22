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

  const { mutate: createProject, isLoading: isCreating } = useMutation({
    mutationFn: async (newProject: ProjectFormData) => {
      const { data, error } = await supabase
        .from('projetos')
        .insert([newProject])
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

  const { mutate: updateProject, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProjectFormData }) => {
      const { data, error } = await supabase
        .from('projetos')
        .update(updates)
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

  const { mutate: deleteProject, isLoading: isDeleting } = useMutation({
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
    createProject(data);
  };

  const handleUpdate = async (id: string, data: ProjectFormData) => {
    updateProject({ id, updates: data });
  };

  const handleDelete = async (id: string) => {
    deleteProject(id);
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
        itemName="projeto"
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Projects;
