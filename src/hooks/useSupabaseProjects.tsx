
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseProject {
  id: string;
  titulo: string;
  cliente: string | null;
  cliente_id: string | null;
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
  cliente_nome?: string;
}

export interface ProfileOption {
  id: string;
  name: string;
}

export interface ClientOption {
  id: string;
  nome: string;
}

export const useSupabaseProjects = () => {
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
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
        .order('data_entrega', { ascending: true });

      if (error) throw error;
      
      const transformedData: SupabaseProject[] = (data || []).map(project => ({
        id: project.id,
        titulo: project.titulo,
        cliente: project.cliente,
        cliente_id: project.cliente_id,
        status: (project.status as SupabaseProject['status']) || 'planejamento',
        prioridade: (project.prioridade as SupabaseProject['prioridade']) || null,
        data_inicio: project.data_inicio,
        data_entrega: project.data_entrega,
        progresso: project.progresso ?? 0,
        equipe: project.equipe,
        tags: project.tags,
        responsavel: project.responsavel,
        briefing: project.briefing,
        escopo: project.escopo,
        observacoes: project.observacoes,
        materiais: project.materiais,
        criado_em: project.criado_em,
        atualizado_em: project.atualizado_em,
        cliente_nome: project.clientes?.nome || project.cliente
      }));
      
      setProjects(transformedData);
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

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome')
        .eq('status', 'ativo')
        .order('nome');

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const createProject = async (projectData: Partial<SupabaseProject>): Promise<SupabaseProject | undefined> => {
    try {
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
          cliente_id: projectData.cliente_id,
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
        .single();

      if (error) throw error;

      const transformedProject: SupabaseProject = {
        id: data.id,
        titulo: data.titulo,
        cliente: data.cliente,
        cliente_id: data.cliente_id,
        status: (data.status as SupabaseProject['status']) || 'planejamento',
        prioridade: (data.prioridade as SupabaseProject['prioridade']) || null,
        data_inicio: data.data_inicio,
        data_entrega: data.data_entrega,
        progresso: data.progresso ?? 0,
        equipe: data.equipe,
        tags: data.tags,
        responsavel: data.responsavel,
        briefing: data.briefing,
        escopo: data.escopo,
        observacoes: data.observacoes,
        materiais: data.materiais,
        criado_em: data.criado_em,
        atualizado_em: data.atualizado_em,
        cliente_nome: data.clientes?.nome || data.cliente
      };

      setProjects(prev => [transformedProject, ...prev]);
      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      });
      
      return transformedProject;
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

      // Remove cliente_nome from updates as it's not a real column
      const { cliente_nome, ...cleanUpdates } = updates;

      const { data, error } = await supabase
        .from('projetos')
        .update({
          ...cleanUpdates,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', projectId)
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
        .single();

      if (error) throw error;

      const transformedProject: SupabaseProject = {
        id: data.id,
        titulo: data.titulo,
        cliente: data.cliente,
        cliente_id: data.cliente_id,
        status: (data.status as SupabaseProject['status']) || 'planejamento',
        prioridade: (data.prioridade as SupabaseProject['prioridade']) || null,
        data_inicio: data.data_inicio,
        data_entrega: data.data_entrega,
        progresso: data.progresso ?? 0,
        equipe: data.equipe,
        tags: data.tags,
        responsavel: data.responsavel,
        briefing: data.briefing,
        escopo: data.escopo,
        observacoes: data.observacoes,
        materiais: data.materiais,
        criado_em: data.criado_em,
        atualizado_em: data.atualizado_em,
        cliente_nome: data.clientes?.nome || data.cliente
      };

      setProjects(prev => prev.map(project => 
        project.id === projectId ? transformedProject : project
      ));
      
      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });
      
      return transformedProject;
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

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso!",
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      toast({
        title: "Erro",
        description: "Erro ao excluir projeto",
        variant: "destructive",
      });
      return false;
    }
  };

  const getProjectById = (id: string): SupabaseProject | undefined => {
    return projects.find(project => project.id === id);
  };

  const getProjectsByClientId = (clientId: string): SupabaseProject[] => {
    return projects.filter(project => project.cliente_id === clientId);
  };

  useEffect(() => {
    fetchProjects();
    fetchProfiles();
    fetchClients();
  }, []);

  return {
    projects,
    profiles,
    clients,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByClientId
  };
};
