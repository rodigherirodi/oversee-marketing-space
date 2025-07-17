import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, FileText, Users, Clock, Phone, Mail, MapPin, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

interface Meeting {
  id: number;
  date: string;
  topic: string;
  description: string;
  recordingLink?: string;
  responsible: string;
}

interface Stakeholder {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

const ClientProfile = () => {
  // Initial client data (replace with actual data fetching)
  const [client, setClient] = useState({
    name: 'Nome do Cliente',
    industry: 'Setor do Cliente',
    contactPerson: 'Contato Principal',
    email: 'email@cliente.com',
    phone: '123-456-7890',
    address: 'Endereço do Cliente',
    projects: [
      { id: 1, name: 'Projeto A', status: 'Em Andamento' },
      { id: 2, name: 'Projeto B', status: 'Concluído' },
    ],
  });

  // Meeting History state
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      date: '2024-01-15',
      topic: 'Reunião de Kickoff',
      description: 'Reunião inicial para definir escopo e cronograma do projeto.',
      recordingLink: 'https://example.com/recording1',
      responsible: 'João Silva'
    },
    {
      id: 2,
      date: '2024-01-22',
      topic: 'Review Sprint 1',
      description: 'Apresentação dos primeiros resultados e ajustes necessários.',
      responsible: 'Maria Santos'
    }
  ]);

  // Meeting form state
  const [meetingForm, setMeetingForm] = useState<Partial<Meeting>>({});
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<number | null>(null);

  // Stakeholders state
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    { id: 1, name: 'João', role: 'Gerente', email: 'joao@example.com', phone: '99999-9999' },
    { id: 2, name: 'Maria', role: 'Analista', email: 'maria@example.com', phone: '88888-8888' },
  ]);

  // Stakeholder form state
  const [stakeholderForm, setStakeholderForm] = useState<Partial<Stakeholder>>({});
  const [isStakeholderModalOpen, setIsStakeholderModalOpen] = useState(false);
  const [editingStakeholderId, setEditingStakeholderId] = useState<number | null>(null);

  // Stakeholder CRUD functions
  const handleAddStakeholder = () => {
    setStakeholderForm({});
    setEditingStakeholderId(null);
    setIsStakeholderModalOpen(true);
  };

  const handleEditStakeholder = (stakeholder: Stakeholder) => {
    setStakeholderForm(stakeholder);
    setEditingStakeholderId(stakeholder.id);
    setIsStakeholderModalOpen(true);
  };

  const handleDeleteStakeholder = (id: number) => {
    setStakeholders(prev => prev.filter(stakeholder => stakeholder.id !== id));
  };

  const handleSaveStakeholder = () => {
    if (editingStakeholderId) {
      // Edit existing stakeholder
      setStakeholders(prev => prev.map(stakeholder =>
        stakeholder.id === editingStakeholderId
          ? { ...stakeholder, ...stakeholderForm } as Stakeholder
          : stakeholder
      ));
    } else {
      // Add new stakeholder
      const newStakeholder: Stakeholder = {
        id: Date.now(),
        name: stakeholderForm.name || '',
        role: stakeholderForm.role || '',
        email: stakeholderForm.email || '',
        phone: stakeholderForm.phone || ''
      } as Stakeholder;
      setStakeholders(prev => [...prev, newStakeholder]);
    }
    setIsStakeholderModalOpen(false);
    setStakeholderForm({});
    setEditingStakeholderId(null);
  };

  // Meeting CRUD functions
  const handleAddMeeting = () => {
    setMeetingForm({});
    setEditingMeetingId(null);
    setIsMeetingModalOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setMeetingForm(meeting);
    setEditingMeetingId(meeting.id);
    setIsMeetingModalOpen(true);
  };

  const handleDeleteMeeting = (id: number) => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));
  };

  const handleSaveMeeting = () => {
    if (editingMeetingId) {
      // Edit existing meeting
      setMeetings(prev => prev.map(meeting => 
        meeting.id === editingMeetingId 
          ? { ...meeting, ...meetingForm } as Meeting
          : meeting
      ));
    } else {
      // Add new meeting
      const newMeeting: Meeting = {
        id: Date.now(),
        date: meetingForm.date || '',
        topic: meetingForm.topic || '',
        description: meetingForm.description || '',
        recordingLink: meetingForm.recordingLink || '',
        responsible: meetingForm.responsible || ''
      };
      setMeetings(prev => [...prev, newMeeting]);
    }
    setIsMeetingModalOpen(false);
    setMeetingForm({});
    setEditingMeetingId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold text-white">{client.name}</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="meetings">Reuniões</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <FileText className="mr-2 inline-block h-4 w-4" />
                      <span className="font-semibold">Setor:</span> {client.industry}
                    </p>
                    <p>
                      <Users className="mr-2 inline-block h-4 w-4" />
                      <span className="font-semibold">Contato:</span> {client.contactPerson}
                    </p>
                    <p>
                      <Mail className="mr-2 inline-block h-4 w-4" />
                      <span className="font-semibold">Email:</span> {client.email}
                    </p>
                    <p>
                      <Phone className="mr-2 inline-block h-4 w-4" />
                      <span className="font-semibold">Telefone:</span> {client.phone}
                    </p>
                    <p>
                      <MapPin className="mr-2 inline-block h-4 w-4" />
                      <span className="font-semibold">Endereço:</span> {client.address}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Projetos Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-none pl-0">
                    {client.projects.map((project) => (
                      <li key={project.id} className="mb-2">
                        <div className="flex items-center justify-between">
                          <span>{project.name}</span>
                          <Badge variant="secondary">{project.status}</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximas Ações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nenhuma ação pendente.</p>
                </CardContent>
              </Card>
            </div>

            {/* Meeting History Section - Updated */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico de Reuniões
                </CardTitle>
                <Dialog open={isMeetingModalOpen} onOpenChange={setIsMeetingModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddMeeting} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Nova Reunião
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMeetingId ? 'Editar Reunião' : 'Nova Reunião'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingMeetingId ? 'Edite os detalhes da reunião.' : 'Adicione uma nova reunião ao histórico.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="meeting-date" className="text-right">
                          Data
                        </Label>
                        <Input
                          id="meeting-date"
                          type="date"
                          value={meetingForm.date || ''}
                          onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="meeting-topic" className="text-right">
                          Tópico
                        </Label>
                        <Input
                          id="meeting-topic"
                          value={meetingForm.topic || ''}
                          onChange={(e) => setMeetingForm(prev => ({ ...prev, topic: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="meeting-responsible" className="text-right">
                          Responsável
                        </Label>
                        <Input
                          id="meeting-responsible"
                          value={meetingForm.responsible || ''}
                          onChange={(e) => setMeetingForm(prev => ({ ...prev, responsible: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="meeting-recording" className="text-right">
                          Link Gravação
                        </Label>
                        <Input
                          id="meeting-recording"
                          type="url"
                          placeholder="https://..."
                          value={meetingForm.recordingLink || ''}
                          onChange={(e) => setMeetingForm(prev => ({ ...prev, recordingLink: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="meeting-description" className="text-right mt-2">
                          Descrição
                        </Label>
                        <Textarea
                          id="meeting-description"
                          value={meetingForm.description || ''}
                          onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                          className="col-span-3"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveMeeting}>
                        {editingMeetingId ? 'Salvar Alterações' : 'Adicionar Reunião'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tópico</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Gravação</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetings.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell>{new Date(meeting.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="font-medium">{meeting.topic}</TableCell>
                        <TableCell>{meeting.responsible}</TableCell>
                        <TableCell className="max-w-xs truncate">{meeting.description}</TableCell>
                        <TableCell>
                          {meeting.recordingLink ? (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={meeting.recordingLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMeeting(meeting)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMeeting(meeting.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projetos do Cliente</CardTitle>
                <CardDescription>Lista de projetos associados a este cliente.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings">
            <Card>
              <CardHeader>
                <CardTitle>Agendamento de Reuniões</CardTitle>
                <CardDescription>Agende novas reuniões com o cliente.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stakeholders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Stakeholders
                </CardTitle>
                <Dialog open={isStakeholderModalOpen} onOpenChange={setIsStakeholderModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddStakeholder} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Novo Stakeholder
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingStakeholderId ? 'Editar Stakeholder' : 'Novo Stakeholder'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingStakeholderId ? 'Edite os detalhes do stakeholder.' : 'Adicione um novo stakeholder.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stakeholder-name" className="text-right">
                          Nome
                        </Label>
                        <Input
                          id="stakeholder-name"
                          value={stakeholderForm.name || ''}
                          onChange={(e) => setStakeholderForm(prev => ({ ...prev, name: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stakeholder-role" className="text-right">
                          Função
                        </Label>
                        <Input
                          id="stakeholder-role"
                          value={stakeholderForm.role || ''}
                          onChange={(e) => setStakeholderForm(prev => ({ ...prev, role: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stakeholder-email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="stakeholder-email"
                          type="email"
                          value={stakeholderForm.email || ''}
                          onChange={(e) => setStakeholderForm(prev => ({ ...prev, email: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stakeholder-phone" className="text-right">
                          Telefone
                        </Label>
                        <Input
                          id="stakeholder-phone"
                          value={stakeholderForm.phone || ''}
                          onChange={(e) => setStakeholderForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveStakeholder}>
                        {editingStakeholderId ? 'Salvar Alterações' : 'Adicionar Stakeholder'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stakeholders.map((stakeholder) => (
                      <TableRow key={stakeholder.id}>
                        <TableCell className="font-medium">{stakeholder.name}</TableCell>
                        <TableCell>{stakeholder.role}</TableCell>
                        <TableCell>{stakeholder.email}</TableCell>
                        <TableCell>{stakeholder.phone}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStakeholder(stakeholder)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStakeholder(stakeholder.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientProfile;
