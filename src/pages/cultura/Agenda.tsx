
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEvents, Event } from '@/data/culturaMockData';

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
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [events] = useState<Event[]>(mockEvents);

  const filteredEvents = events.filter(event => 
    selectedFilter === 'all' || event.type === selectedFilter
  );

  const upcomingEvents = filteredEvents.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agenda & Eventos</h1>
          <p className="text-gray-600">Acompanhe os eventos e atividades da nossa cultura interna</p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedFilter('all')}
        >
          Todos
        </Button>
        <Button
          variant={selectedFilter === 'social' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedFilter('social')}
        >
          Social
        </Button>
        <Button
          variant={selectedFilter === 'professional' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedFilter('professional')}
        >
          Profissional
        </Button>
        <Button
          variant={selectedFilter === 'celebration' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedFilter('celebration')}
        >
          Celebração
        </Button>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Próximos Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge className={typeColors[event.type]}>
                    {typeLabels[event.type]}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
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
                  >
                    {event.isUserAttending ? 'Confirmado' : 'Participar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendário do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Visualização do calendário em desenvolvimento</p>
            <p className="text-sm">Em breve você poderá ver todos os eventos em formato de calendário</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;
