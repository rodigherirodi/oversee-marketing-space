
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Calendar, Users, FileText, Link, User, Phone } from 'lucide-react';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface Meeting {
  id: string;
  date: string;
  time: string;
  participants: string;
  agenda: string;
  notes: string;
  recordingLink: string;
  responsible: string;
}

const ClientProfile = () => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    {
      id: '1',
      name: 'João Silva',
      role: 'CTO',
      email: 'joao.silva@empresa.com',
      phone: '(11) 99999-9999'
    },
    {
      id: '2',
      name: 'Maria Santos',
      role: 'Product Manager',
      email: 'maria.santos@empresa.com',
      phone: '(11) 88888-8888'
    }
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      date: '2024-01-15',
      time: '14:00',
      participants: 'João Silva, Maria Santos',
      agenda: 'Planejamento Q1 2024',
      notes: 'Discussão sobre objetivos e metas para o primeiro trimestre',
      recordingLink: 'https://meet.google.com/rec/123456',
      responsible: 'João Silva'
    },
    {
      id: '2',
      date: '2024-01-08',
      time: '10:00',
      participants: 'Maria Santos, Equipe Dev',
      agenda: 'Review do Sprint',
      notes: 'Apresentação das funcionalidades desenvolvidas',
      recordingLink: 'https://meet.google.com/rec/789012',
      responsible: 'Maria Santos'
    }
  ]);

  const [stakeholderForm, setStakeholderForm] = useState<Omit<Stakeholder, 'id'>>({
    name: '',
    role: '',
    email: '',
    phone: ''
  });

  const [meetingForm, setMeetingForm] = useState<Omit<Meeting, 'id'>>({
    date: '',
    time: '',
    participants: '',
    agenda: '',
    notes: '',
    recordingLink: '',
    responsible: ''
  });

  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [isStakeholderDialogOpen, setIsStakeholderDialogOpen] = useState(false);
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);

  const handleStakeholderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStakeholder) {
      setStakeholders(stakeholders.map(s => 
        s.id === editingStakeholder.id ? { ...stakeholderForm, id: editingStakeholder.id } : s
      ));
      setEditingStakeholder(null);
    } else {
      setStakeholders([...stakeholders, { ...stakeholderForm, id: Date.now().toString() }]);
    }
    setStakeholderForm({ name: '', role: '', email: '', phone: '' });
    setIsStakeholderDialogOpen(false);
  };

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeeting) {
      setMeetings(meetings.map(m => 
        m.id === editingMeeting.id ? { ...meetingForm, id: editingMeeting.id } : m
      ));
      setEditingMeeting(null);
    } else {
      setMeetings([...meetings, { ...meetingForm, id: Date.now().toString() }]);
    }
    setMeetingForm({ date: '', time: '', participants: '', agenda: '', notes: '', recordingLink: '', responsible: '' });
    setIsMeetingDialogOpen(false);
  };

  const handleEditStakeholder = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setStakeholderForm({
      name: stakeholder.name,
      role: stakeholder.role,
      email: stakeholder.email,
      phone: stakeholder.phone
    });
    setIsStakeholderDialogOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setMeetingForm({
      date: meeting.date,
      time: meeting.time,
      participants: meeting.participants,
      agenda: meeting.agenda,
      notes: meeting.notes,
      recordingLink: meeting.recordingLink,
      responsible: meeting.responsible
    });
    setIsMeetingDialogOpen(true);
  };

  const handleDeleteStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const resetStakeholderForm = () => {
    setStakeholderForm({ name: '', role: '', email: '', phone: '' });
    setEditingStakeholder(null);
  };

  const resetMeetingForm = () => {
    setMeetingForm({ date: '', time: '', participants: '', agenda: '', notes: '', recordingLink: '', responsible: '' });
    setEditingMeeting(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            TC
          </div>
          <div>
            <h1 className="text-3xl font-bold">TechCorp Solutions</h1>
            <p className="text-gray-600">Cliente desde: Janeiro 2024</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Ativo
        </Badge>
      </div>

      {/* Informações do Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">CNPJ</Label>
              <p className="text-sm">12.345.678/0001-90</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Setor</Label>
              <p className="text-sm">Tecnologia</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Porte</Label>
              <p className="text-sm">Médio</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Endereço</Label>
              <p className="text-sm">Rua das Empresas, 123 - São Paulo, SP</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Stakeholders do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">Principais contatos</p>
              <Dialog open={isStakeholderDialogOpen} onOpenChange={setIsStakeholderDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={resetStakeholderForm}>
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingStakeholder ? 'Editar Stakeholder' : 'Adicionar Stakeholder'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleStakeholderSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={stakeholderForm.name}
                        onChange={(e) => setStakeholderForm({ ...stakeholderForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Cargo</Label>
                      <Input
                        id="role"
                        value={stakeholderForm.role}
                        onChange={(e) => setStakeholderForm({ ...stakeholderForm, role: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={stakeholderForm.email}
                        onChange={(e) => setStakeholderForm({ ...stakeholderForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={stakeholderForm.phone}
                        onChange={(e) => setStakeholderForm({ ...stakeholderForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingStakeholder ? 'Atualizar' : 'Adicionar'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsStakeholderDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stakeholders.map((stakeholder) => (
                  <TableRow key={stakeholder.id}>
                    <TableCell>{stakeholder.name}</TableCell>
                    <TableCell>{stakeholder.role}</TableCell>
                    <TableCell>{stakeholder.email}</TableCell>
                    <TableCell>{stakeholder.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditStakeholder(stakeholder)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteStakeholder(stakeholder.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Reuniões */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Histórico de Reuniões
              </CardTitle>
              <CardDescription>Registro de todas as reuniões realizadas</CardDescription>
            </div>
            <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetMeetingForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Reunião
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingMeeting ? 'Editar Reunião' : 'Nova Reunião'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleMeetingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={meetingForm.date}
                        onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        type="time"
                        value={meetingForm.time}
                        onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="participants">Participantes</Label>
                    <Input
                      id="participants"
                      value={meetingForm.participants}
                      onChange={(e) => setMeetingForm({ ...meetingForm, participants: e.target.value })}
                      placeholder="Ex: João Silva, Maria Santos"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsible">Responsável</Label>
                    <Input
                      id="responsible"
                      value={meetingForm.responsible}
                      onChange={(e) => setMeetingForm({ ...meetingForm, responsible: e.target.value })}
                      placeholder="Responsável pela reunião"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="agenda">Agenda</Label>
                    <Input
                      id="agenda"
                      value={meetingForm.agenda}
                      onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                      placeholder="Tópicos da reunião"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="recordingLink">Link da Gravação</Label>
                    <Input
                      id="recordingLink"
                      type="url"
                      value={meetingForm.recordingLink}
                      onChange={(e) => setMeetingForm({ ...meetingForm, recordingLink: e.target.value })}
                      placeholder="https://meet.google.com/rec/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Anotações</Label>
                    <Textarea
                      id="notes"
                      value={meetingForm.notes}
                      onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                      placeholder="Principais pontos discutidos..."
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingMeeting ? 'Atualizar' : 'Salvar'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsMeetingDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Agenda</TableHead>
                <TableHead>Gravação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{new Date(meeting.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{meeting.time}</TableCell>
                  <TableCell>{meeting.participants}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {meeting.responsible}
                    </div>
                  </TableCell>
                  <TableCell>{meeting.agenda}</TableCell>
                  <TableCell>
                    {meeting.recordingLink ? (
                      <a 
                        href={meeting.recordingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <Link className="w-4 h-4" />
                        Ver gravação
                      </a>
                    ) : (
                      <span className="text-gray-400">Não disponível</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditMeeting(meeting)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProfile;
