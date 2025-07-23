
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { MeetingHistory } from '@/types/client-history';

interface MeetingFormDialogProps {
  meeting?: MeetingHistory;
  clientId: string;
  onSave: (meeting: Omit<MeetingHistory, 'id' | 'createdAt' | 'createdBy'>) => void;
  onUpdate?: (id: string, updates: Partial<MeetingHistory>) => void;
  trigger: React.ReactNode;
}

const meetingTypes = [
  { value: 'alinhamento', label: 'Alinhamento', color: 'bg-blue-500' },
  { value: 'aprovacao', label: 'Aprovação', color: 'bg-green-500' },
  { value: 'planejamento', label: 'Planejamento', color: 'bg-purple-500' },
  { value: 'apresentacao', label: 'Apresentação', color: 'bg-orange-500' },
  { value: 'outro', label: 'Outro', color: 'bg-gray-500' }
];

export const MeetingFormDialog = ({ meeting, clientId, onSave, onUpdate, trigger }: MeetingFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: meeting?.date || '',
    type: meeting?.type || 'alinhamento',
    summary: meeting?.summary || '',
    participants: meeting?.participants || [],
    duration: meeting?.duration || '',
    link: meeting?.link || '',
    notes: meeting?.notes || ''
  });
  const [newParticipant, setNewParticipant] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const meetingData = {
      ...formData,
      clientId,
      type: formData.type as MeetingHistory['type']
    };

    if (meeting && onUpdate) {
      onUpdate(meeting.id, meetingData);
    } else {
      onSave(meetingData);
    }
    
    setOpen(false);
    if (!meeting) {
      setFormData({
        date: '',
        type: 'alinhamento',
        summary: '',
        participants: [],
        duration: '',
        link: '',
        notes: ''
      });
    }
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {meeting ? 'Editar Reunião' : 'Nova Reunião'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                placeholder="Ex: 1h 30min"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as MeetingHistory['type'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {meetingTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="summary">Resumo</Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="link">Link (opcional)</Label>
            <Input
              id="link"
              type="url"
              placeholder="https://meet.google.com/..."
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
            />
          </div>

          <div>
            <Label>Participantes</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Nome do participante"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
              />
              <Button type="button" onClick={addParticipant} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.participants.map((participant, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {participant}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeParticipant(index)} 
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {meeting ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
