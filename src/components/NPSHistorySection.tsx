
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { useNPSHistory } from '@/hooks/useNPSHistory';
import { NPSRecord } from '@/types/client-profile';
import { useToast } from '@/hooks/use-toast';

interface NPSHistorySectionProps {
  clientId: string;
}

export const NPSHistorySection: React.FC<NPSHistorySectionProps> = ({ clientId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<NPSRecord | undefined>();
  const [deletingRecord, setDeletingRecord] = useState<NPSRecord | undefined>();
  const [formData, setFormData] = useState({
    date: '',
    score: 0,
    responsible: '',
    comment: ''
  });

  const { getNPSByClient, addNPSRecord, updateNPSRecord, deleteNPSRecord } = useNPSHistory();
  const { toast } = useToast();
  const records = getNPSByClient(clientId);

  const handleSubmit = () => {
    if (editingRecord) {
      updateNPSRecord(editingRecord.id, formData);
      toast({ title: "NPS atualizado com sucesso" });
    } else {
      addNPSRecord(clientId, formData);
      toast({ title: "NPS adicionado com sucesso" });
    }
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRecord(undefined);
    setFormData({ date: '', score: 0, responsible: '', comment: '' });
  };

  const openEditForm = (record: NPSRecord) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      score: record.score,
      responsible: record.responsible,
      comment: record.comment
    });
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (deletingRecord) {
      deleteNPSRecord(deletingRecord.id);
      setDeletingRecord(undefined);
      toast({ title: "NPS excluído com sucesso" });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-green-100 text-green-800';
    if (score >= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Histórico de NPS
          </CardTitle>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo NPS
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <Badge className={getScoreColor(record.score)}>
                      {record.score}/10
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-sm font-medium">{record.responsible}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditForm(record)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeletingRecord(record)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm">{record.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={closeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Editar NPS' : 'Novo NPS'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
              <Label htmlFor="score">Pontuação (0-10)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="10"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="comment">Comentário</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingRecord} onOpenChange={() => setDeletingRecord(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir NPS</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro de NPS? Esta ação não pode ser desfeita.
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
