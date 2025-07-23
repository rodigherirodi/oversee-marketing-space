
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, FileText, Check, X } from 'lucide-react';
import { useSLA } from '@/hooks/useSLA';
import { SLAItem } from '@/types/client-profile';
import { useToast } from '@/hooks/use-toast';

interface SLASectionProps {
  clientId: string;
}

export const SLASection: React.FC<SLASectionProps> = ({ clientId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SLAItem | undefined>();
  const [deletingItem, setDeletingItem] = useState<SLAItem | undefined>();
  const [formData, setFormData] = useState({
    description: '',
    completed: false
  });

  const { getSLAByClient, addSLAItem, updateSLAItem, deleteSLAItem } = useSLA();
  const { toast } = useToast();
  const items = getSLAByClient(clientId);

  const handleSubmit = () => {
    if (editingItem) {
      updateSLAItem(editingItem.id, formData);
      toast({ title: "Item do SLA atualizado com sucesso" });
    } else {
      addSLAItem(clientId, formData);
      toast({ title: "Item do SLA adicionado com sucesso" });
    }
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(undefined);
    setFormData({ description: '', completed: false });
  };

  const openEditForm = (item: SLAItem) => {
    setEditingItem(item);
    setFormData({
      description: item.description,
      completed: item.completed
    });
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (deletingItem) {
      deleteSLAItem(deletingItem.id);
      setDeletingItem(undefined);
      toast({ title: "Item do SLA excluído com sucesso" });
    }
  };

  const toggleCompleted = (item: SLAItem) => {
    updateSLAItem(item.id, { completed: !item.completed });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            SLA/Escopo Contratado
          </CardTitle>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCompleted(item)}
                      className={`w-6 h-6 rounded flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {item.completed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                    <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                      {item.description}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditForm(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeletingItem(item)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={closeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Item do SLA' : 'Novo Item do SLA'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={formData.completed}
                onCheckedChange={(checked) => setFormData({ ...formData, completed: !!checked })}
              />
              <Label htmlFor="completed">Concluído</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Item do SLA</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item do SLA? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
