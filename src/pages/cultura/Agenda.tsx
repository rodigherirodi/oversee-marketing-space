
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEvents, Event } from '@/data/culturaMockData';
import EventFormDialog from '@/components/EventFormDialog';
import { useToast } from '@/hooks/use-toast';

const typeColors = {
  social: 'bg-blue-100 text-blue-800',
  professional: 'bg-green-100 text-green-800',
  celebration: 'bg-purple-100 text-purple-800'
};

const typeLabels = {
  social: 'Social',
  professional: 'Profissional',
  celebration: 'Celebração'
};

const Agenda = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const { toast } = useToast();

  const handleCreateEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Evento criado!",
      description: "O novo evento foi adicionado à agenda.",
    });
  };

  const handleEditEvent = (eventData: Omit<Event, 'id'>) => {
    if (!editingEvent) return;
    
    setEvents(prev => prev.map(event => 
      event.id === editingEvent.id 
        ? { ...eventData, id: editingEvent.id }
        : event
    ));
    
    setEditingEvent(undefined);
    toast({
      title: "Evento atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast({
        title: "Evento excluído",
        description: "O evento foi removido da agenda.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAttendance = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isUserAttending: !event.isUserAttending,
            attendees: event.isUserAttending 
              ? event.attendees - 1 
              : event.attendees + 1
          }
        : event
    ));
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingEvent(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agenda & Eventos</h1>
          <p className="text-gray-600">Acompanhe os eventos e atividades da nossa cultura interna</p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700" onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Events Grid */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow overflow-hidden">
              {event.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge className={typeColors[event.type]}>
                    {typeLabels[event.type]}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(event)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <div className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('pt-BR')}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <CardDescription>{event.description}</CardDescription>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.attendees} participantes
                      {event.maxAttendees && ` (máx. ${event.maxAttendees})`}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    variant={event.isUserAttending ? "outline" : "default"}
                    className="w-full"
                    onClick={() => handleToggleAttendance(event.id)}
                  >
                    {event.isUserAttending ? 'Confirmado' : 'Participar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Google Calendar Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Integração com Google Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium mb-2">Integração com Google Calendar</p>
            <p className="text-sm mb-4">
              Em breve você poderá visualizar e sincronizar eventos diretamente 
              com sua agenda do Google Calendar
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://calendar.google.com/calendar/u/0/r', '_blank')}
            >
              Abrir Google Calendar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Form Dialog */}
      <EventFormDialog
        event={editingEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={editingEvent ? handleEditEvent : handleCreateEvent}
      />
    </div>
  );
};

export default Agenda;
