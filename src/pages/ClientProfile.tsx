import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarIcon, Edit, Trash2, Plus, Users, FileText, Video, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ClientProfileProps { }

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface InfoItemProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface MeetingHistory {
  id: string;
  date: string;
  type: string;
  participants: string[];
  summary: string;
  recordingLink?: string;
  responsible: string;
}

const ClientProfile = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
  });
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'João Silva',
      role: 'Gerente de Projetos',
      email: 'joao.silva@example.com',
      phone: '+55 11 99999-8888',
    },
    {
      id: '2',
      name: 'Maria Santos',
      role: 'Analista de Marketing',
      email: 'maria.santos@example.com',
      phone: '+55 21 98888-7777',
    },
  ]);

  const tabs: Tab[] = [
    { id: 'perfil', label: 'Perfil', icon: <User className="h-5 w-5" /> },
    { id: 'historico', label: 'Histórico', icon: <FileText className="h-5 w-5" /> },
  ];

  const [meetingHistory, setMeetingHistory] = useState<MeetingHistory[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'Reunião de Alinhamento',
      participants: ['João Silva', 'Maria Santos'],
      summary: 'Discussão sobre requisitos iniciais do projeto',
      recordingLink: 'https://example.com/recording1',
      responsible: 'João Silva'
    },
    {
      id: '2',
      date: '2024-01-22',
      type: 'Review Semanal',
      participants: ['João Silva', 'Pedro Costa'],
      summary: 'Revisão do progresso da primeira sprint',
      recordingLink: 'https://example.com/recording2',
      responsible: 'Pedro Costa'
    }
  ]);

  const [isEditingMeeting, setIsEditingMeeting] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [meetingFormData, setMeetingFormData] = useState({
    date: new Date(),
    type: '',
    participants: '',
    summary: '',
    recordingLink: '',
    responsible: ''
  });

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = () => {
    const newContactWithId = { ...newContact, id: Date.now().toString() };
    setContacts([...contacts, newContactWithId]);
    handleCloseContactModal();
    setNewContact({ name: '', role: '', email: '', phone: '' }); // Reset form
  };

  const handleAddMeeting = () => {
    setIsEditingMeeting(true);
    setEditingMeetingId(null);
    setMeetingFormData({
      date: new Date(),
      type: '',
      participants: '',
      summary: '',
      recordingLink: '',
      responsible: ''
    });
  };

  const handleEditMeeting = (meeting: MeetingHistory) => {
    setIsEditingMeeting(true);
    setEditingMeetingId(meeting.id);
    setMeetingFormData({
      date: new Date(meeting.date),
      type: meeting.type,
      participants: meeting.participants.join(', '),
      summary: meeting.summary,
      recordingLink: meeting.recordingLink || '',
      responsible: meeting.responsible
    });
  };

  const handleSaveMeeting = () => {
    if (editingMeetingId) {
      // Edit existing meeting
      setMeetingHistory(prev => prev.map(meeting => 
        meeting.id === editingMeetingId
          ? {
              ...meeting,
              date: format(meetingFormData.date, 'yyyy-MM-dd'),
              type: meetingFormData.type,
              participants: meetingFormData.participants.split(',').map(p => p.trim()),
              summary: meetingFormData.summary,
              recordingLink: meetingFormData.recordingLink,
              responsible: meetingFormData.responsible
            }
          : meeting
      ));
    } else {
      // Add new meeting
      const newMeeting: MeetingHistory = {
        id: Date.now().toString(),
        date: format(meetingFormData.date, 'yyyy-MM-dd'),
        type: meetingFormData.type,
        participants: meetingFormData.participants.split(',').map(p => p.trim()),
        summary: meetingFormData.summary,
        recordingLink: meetingFormData.recordingLink,
        responsible: meetingFormData.responsible
      };
      setMeetingHistory(prev => [...prev, newMeeting]);
    }
    setIsEditingMeeting(false);
    setEditingMeetingId(null);
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetingHistory(prev => prev.filter(meeting => meeting.id !== id));
  };

  const handleCancelMeeting = () => {
    setIsEditingMeeting(false);
    setEditingMeetingId(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Perfil do Cliente</h1>
          <p className="text-muted-foreground">Gerencie e visualize informações detalhadas do cliente.</p>
        </div>
        <Badge variant="secondary">ID: 12345</Badge>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex items-center gap-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-muted-foreground'}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Profile Tab Content */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Detalhes básicos sobre o cliente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input type="text" value="Empresa Exemplo LTDA" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Setor</Label>
                <Input type="text" value="Tecnologia" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Localização</Label>
                <Input type="text" value="São Paulo, Brasil" readOnly />
              </div>
            </CardContent>
          </Card>

          {/* Contatos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contatos</CardTitle>
                <CardDescription>Pessoas de contato dentro da empresa.</CardDescription>
              </div>
              <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleOpenContactModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Contato
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Contato</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contact-name">Nome</Label>
                      <Input
                        id="contact-name"
                        name="name"
                        value={newContact.name}
                        onChange={handleInputChange}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-role">Cargo</Label>
                      <Input
                        id="contact-role"
                        name="role"
                        value={newContact.role}
                        onChange={handleInputChange}
                        placeholder="Cargo na empresa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={newContact.email}
                        onChange={handleInputChange}
                        placeholder="Email corporativo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Telefone</Label>
                      <Input
                        id="contact-phone"
                        name="phone"
                        value={newContact.phone}
                        onChange={handleInputChange}
                        placeholder="Número de telefone"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCloseContactModal}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddContact}>
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm"><strong>Email:</strong> {contact.email}</p>
                      <p className="text-sm"><strong>Telefone:</strong> {contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Histórico Tab Content */}
      {activeTab === 'historico' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Histórico de Interações */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Interações</CardTitle>
              <CardDescription>Registro de todas as interações com o cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">Nenhuma interação registrada.</p>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Reuniões */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Histórico de Reuniões
                </CardTitle>
                <CardDescription>Registro de todas as reuniões realizadas</CardDescription>
              </div>
              <Dialog open={isEditingMeeting} onOpenChange={setIsEditingMeeting}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleAddMeeting}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMeetingId ? 'Editar Reunião' : 'Nova Reunião'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="meeting-date">Data</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !meetingFormData.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {meetingFormData.date ? format(meetingFormData.date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={meetingFormData.date}
                              onSelect={(date) => date && setMeetingFormData(prev => ({ ...prev, date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="meeting-type">Tipo</Label>
                        <Select value={meetingFormData.type} onValueChange={(value) => setMeetingFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Reunião de Alinhamento">Reunião de Alinhamento</SelectItem>
                            <SelectItem value="Review Semanal">Review Semanal</SelectItem>
                            <SelectItem value="Reunião de Projeto">Reunião de Projeto</SelectItem>
                            <SelectItem value="Reunião Comercial">Reunião Comercial</SelectItem>
                            <SelectItem value="Reunião de Suporte">Reunião de Suporte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="meeting-participants">Participantes (separados por vírgula)</Label>
                      <Input
                        id="meeting-participants"
                        value={meetingFormData.participants}
                        onChange={(e) => setMeetingFormData(prev => ({ ...prev, participants: e.target.value }))}
                        placeholder="João Silva, Maria Santos"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meeting-responsible">Responsável</Label>
                      <Input
                        id="meeting-responsible"
                        value={meetingFormData.responsible}
                        onChange={(e) => setMeetingFormData(prev => ({ ...prev, responsible: e.target.value }))}
                        placeholder="Nome do responsável"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meeting-recording">Link da Gravação</Label>
                      <Input
                        id="meeting-recording"
                        value={meetingFormData.recordingLink}
                        onChange={(e) => setMeetingFormData(prev => ({ ...prev, recordingLink: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="meeting-summary">Resumo</Label>
                      <Textarea
                        id="meeting-summary"
                        value={meetingFormData.summary}
                        onChange={(e) => setMeetingFormData(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Resumo da reunião..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCancelMeeting}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveMeeting}>
                        {editingMeetingId ? 'Salvar' : 'Adicionar'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetingHistory.map((meeting) => (
                  <div key={meeting.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{meeting.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(meeting.date), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMeeting(meeting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm"><strong>Responsável:</strong> {meeting.responsible}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm"><strong>Participantes:</strong> {meeting.participants.join(', ')}</span>
                      </div>
                      {meeting.recordingLink && (
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={meeting.recordingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Ver gravação
                          </a>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{meeting.summary}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
