import React, { useState } from 'react';
import { ArrowLeft, Building2, Globe, Users, Mail, Phone, MapPin, Star, Calendar, DollarSign, Shield, Edit2, Trash2, Plus, Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Credential {
  id: string;
  platform: string;
  username: string;
  link?: string;
  visible: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

const mockClient = {
  id: '1',
  name: 'TechCorp Solutions',
  segment: 'Tecnologia',
  logo: '/placeholder.svg',
  cover: '/placeholder.svg',
  status: 'active' as const,
  size: 'PME' as const,
  address: 'Rua das Flores, 123 - São Paulo, SP',
  website: 'https://techcorp.com.br',
  primaryContact: {
    name: 'João Silva',
    phone: '(11) 99999-9999',
    email: 'joao@techcorp.com.br'
  },
  financialContact: {
    name: 'Maria Santos',
    phone: '(11) 88888-8888',
    email: 'maria@techcorp.com.br'
  },
  socialMedia: {
    facebook: 'techcorp',
    instagram: '@techcorp',
    linkedin: 'techcorp-solutions'
  },
  contractType: 'recurring' as const,
  temperature: 'hot' as const,
  nps: 9,
  entryDate: '2024-01-15',
  responsibleManager: 'Carlos Mendes',
  createdAt: '2024-01-15T10:00:00Z'
};

const ClientProfile = () => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    { id: '1', name: 'João Silva', role: 'CEO', email: 'joao@techcorp.com.br', phone: '(11) 99999-9999' },
    { id: '2', name: 'Maria Santos', role: 'CFO', email: 'maria@techcorp.com.br', phone: '(11) 88888-8888' },
  ]);

  const [stakeholderModalOpen, setStakeholderModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [stakeholderForm, setStakeholderForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  });

  const handleAddStakeholder = () => {
    setEditingStakeholder(null);
    setStakeholderForm({ name: '', role: '', email: '', phone: '' });
    setStakeholderModalOpen(true);
  };

  const handleEditStakeholder = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setStakeholderForm({
      name: stakeholder.name,
      role: stakeholder.role,
      email: stakeholder.email,
      phone: stakeholder.phone
    });
    setStakeholderModalOpen(true);
  };

  const handleDeleteStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const handleSaveStakeholder = () => {
    if (editingStakeholder) {
      setStakeholders(stakeholders.map(s => 
        s.id === editingStakeholder.id 
          ? { ...s, ...stakeholderForm }
          : s
      ));
    } else {
      const newStakeholder: Stakeholder = {
        id: Date.now().toString(),
        ...stakeholderForm
      };
      setStakeholders([...stakeholders, newStakeholder]);
    }
    setStakeholderModalOpen(false);
    setStakeholderForm({ name: '', role: '', email: '', phone: '' });
    setEditingStakeholder(null);
  };

  const [credentials, setCredentials] = useState<Credential[]>([
    { id: '1', platform: 'Facebook', username: 'techcorp', link: 'https://facebook.com/techcorp', visible: true },
    { id: '2', platform: 'Instagram', username: '@techcorp', link: 'https://instagram.com/techcorp', visible: false },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Design Homepage', description: 'Create the initial design for the homepage.', status: 'todo', priority: 'high', dueDate: '2024-03-10' },
    { id: '2', title: 'Implement Login', description: 'Implement user login functionality.', status: 'doing', priority: 'medium', dueDate: '2024-03-15' },
  ]);

  const [isCredentialsVisible, setIsCredentialsVisible] = useState(false);

  const toggleCredentialsVisibility = () => {
    setIsCredentialsVisible(!isCredentialsVisible);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Cliente
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Cliente
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          src={mockClient.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarImage src={mockClient.logo} alt={mockClient.name} />
              <AvatarFallback className="text-2xl">
                {mockClient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 bg-card rounded-lg p-6 shadow-lg" style={{ marginLeft: '10px' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{mockClient.name}</h1>
                <p className="text-muted-foreground mb-4">{mockClient.segment}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={mockClient.status === 'active' ? 'default' : 'secondary'}>
                  {mockClient.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge variant="outline">{mockClient.size}</Badge>
                <Badge variant="outline" className={
                  mockClient.temperature === 'hot' ? 'bg-red-100 text-red-800' :
                  mockClient.temperature === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {mockClient.temperature === 'hot' ? 'Quente' : 
                   mockClient.temperature === 'warm' ? 'Morno' : 'Frio'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mockClient.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={mockClient.website} className="text-sm text-primary hover:underline">
                  {mockClient.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">NPS: {mockClient.nps}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Desde {new Date(mockClient.entryDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Contatos Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Contatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contato Principal</h4>
                  <p className="text-muted-foreground">
                    {mockClient.primaryContact.name} ({mockClient.primaryContact.email})
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contato Financeiro</h4>
                  <p className="text-muted-foreground">
                    {mockClient.financialContact.name} ({mockClient.financialContact.email})
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociais Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Redes Sociais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Facebook</h4>
                  <a href={`https://facebook.com/${mockClient.socialMedia.facebook}`} className="text-primary hover:underline">
                    {mockClient.socialMedia.facebook}
                  </a>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Instagram</h4>
                  <a href={`https://instagram.com/${mockClient.socialMedia.instagram}`} className="text-primary hover:underline">
                    {mockClient.socialMedia.instagram}
                  </a>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">LinkedIn</h4>
                  <a href={`https://linkedin.com/company/${mockClient.socialMedia.linkedin}`} className="text-primary hover:underline">
                    {mockClient.socialMedia.linkedin}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Stakeholders Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Stakeholders do Cliente
                </CardTitle>
                <Button onClick={handleAddStakeholder} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {stakeholders.map((stakeholder) => (
                  <div key={stakeholder.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {stakeholder.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{stakeholder.name}</h4>
                          <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground ml-13">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {stakeholder.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {stakeholder.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
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
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stakeholder Modal */}
            <Dialog open={stakeholderModalOpen} onOpenChange={setStakeholderModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingStakeholder ? 'Editar Stakeholder' : 'Adicionar Stakeholder'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stakeholder-name">Nome</Label>
                    <Input
                      id="stakeholder-name"
                      value={stakeholderForm.name}
                      onChange={(e) => setStakeholderForm({ ...stakeholderForm, name: e.target.value })}
                      placeholder="Nome do stakeholder"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stakeholder-role">Cargo</Label>
                    <Input
                      id="stakeholder-role"
                      value={stakeholderForm.role}
                      onChange={(e) => setStakeholderForm({ ...stakeholderForm, role: e.target.value })}
                      placeholder="Cargo do stakeholder"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stakeholder-email">Email</Label>
                    <Input
                      id="stakeholder-email"
                      type="email"
                      value={stakeholderForm.email}
                      onChange={(e) => setStakeholderForm({ ...stakeholderForm, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stakeholder-phone">Telefone</Label>
                    <Input
                      id="stakeholder-phone"
                      value={stakeholderForm.phone}
                      onChange={(e) => setStakeholderForm({ ...stakeholderForm, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setStakeholderModalOpen(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveStakeholder}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Credenciais Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Credenciais
                </CardTitle>
                <Button variant="ghost" onClick={toggleCredentialsVisibility}>
                  {isCredentialsVisible ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Mostrar
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {credentials.map((credential) => (
                  <div key={credential.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{credential.platform}</h4>
                      <p className="text-sm text-muted-foreground">
                        {isCredentialsVisible ? credential.username : '••••••••'}
                      </p>
                      {credential.link && isCredentialsVisible && (
                        <a href={credential.link} className="text-primary hover:underline text-sm">
                          Acessar
                        </a>
                      )}
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tarefas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge variant="secondary">{task.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={task.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">A fazer</SelectItem>
                        <SelectItem value="doing">Em andamento</SelectItem>
                        <SelectItem value="review">Em revisão</SelectItem>
                        <SelectItem value="done">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Informações Financeiras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Faturamento Mensal</h4>
                  <p className="text-muted-foreground">R$ 15.000,00</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Próximo Pagamento</h4>
                  <p className="text-muted-foreground">25 de Março de 2024</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Reuniões
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Reunião de Alinhamento</h4>
                  <p className="text-muted-foreground">10 de Março de 2024, 14:00</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Apresentação de Resultados</h4>
                  <p className="text-muted-foreground">20 de Março de 2024, 10:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
