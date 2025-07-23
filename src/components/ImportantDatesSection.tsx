
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useImportantDates } from '@/hooks/useImportantDates';
import { ImportantDate } from '@/types/client-profile';
import { useToast } from '@/hooks/use-toast';

interface ImportantDatesSectionProps {
  clientId: string;
}

const statusLabels = {
  pending: 'Pendente',
  scheduled: 'Agendado',
  completed: 'Concluído'
};

const statusColors = {
  pending: 'bg-red-100 text-red-800',
  scheduled: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800'
};

export const ImportantDatesSection: React.FC<ImportantDatesSectionProps> = ({ clientId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<ImportantDate | undefined>();
  const [deletingDate, setDeletingDate] = useState<ImportantDate | undefined>();
  const [formData, setFormData] = useState({
    event: '',
    date: '',
    status: 'pending' as 'pending' | 'scheduled' | 'completed'
  });

  const { getDatesByClient, addImportantDate, updateImportantDate, deleteImportantDate } = useImportantDates();
  const { toast } = useToast();
  const dates = getDatesByClient(clientId);

  const handleSubmit = () => {
    if (editingDate) {
      updateImportantDate(editingDate.id, formData);
      toast({ title: "Data importante atualizada com sucesso" });
    } else {
      addImportantDate(clientId, formData);
      toast({ title: "Data importante adicionada com sucesso" });
    }
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDate(undefined);
    setFormData({ event: '', date: '', status: 'pending' });
  };

  const openEditForm = (date: ImportantDate) => {
    setEditingDate(date);
    setFormData({
      event: date.event,
      date: date.date,
      status: date.status
    });
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (deletingDate) {
      deleteImportantDate(deletingDate.id);
      setDeletingDate(undefined);
      toast({ title: "Data importante excluída com sucesso" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Datas Importantes
          </CardTitle>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dates.map((date) => (
              <div key={date.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium">{date.event}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(date.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className={statusColors[date.status]}>
                      {statusLabels[date.status]}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditForm(date)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeletingDate(date)}>
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
            <DialogTitle>{editingDate ? 'Editar Data Importante' : 'Nova Data Importante'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="event">Evento</Label>
              <Input
                id="event"
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingDate} onOpenChange={() => setDeletingDate(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Data Importante</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta data importante? Esta ação não pode ser desfeita.
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
