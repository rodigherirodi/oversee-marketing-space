
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Event } from '@/data/culturaMockData';
import ImageUpload from './ImageUpload';

interface EventFormDialogProps {
  event?: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Omit<Event, 'id'>) => void;
}

const EventFormDialog: React.FC<EventFormDialogProps> = ({
  event,
  open,
  onOpenChange,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date || '',
    time: event?.time || '',
    type: event?.type || 'social' as const,
    description: event?.description || '',
    location: event?.location || '',
    maxAttendees: event?.maxAttendees || 0,
    imageUrl: event?.imageUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData: Omit<Event, 'id'> = {
      ...formData,
      attendees: event?.attendees || 0,
      isUserAttending: event?.isUserAttending || false,
    };

    onSave(eventData);
    onOpenChange(false);
    
    // Reset form if creating new event
    if (!event) {
      setFormData({
        title: '',
        date: '',
        time: '',
        type: 'social',
        description: '',
        location: '',
        maxAttendees: 0,
        imageUrl: '',
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
          <DialogDescription>
            {event 
              ? 'Faça as alterações necessárias no evento'
              : 'Preencha os dados para criar um novo evento'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Digite o título do evento"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo do Evento</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'social' | 'professional' | 'celebration') => 
                handleInputChange('type', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="professional">Profissional</SelectItem>
                <SelectItem value="celebration">Celebração</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o evento"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Onde será realizado o evento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Máximo de Participantes</Label>
            <Input
              id="maxAttendees"
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
              placeholder="0 = sem limite"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagem de Capa</Label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(value) => handleInputChange('imageUrl', value || '')}
              fallbackText="Capa"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
              {event ? 'Salvar Alterações' : 'Criar Evento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormDialog;
