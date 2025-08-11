
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseProject {
  id: string;
  titulo: string;
  cliente: string | null;
  status: 'planejamento' | 'em_andamento' | 'em_revisao' | 'em_pausa' | 'concluido';
  prioridade: 'Alta' | 'Média' | 'Baixa' | null;
  data_inicio: string | null;
  data_entrega: string | null;
  progresso: number;
  equipe: string | null;
  tags: string[] | null;
  responsavel: string | null;
  briefing: string | null;
  escopo: string | null;
  observacoes: string | null;
  materiais: any | null;
  criado_em: string;
  atualizado_em: string;
}

export interface ProfileOption {
  id: string;
  name: string;
}

export const useSupabaseProjects = () => {
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .order('data_entrega', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  };

  const createProject = async (projectData: Partial<SupabaseProject>): Promise<SupabaseProject | undefined> => {
    try {
      // Validações
      if (!projectData.titulo) {
        toast({
          title: "Erro",
          description: "Título é obrigatório",
          variant: "destructive",
        });
        return;
      }

      if (projectData.progresso !== undefined && (projectData.progresso < 0 || projectData.progresso > 100)) {
        toast({
          title: "Erro",
          description: "Progresso deve estar entre 0 e 100",
          variant: "destructive",
        });
        return;
      }

      if (projectData.data_inicio && projectData.data_entrega && 
          new Date(projectData.data_inicio) > new Date(projectData.data_entrega)) {
        toast({
          title: "Erro",
          description: "Data de início não pode ser posterior à data de entrega",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('projetos')
        .insert({
          titulo: projectData.titulo,
          cliente: projectData.cliente,
          status: projectData.status || 'planejamento',
          prioridade: projectData.prioridade,
          data_inicio: projectData.data_inicio,
          data_entrega: projectData.data_entrega,
          progresso: projectData.progresso || 0,
          equipe: projectData.equipe,
          tags: projectData.tags,
          responsavel: projectData.responsavel,
          briefing: projectData.briefing,
          escopo: projectData.escopo,
          observacoes: projectData.observacoes,
          materiais: projectData.materiais
        })
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      });
      
      return data;
    } catch (err) {
      console.error('Error creating project:', err);
      toast({
        title: "Erro",
        description: "Erro ao criar projeto",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<SupabaseProject>): Promise<SupabaseProject | undefined> => {
    try {
      // Validações
      if (updates.progresso !== undefined && (updates.progresso < 0 || updates.progresso > 100)) {
        toast({
          title: "Erro",
          description: "Progresso deve estar entre 0 e 100",
          variant: "destructive",
        });
        return;
      }

      if (updates.data_inicio && updates.data_entrega && 
          new Date(updates.data_inicio) > new Date(updates.data_entrega)) {
        toast({
          title: "Erro",
          description: "Data de início não pode ser posterior à data de entrega",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('projetos')
        .update({
          ...updates,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => prev.map(project => 
        project.id === projectId ? data : project
      ));
      
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });
      
      return data;
    } catch (err) {
      console.error('Error updating project:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto",
        variant: "destructive",
      });
      throw err;
    }
  };

  const getProjectById = (id: string): SupabaseProject | undefined => {
    return projects.find(project => project.id === id);
  };

  useEffect(() => {
    fetchProjects();
    fetchProfiles();
  }, []);

  return {
    projects,
    profiles,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    getProjectById
  };
};
