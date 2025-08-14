
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Calendar, Globe, MapPin, Phone, Mail, Plus } from 'lucide-react';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useSupabaseClientAccesses } from '@/hooks/useSupabaseClientAccesses';
import { useSupabaseClientContacts } from '@/hooks/useSupabaseClientContacts';
import { useSupabaseClientMeetings } from '@/hooks/useSupabaseClientMeetings';
import { useSupabaseClientNotes } from '@/hooks/useSupabaseClientNotes';
import AccessDialog from '@/components/AccessDialog';
import ContactFormDialog from '@/components/ContactFormDialog';
import MeetingFormDialog from '@/components/MeetingFormDialog';
import ClientNotesSection from '@/components/ClientNotesSection';
import { formatPhoneNumber } from '@/utils/phoneUtils';

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [editingAccess, setEditingAccess] = useState<any>(null);

  const { getClient } = useSupabaseClients();
  const { accesses, addAccess, updateAccess, deleteAccess } = useSupabaseClientAccesses(id);
  const { contacts, addContact } = useSupabaseClientContacts(id);
  const { meetings, addMeeting } = useSupabaseClientMeetings(id);
  const { notes } = useSupabaseClientNotes(id);

  useEffect(() => {
    if (id) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    if (id) {
      const clientData = await getClient(id);
      setClient(clientData);
    }
  };

  const handleAddAccess = async (data: any) => {
    if (id) {
      await addAccess({
        ...data,
        cliente_id: id
      });
      setAccessDialogOpen(false);
      setEditingAccess(null);
    }
  };

  const handleEditAccess = async (data: any) => {
    if (editingAccess) {
      await updateAccess(editingAccess.id, data);
      setAccessDialogOpen(false);
      setEditingAccess(null);
    }
  };

  const handleDeleteAccess = async (accessId: string) => {
    await deleteAccess(accessId);
  };

  const openEditAccess = (access: any) => {
    setEditingAccess(access);
    setAccessDialogOpen(true);
  };

  const handleAddContact = async (data: any) => {
    if (id) {
      await addContact({
        ...data,
        cliente_id: id
      });
      setContactDialogOpen(false);
    }
  };

  const handleAddMeeting = async (data: any) => {
    if (id) {
      await addMeeting({
        ...data,
        cliente_id: id
      });
      setMeetingDialogOpen(false);
    }
  };

  if (!client) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header do Cliente */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={client.logo_url} alt={client.nome} />
              <AvatarFallback className="text-xl">
                {client.nome.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">{client.nome}</h1>
                {client.status && (
                  <Badge variant={client.status === 'ativo' ? 'default' : 'secondary'}>
                    {client.status}
                  </Badge>
                )}
              </div>
              
              {client.descricao && (
                <p className="text-muted-foreground">{client.descricao}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {client.segmento && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {client.segmento}
                  </div>
                )}
                {client.cidade && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {client.cidade}, {client.uf}
                  </div>
                )}
                {client.site && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a href={client.site} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {client.site}
                    </a>
                  </div>
                )}
                {client.cliente_desde && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Cliente desde {new Date(client.cliente_desde).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-fit">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="accesses">Acessos</TabsTrigger>
          <TabsTrigger value="meetings">Reuniões</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
        </Tabs>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contatos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{contacts.length}</p>
                <p className="text-sm text-muted-foreground">
                  {contacts.filter(c => c.is_primary).length} principal(is)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acessos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{accesses.length}</p>
                <p className="text-sm text-muted-foreground">
                  {accesses.filter(a => a.status).length} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reuniões</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{meetings.length}</p>
                <p className="text-sm text-muted-foreground">
                  Histórico completo
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Contatos</h2>
            <Button onClick={() => setContactDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Contato
            </Button>
          </div>

          <div className="grid gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{contact.nome}</h3>
                        {contact.is_primary && (
                          <Badge variant="default" className="text-xs">Principal</Badge>
                        )}
                      </div>
                      {contact.cargo && (
                        <p className="text-sm text-muted-foreground">{contact.cargo}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm">
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                        )}
                        {contact.telefone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {formatPhoneNumber(contact.telefone)}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">{contact.tipo}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accesses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Acessos</h2>
            <Button onClick={() => setAccessDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Acesso
            </Button>
          </div>

          <div className="grid gap-4">
            {accesses.map((access) => (
              <Card key={access.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{access.plataforma}</h3>
                        <Badge variant={access.status ? "default" : "secondary"}>
                          {access.status ? "Ativo" : "Inativo"}
                        </Badge>
                        {access.categoria && (
                          <Badge variant="outline">{access.categoria}</Badge>
                        )}
                      </div>
                      {access.url && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Globe className="w-4 h-4" />
                          <a href={access.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {access.url}
                          </a>
                        </div>
                      )}
                      {access.usuario && (
                        <p className="text-sm"><strong>Usuário:</strong> {access.usuario}</p>
                      )}
                      {access.notas && (
                        <p className="text-sm text-muted-foreground">{access.notas}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditAccess(access)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAccess(access.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Reuniões</h2>
            <Button onClick={() => setMeetingDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agendar Reunião
            </Button>
          </div>

          <div className="grid gap-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{meeting.titulo}</h3>
                      <Badge variant="outline">{meeting.tipo || 'Reunião'}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(meeting.data_hora).toLocaleString()}
                      </div>
                      {meeting.duracao && (
                        <span>{meeting.duracao} min</span>
                      )}
                    </div>
                    {meeting.participantes && meeting.participantes.length > 0 && (
                      <div className="text-sm">
                        <strong>Participantes:</strong> {meeting.participantes.join(', ')}
                      </div>
                    )}
                    {meeting.resumo && (
                      <p className="text-sm text-muted-foreground">{meeting.resumo}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <ClientNotesSection clientId={id!} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AccessDialog
        open={accessDialogOpen}
        onOpenChange={setAccessDialogOpen}
        access={editingAccess}
        onSave={editingAccess ? handleEditAccess : handleAddAccess}
      />

      <ContactFormDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        onSave={handleAddContact}
      />

      <MeetingFormDialog
        open={meetingDialogOpen}
        onOpenChange={setMeetingDialogOpen}
        onSave={handleAddMeeting}
      />
    </div>
  );
};

export default ClientProfile;
