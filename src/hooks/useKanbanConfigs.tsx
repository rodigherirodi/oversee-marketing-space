
import { useState, useEffect } from 'react';
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
      // Mock data until database is properly set up
      const mockKanbanConfigs: KanbanConfig[] = [
        {
          id: 'geral',
          name: 'Geral',
          department: 'Geral',
          color: '#6366F1',
          stages: [
            { id: 'todo', name: 'A Fazer', color: '#64748B', order_position: 0, kanban_config_id: 'geral' },
            { id: 'doing', name: 'Em Andamento', color: '#3B82F6', order_position: 1, kanban_config_id: 'geral' },
            { id: 'review', name: 'Em Revisão', color: '#F59E0B', order_position: 2, kanban_config_id: 'geral' },
            { id: 'done', name: 'Concluído', color: '#10B981', order_position: 3, kanban_config_id: 'geral' }
          ]
        },
        {
          id: 'operacao',
          name: 'Operação',
          department: 'operacao',
          color: '#3B82F6',
          stages: [
            { id: 'backlog', name: 'Backlog', color: '#64748B', order_position: 0, kanban_config_id: 'operacao' },
            { id: 'development', name: 'Em Desenvolvimento', color: '#3B82F6', order_position: 1, kanban_config_id: 'operacao' },
            { id: 'testing', name: 'Teste', color: '#F59E0B', order_position: 2, kanban_config_id: 'operacao' },
            { id: 'deploy', name: 'Deploy', color: '#8B5CF6', order_position: 3, kanban_config_id: 'operacao' },
            { id: 'finished', name: 'Finalizado', color: '#10B981', order_position: 4, kanban_config_id: 'operacao' }
          ]
        }
      ];

      setKanbanConfigs(mockKanbanConfigs);
      
      // Set default kanban if none selected
      if (!currentKanban && mockKanbanConfigs.length > 0) {
        const defaultKanban = mockKanbanConfigs.find(k => k.id === 'geral') || mockKanbanConfigs[0];
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
      const newKanban: KanbanConfig = {
        id: Math.random().toString(36).substr(2, 9),
        ...kanban,
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
