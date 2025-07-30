
import React, { useState, useEffect } from 'react';
import { KanbanConfig, KanbanStage } from '@/hooks/useKanbanConfigs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  X, 
  GripVertical,
  Palette,
  Save,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface KanbanFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (kanban: Omit<KanbanConfig, 'id'> | KanbanConfig) => void;
  editKanban?: KanbanConfig | null;
}

export const KanbanFormDialog: React.FC<KanbanFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editKanban
}) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    color: '#3B82F6',
  });
  const [stages, setStages] = useState<Omit<KanbanStage, 'id'>[]>([
    { name: 'A Fazer', color: '#6B7280', order_position: 1 },
    { name: 'Em Andamento', color: '#3B82F6', order_position: 2 },
    { name: 'Concluído', color: '#10B981', order_position: 3 },
  ]);
  const [newStageName, setNewStageName] = useState('');

  const departments = [
    'Design',
    'Tecnologia', 
    'Conteúdo',
    'Marketing',
    'Análise',
    'Gestão',
    'Comercial'
  ];

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6B7280', '#1F2937', '#059669'
  ];

  useEffect(() => {
    if (editKanban) {
      setFormData({
        name: editKanban.name,
        department: editKanban.department,
        color: editKanban.color,
      });
      setStages(editKanban.stages.map(stage => ({
        name: stage.name,
        color: stage.color,
        order_position: stage.order_position
      })));
    } else {
      setFormData({
        name: '',
        department: '',
        color: '#3B82F6',
      });
      setStages([
        { name: 'A Fazer', color: '#6B7280', order_position: 1 },
        { name: 'Em Andamento', color: '#3B82F6', order_position: 2 },
        { name: 'Concluído', color: '#10B981', order_position: 3 },
      ]);
    }
  }, [editKanban, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.department || stages.length === 0) return;

    const kanbanData = {
      ...formData,
      stages: stages.map((stage, index) => ({
        id: `stage-${Date.now()}-${index}`,
        ...stage,
        order_position: index + 1
      }))
    };

    if (editKanban) {
      onSubmit({ ...editKanban, ...kanbanData });
    } else {
      onSubmit(kanbanData);
    }

    onClose();
  };

  const addStage = () => {
    if (newStageName.trim()) {
      setStages(prev => [
        ...prev,
        {
          name: newStageName,
          color: colors[Math.floor(Math.random() * colors.length)],
          order_position: prev.length + 1
        }
      ]);
      setNewStageName('');
    }
  };

  const removeStage = (index: number) => {
    setStages(prev => prev.filter((_, i) => i !== index));
  };

  const updateStage = (index: number, updates: Partial<Omit<KanbanStage, 'id'>>) => {
    setStages(prev => prev.map((stage, i) => 
      i === index ? { ...stage, ...updates } : stage
    ));
  };

  const moveStage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === stages.length - 1)
    ) return;

    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    setStages(newStages);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editKanban ? 'Editar Kanban' : 'Novo Kanban'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Kanban</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Design, Desenvolvimento..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Departamento</label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Cor do Kanban</label>
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-8 h-8 rounded border-2 border-gray-200" 
                style={{ backgroundColor: formData.color }}
              />
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-20 h-8 p-1"
              />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          {/* Stages */}
          <div>
            <label className="block text-sm font-medium mb-4">Estágios do Kanban</label>
            
            {/* Add new stage */}
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Nome do novo estágio..."
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStage())}
                className="flex-1"
              />
              <Button type="button" onClick={addStage} disabled={!newStageName.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Stages list */}
            <div className="space-y-2">
              {stages.map((stage, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2 cursor-move">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: stage.color }}
                    />
                  </div>
                  
                  <Input
                    value={stage.name}
                    onChange={(e) => updateStage(index, { name: e.target.value })}
                    className="flex-1"
                  />
                  
                  <Input
                    type="color"
                    value={stage.color}
                    onChange={(e) => updateStage(index, { color: e.target.value })}
                    className="w-16 h-8 p-1"
                  />
                  
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStage(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStage(index, 'down')}
                      disabled={index === stages.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStage(index)}
                      disabled={stages.length <= 1}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {editKanban ? 'Salvar Alterações' : 'Criar Kanban'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
