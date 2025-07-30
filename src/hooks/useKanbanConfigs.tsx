
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface KanbanStage {
  id: string;
  name: string;
  color: string;
  order_position: number;
}

export interface KanbanConfig {
  id: string;
  name: string;
  department: string;
  color: string;
  stages: KanbanStage[];
}

export const useKanbanConfigs = () => {
  const [kanbanConfigs, setKanbanConfigs] = useState<KanbanConfig[]>([]);
  const [currentKanban, setCurrentKanban] = useState<KanbanConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchKanbanConfigs = async () => {
    try {
      // Using raw query until types.ts is updated
      const { data, error } = await (supabase as any)
        .from('kanban_configs')
        .select(`
          *,
          stages:task_stages(*)
        `)
        .order('name');

      if (error) throw error;

      const configs = data?.map((config: any) => ({
        ...config,
        stages: (config.stages || []).sort((a: any, b: any) => a.order_position - b.order_position)
      })) || [];

      setKanbanConfigs(configs);
      
      // Set the first kanban as default if none is selected
      if (!currentKanban && configs.length > 0) {
        setCurrentKanban(configs[0]);
      }
    } catch (err) {
      console.error('Error fetching kanban configs:', err);
    } finally {
      setLoading(false);
    }
  };

  const addKanbanConfig = async (kanbanData: Omit<KanbanConfig, 'id'>) => {
    try {
      const { data: kanbanConfig, error: kanbanError } = await (supabase as any)
        .from('kanban_configs')
        .insert([{
          name: kanbanData.name,
          department: kanbanData.department,
          color: kanbanData.color
        }])
        .select()
        .single();

      if (kanbanError) throw kanbanError;

      // Insert stages
      const stagesData = kanbanData.stages.map((stage, index) => ({
        kanban_config_id: kanbanConfig.id,
        name: stage.name,
        color: stage.color,
        order_position: index + 1
      }));

      const { data: stages, error: stagesError } = await (supabase as any)
        .from('task_stages')
        .insert(stagesData)
        .select();

      if (stagesError) throw stagesError;

      const newKanban = {
        ...kanbanConfig,
        stages: stages || []
      };

      setKanbanConfigs(prev => [...prev, newKanban]);
      toast.success('Kanban criado com sucesso');
      return newKanban;
    } catch (err) {
      console.error('Error creating kanban config:', err);
      toast.error('Erro ao criar kanban');
      throw err;
    }
  };

  const updateKanbanConfig = async (kanbanId: string, updates: Partial<KanbanConfig>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('kanban_configs')
        .update({
          name: updates.name,
          department: updates.department,
          color: updates.color
        })
        .eq('id', kanbanId)
        .select()
        .single();

      if (error) throw error;

      // Update stages if provided
      if (updates.stages) {
        // Delete existing stages
        await (supabase as any)
          .from('task_stages')
          .delete()
          .eq('kanban_config_id', kanbanId);

        // Insert new stages
        const stagesData = updates.stages.map((stage, index) => ({
          kanban_config_id: kanbanId,
          name: stage.name,
          color: stage.color,
          order_position: index + 1
        }));

        const { data: stages, error: stagesError } = await (supabase as any)
          .from('task_stages')
          .insert(stagesData)
          .select();

        if (stagesError) throw stagesError;

        const updatedKanban = {
          ...data,
          stages: stages || []
        };

        setKanbanConfigs(prev => prev.map(k => k.id === kanbanId ? updatedKanban : k));
        if (currentKanban?.id === kanbanId) {
          setCurrentKanban(updatedKanban);
        }
      }

      toast.success('Kanban atualizado com sucesso');
    } catch (err) {
      console.error('Error updating kanban config:', err);
      toast.error('Erro ao atualizar kanban');
      throw err;
    }
  };

  const deleteKanbanConfig = async (kanbanId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('kanban_configs')
        .delete()
        .eq('id', kanbanId);

      if (error) throw error;

      setKanbanConfigs(prev => prev.filter(k => k.id !== kanbanId));
      if (currentKanban?.id === kanbanId) {
        setCurrentKanban(kanbanConfigs.length > 1 ? kanbanConfigs[0] : null);
      }
      toast.success('Kanban excluído com sucesso');
    } catch (err) {
      console.error('Error deleting kanban config:', err);
      toast.error('Erro ao excluir kanban');
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
    deleteKanbanConfig
  };
};
