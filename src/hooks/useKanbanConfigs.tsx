
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TaskStage {
  id: string;
  name: string;
  color: string;
  order_position: number;
  kanban_config_id: string;
}

export interface KanbanConfig {
  id: string;
  name: string;
  department: string;
  color: string;
  stages: TaskStage[];
}

export const useKanbanConfigs = () => {
  const [kanbanConfigs, setKanbanConfigs] = useState<KanbanConfig[]>([]);
  const [currentKanban, setCurrentKanban] = useState<KanbanConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchKanbanConfigs = async () => {
    try {
      // Fetch kanban configs
      const { data: configs, error: configError } = await supabase
        .from('kanban_configs')
        .select('*')
        .order('name');

      if (configError) throw configError;

      const { data: stages, error: stagesError } = await supabase
        .from('task_stages')
        .select('*')
        .order('order_position');

      if (stagesError) throw stagesError;

      const configsWithStages: KanbanConfig[] = (configs || []).map((config) => ({
        id: config.id,
        name: config.name,
        department: config.department,
        color: config.color,
        stages: (stages || []).filter((stage) => stage.kanban_config_id === config.id)
      }));

      setKanbanConfigs(configsWithStages);
      
      // Set default current kanban to "Geral" if none selected
      if (!currentKanban && configsWithStages.length > 0) {
        const defaultKanban = configsWithStages.find(k => k.id === 'geral') || configsWithStages[0];
        setCurrentKanban(defaultKanban);
      }
    } catch (err) {
      console.error('Error fetching kanban configs:', err);
      toast.error('Erro ao carregar configurações kanban');
    } finally {
      setLoading(false);
    }
  };

  const addKanbanConfig = async (kanban: Omit<KanbanConfig, 'id' | 'stages'>): Promise<KanbanConfig | undefined> => {
    try {
      const { data, error } = await supabase
        .from('kanban_configs')
        .insert([kanban])
        .select()
        .single();

      if (error) throw error;

      const newKanban: KanbanConfig = { ...data, stages: [] };
      setKanbanConfigs(prev => [...prev, newKanban]);
      toast.success('Configuração kanban criada com sucesso');
      return newKanban;
    } catch (err) {
      console.error('Error creating kanban config:', err);
      toast.error('Erro ao criar configuração kanban');
      throw err;
    }
  };

  const updateKanbanConfig = async (id: string, updates: Partial<KanbanConfig>) => {
    try {
      const { error } = await supabase
        .from('kanban_configs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setKanbanConfigs(prev => prev.map(config => 
        config.id === id ? { ...config, ...updates } : config
      ));
      
      if (currentKanban?.id === id) {
        setCurrentKanban(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success('Configuração kanban atualizada');
    } catch (err) {
      console.error('Error updating kanban config:', err);
      toast.error('Erro ao atualizar configuração kanban');
      throw err;
    }
  };

  const deleteKanbanConfig = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kanban_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setKanbanConfigs(prev => prev.filter(config => config.id !== id));
      
      if (currentKanban?.id === id) {
        const remaining = kanbanConfigs.filter(config => config.id !== id);
        setCurrentKanban(remaining.length > 0 ? remaining[0] : null);
      }
      
      toast.success('Configuração kanban excluída');
    } catch (err) {
      console.error('Error deleting kanban config:', err);
      toast.error('Erro ao excluir configuração kanban');
      throw err;
    }
  };

  useEffect(() => {
    fetchKanbanConfigs();
  }, []);

  return {
    kanbanConfigs,
    currentKanban,
    setCurrentKanban,
    loading,
    addKanbanConfig,
    updateKanbanConfig,
    deleteKanbanConfig,
    refetch: fetchKanbanConfigs
  };
};
