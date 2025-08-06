
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
      
      // Set default kanban if none selected
      if (!currentKanban && configsWithStages.length > 0) {
        const defaultKanban = configsWithStages.find(k => k.id === 'geral') || configsWithStages[0];
        setCurrentKanban(defaultKanban);
      }
      
    } catch (error) {
      console.error('Error fetching kanban configs:', error);
      toast.error('Erro ao carregar configurações do kanban');
    } finally {
      setLoading(false);
    }
  };

  const addKanbanConfig = async (kanban: Omit<KanbanConfig, 'id' | 'stages'>): Promise<KanbanConfig | undefined> => {
    try {
      // Generate a unique ID for the kanban config
      const kanbanId = kanban.name.toLowerCase().replace(/\s+/g, '_');
      
      const kanbanData = {
        id: kanbanId,
        name: kanban.name,
        department: kanban.department,
        color: kanban.color
      };

      const { data, error } = await supabase
        .from('kanban_configs')
        .insert(kanbanData)
        .select()
        .single();

      if (error) throw error;

      const newKanban: KanbanConfig = {
        id: data.id,
        name: data.name,
        department: data.department,
        color: data.color,
        stages: []
      };

      setKanbanConfigs(prev => [...prev, newKanban]);
      toast.success('Kanban criado com sucesso');
      return newKanban;
    } catch (error) {
      console.error('Error creating kanban config:', error);
      toast.error('Erro ao criar kanban');
      throw error;
    }
  };

  const updateKanbanConfig = async (id: string, updates: Partial<KanbanConfig>) => {
    try {
      const { error } = await supabase
        .from('kanban_configs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setKanbanConfigs(prev => prev.map(kanban => 
        kanban.id === id ? { ...kanban, ...updates } : kanban
      ));

      if (currentKanban && currentKanban.id === id) {
        setCurrentKanban({ ...currentKanban, ...updates });
      }

      toast.success('Kanban atualizado com sucesso');
    } catch (error) {
      console.error('Error updating kanban config:', error);
      toast.error('Erro ao atualizar kanban');
      throw error;
    }
  };

  const deleteKanbanConfig = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kanban_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setKanbanConfigs(prev => prev.filter(kanban => kanban.id !== id));
      
      if (currentKanban && currentKanban.id === id) {
        const remaining = kanbanConfigs.filter(k => k.id !== id);
        setCurrentKanban(remaining.length > 0 ? remaining[0] : null);
      }

      toast.success('Kanban excluído com sucesso');
    } catch (error) {
      console.error('Error deleting kanban config:', error);
      toast.error('Erro ao excluir kanban');
      throw error;
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
