
import React, { useState, useEffect } from 'react';
import { MeetingHistory, MeetingFormData } from '@/types/client-history';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface MeetingFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MeetingFormData) => void;
  meeting?: MeetingHistory;
}

export const MeetingFormDialog: React.FC<MeetingFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  meeting
}) => {
  const [formData, setFormData] = useState<MeetingFormData>({
    date: '',
    type: 'alinhamento',
    summary: '',
    participants: [],
    duration: 60,
    link: '',
    notes: '',
    nextActions: [],
  });

  const [newParticipant, setNewParticipant] = useState('');
  const [newAction, setNewAction] = useState('');

  useEffect(() => {
    if (meeting) {
      setFormData({
        date: meeting.date,
        type: meeting.type,
        summary: meeting.summary,
        participants: meeting.participants,
        duration: meeting.duration,
        link: meeting.link || '',
        notes: meeting.notes || '',
        nextActions: meeting.nextActions || [],
      });
    } else {
      setFormData({
        date: '',
        type: 'alinhamento',
        summary: '',
        participants: [],
        duration: 60,
        link: '',
        notes: '',
        nextActions: [],
      });
    }
  }, [meeting, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant.trim()]
      }));
      setNewParticipant('');
    }
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const addNextAction = () => {
    if (newAction.trim()) {
      setFormData(prev => ({
        ...prev,
        nextActions: [...(prev.nextActions || []), newAction.trim()]
      }));
      setNewAction('');
    }
  };

  const removeNextAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      nextActions: (prev.nextActions || []).filter((_, i) => i !== index)
    }));
  };

  const meetingTypes = [
    { value: 'alinhamento', label: 'Alinhamento' },
    { value: 'aprovacao', label: 'Aprovação' },
    { value: 'planejamento', label: 'Planejamento' },
    { value: 'apresentacao', label: 'Apresentação' },
    { value: 'outro', label: 'Outro' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {meeting ? 'Editar Reunião' : 'Nova Reunião'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Resumo</Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Resumo da reunião"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label>Participantes</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                placeholder="Nome do participante"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
              />
              <Button type="button" onClick={addParticipant}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.participants.map((participant, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {participant}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeParticipant(index)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas da reunião"
              className="h-20"
            />
          </div>

          <div>
            <Label>Próximas Ações</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Próxima ação"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNextAction())}
              />
              <Button type="button" onClick={addNextAction}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.nextActions || []).map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1">{action}</span>
                  <X className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500" 
                     onClick={() => removeNextAction(index)} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {meeting ? 'Atualizar' : 'Criar'} Reunião
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
