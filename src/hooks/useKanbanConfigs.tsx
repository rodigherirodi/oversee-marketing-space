
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  stages?: KanbanStage[];
}

export const useKanbanConfigs = () => {
  const [kanbanConfigs, setKanbanConfigs] = useState<KanbanConfig[]>([]);
  const [currentKanban, setCurrentKanban] = useState<KanbanConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKanbanConfigs = async () => {
      try {
        const { data, error } = await supabase
          .from('kanban_configs')
          .select(`
            *,
            stages:task_stages(*)
          `)
          .order('name');

        if (error) throw error;

        const configs = data?.map(config => ({
          ...config,
          stages: config.stages?.sort((a: any, b: any) => a.order_position - b.order_position) || []
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

    fetchKanbanConfigs();
  }, [currentKanban]);

  return { 
    kanbanConfigs, 
    currentKanban, 
    setCurrentKanban, 
    loading 
  };
};
