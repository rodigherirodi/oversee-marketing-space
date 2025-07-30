
import React, { useState } from 'react';
import { TaskType, KanbanConfig } from '@/hooks/useKanbanConfigs';
import { useTaskContext } from '@/contexts/TaskContext';
import { KanbanFormDialog } from './KanbanFormDialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Palette,
  Hash
} from 'lucide-react';

interface TaskConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskConfigDialog: React.FC<TaskConfigDialogProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { 
    taskTypes, 
    kanbanConfigs, 
    addTaskType, 
    updateKanbanConfig,
    addKanbanConfig,
    deleteKanbanConfig
  } = useTaskContext();
  
  const [activeTab, setActiveTab] = useState('types');
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeIcon, setNewTypeIcon] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#3B82F6');
  const [isKanbanFormOpen, setIsKanbanFormOpen] = useState(false);
  const [editingKanban, setEditingKanban] = useState<KanbanConfig | null>(null);

  const handleAddTaskType = async () => {
    if (newTypeName.trim()) {
      await addTaskType({
        name: newTypeName,
        color: newTypeColor,
        icon: newTypeIcon || '📝',
      });
      setNewTypeName('');
      setNewTypeIcon('');
      setNewTypeColor('#3B82F6');
    }
  };

  const handleKanbanSubmit = async (kanbanData: Omit<KanbanConfig, 'id'> | KanbanConfig) => {
    if ('id' in kanbanData) {
      // Editing existing kanban
      await updateKanbanConfig(kanbanData.id, kanbanData);
    } else {
      // Creating new kanban
      await addKanbanConfig(kanbanData);
    }
    setIsKanbanFormOpen(false);
    setEditingKanban(null);
  };

  const handleEditKanban = (kanban: KanbanConfig) => {
    setEditingKanban(kanban);
    setIsKanbanFormOpen(true);
  };

  const handleDeleteKanban = async (kanbanId: string) => {
    if (confirm('Tem certeza que deseja excluir este kanban? Esta ação não pode ser desfeita.')) {
      await deleteKanbanConfig(kanbanId);
    }
  };

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações de Tarefas
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="types" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Tipos de Tarefa
              </TabsTrigger>
              <TabsTrigger value="kanbans" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Kanbans
              </TabsTrigger>
            </TabsList>

            {/* Task Types Tab */}
            <TabsContent value="types" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Adicionar Novo Tipo</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Input
                    placeholder="Nome do tipo"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Emoji"
                    value={newTypeIcon}
                    onChange={(e) => setNewTypeIcon(e.target.value)}
                    className="w-20"
                    maxLength={2}
                  />
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border-2 border-gray-200" 
                      style={{ backgroundColor: newTypeColor }}
                    />
                    <Input
                      type="color"
                      value={newTypeColor}
                      onChange={(e) => setNewTypeColor(e.target.value)}
                      className="w-16 h-8 p-1 border rounded"
                    />
                  </div>
                  <Button onClick={handleAddTaskType} disabled={!newTypeName.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border-2 border-gray-200"
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTypeColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Tipos Existentes</h3>
                <div className="grid gap-2">
                  {taskTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Kanbans Tab */}
            <TabsContent value="kanbans" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Kanbans Configurados</h3>
                <Button 
                  onClick={() => setIsKanbanFormOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Kanban
                </Button>
              </div>

              <div className="space-y-4">
                {kanbanConfigs.map((kanban) => (
                  <div key={kanban.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: kanban.color }}
                        />
                        <h3 className="font-medium">{kanban.name}</h3>
                        <Badge variant="secondary">{kanban.department}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditKanban(kanban)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {kanban.id !== 'geral' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteKanban(kanban.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Estágios:</h4>
                      <div className="flex flex-wrap gap-2">
                        {kanban.stages
                          .sort((a, b) => a.order_position - b.order_position)
                          .map((stage) => (
                            <Badge
                              key={stage.id}
                              variant="outline"
                              style={{ 
                                borderColor: stage.color,
                                color: stage.color 
                              }}
                            >
                              {stage.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onClose}>
              Salvar Configurações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Kanban Form Dialog */}
      <KanbanFormDialog
        isOpen={isKanbanFormOpen}
        onClose={() => {
          setIsKanbanFormOpen(false);
          setEditingKanban(null);
        }}
        onSubmit={handleKanbanSubmit}
        editKanban={editingKanban}
      />
    </>
  );
};
