import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockClients } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Globe, Phone, Mail, Facebook, Instagram, Linkedin, MapPin, Calendar, Building2, Users, Star, AlertCircle, FileText, Clock, Target, Edit, ExternalLink, Thermometer, Shield, Video, PenTool, BarChart3, Upload, X, Save, Camera, Plus, Trash2 } from 'lucide-react';

interface PasswordAccess {
  id: string;
  platform: string;
  login: string;
  status: 'active' | 'inactive';
  notes: string;
}

interface Stakeholder {
  id: string;
  name: string;
  position: string;
  type: 'decisor' | 'aprovador' | 'operacional' | 'influenciador';
  contact: string;
}

interface PageLink {
  id: string;
  name: string;
  url: string;
  type: 'landing' | 'site' | 'blog' | 'loja';
  status: 'active' | 'inactive' | 'development';
}

interface MediaCampaign {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'inactive' | 'completed';
  investment: string;
  result: string;
}

const ClientProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  
  // Find the client - in a real app, this would be fetched from an API
  const originalClient = mockClients.find(c => c.id === id) || mockClients[0];
  
  // State for CRUD operations
  const [passwords, setPasswords] = useState<PasswordAccess[]>([
    { id: '1', platform: 'Google Ads', login: 'ads@exemplo.com', status: 'active', notes: 'Acesso completo' },
    { id: '2', platform: 'Meta Business', login: 'Business Manager compartilhado', status: 'active', notes: 'Administrador' },
    { id: '3', platform: 'Google Analytics', login: 'Acesso via GTM', status: 'active', notes: 'Visualização' },
  ]);

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    { id: '1', name: originalClient.primaryContact.name, position: 'Diretor de Marketing', type: 'decisor', contact: originalClient.primaryContact.email },
    { id: '2', name: originalClient.financialContact.name, position: 'Gerente Financeiro', type: 'aprovador', contact: originalClient.financialContact.email },
    { id: '3', name: 'Roberto Oliveira', position: 'Assistente de Marketing', type: 'operacional', contact: 'roberto.oliveira@exemplo.com' },
    { id: '4', name: 'Ana Santos', position: 'Coordenadora de Comunicação', type: 'influenciador', contact: 'ana.santos@exemplo.com' },
  ]);

  const [pageLinks, setPageLinks] = useState<PageLink[]>([
    { id: '1', name: 'Black Friday 2024', url: 'blackfriday.exemplo.com', type: 'landing', status: 'active' },
    { id: '2', name: 'Site Principal', url: originalClient.website || 'www.exemplo.com', type: 'site', status: 'active' },
    { id: '3', name: 'Blog', url: 'blog.exemplo.com', type: 'blog', status: 'active' },
    { id: '4', name: 'Loja Online', url: 'loja.exemplo.com', type: 'loja', status: 'development' },
  ]);

  const [mediaCampaigns, setMediaCampaigns] = useState<MediaCampaign[]>([
    { id: '1', name: 'Black Friday - Awareness', platform: 'Meta Ads', status: 'active', investment: 'R$ 15.000', result: 'ROAS: 4.2x' },
    { id: '2', name: 'Black Friday - Conversão', platform: 'Google Ads', status: 'active', investment: 'R$ 25.000', result: 'ROAS: 5.8x' },
    { id: '3', name: 'Rebranding - Awareness', platform: 'LinkedIn Ads', status: 'completed', investment: 'R$ 8.000', result: 'ROAS: 3.1x' },
  ]);

  // Modal states
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; item?: PasswordAccess }>({ open: false });
  const [stakeholderModal, setStakeholderModal] = useState<{ open: boolean; item?: Stakeholder }>({ open: false });
  const [pageLinkModal, setPageLinkModal] = useState<{ open: boolean; item?: PageLink }>({ open: false });
  const [mediaCampaignModal, setMediaCampaignModal] = useState<{ open: boolean; item?: MediaCampaign }>({ open: false });

  // Form states
  const [passwordForm, setPasswordForm] = useState<Partial<PasswordAccess>>({});
  const [stakeholderForm, setStakeholderForm] = useState<Partial<Stakeholder>>({});
  const [pageLinkForm, setPageLinkForm] = useState<Partial<PageLink>>({});
  const [mediaCampaignForm, setMediaCampaignForm] = useState<Partial<MediaCampaign>>({});

  // Editable client data state
  const [editableClient, setEditableClient] = useState({
    ...originalClient,
    cover: originalClient.cover || '',
    logo: originalClient.logo || '🏢',
    socialMedia: {
      facebook: originalClient.socialMedia?.facebook || '',
      instagram: originalClient.socialMedia?.instagram || '',
      linkedin: originalClient.socialMedia?.linkedin || ''
    }
  });

  // CRUD Functions for Passwords
  const handlePasswordSave = () => {
    if (passwordForm.id) {
      setPasswords(prev => prev.map(p => p.id === passwordForm.id ? { ...p, ...passwordForm } : p));
    } else {
      setPasswords(prev => [...prev, { ...passwordForm, id: Date.now().toString() } as PasswordAccess]);
    }
    setPasswordModal({ open: false });
    setPasswordForm({});
  };

  const handlePasswordDelete = (id: string) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
  };

  // CRUD Functions for Stakeholders
  const handleStakeholderSave = () => {
    if (stakeholderForm.id) {
      setStakeholders(prev => prev.map(s => s.id === stakeholderForm.id ? { ...s, ...stakeholderForm } : s));
    } else {
      setStakeholders(prev => [...prev, { ...stakeholderForm, id: Date.now().toString() } as Stakeholder]);
    }
    setStakeholderModal({ open: false });
    setStakeholderForm({});
  };

  const handleStakeholderDelete = (id: string) => {
    setStakeholders(prev => prev.filter(s => s.id !== id));
  };

  // CRUD Functions for Page Links
  const handlePageLinkSave = () => {
    if (pageLinkForm.id) {
      setPageLinks(prev => prev.map(p => p.id === pageLinkForm.id ? { ...p, ...pageLinkForm } : p));
    } else {
      setPageLinks(prev => [...prev, { ...pageLinkForm, id: Date.now().toString() } as PageLink]);
    }
    setPageLinkModal({ open: false });
    setPageLinkForm({});
  };

  const handlePageLinkDelete = (id: string) => {
    setPageLinks(prev => prev.filter(p => p.id !== id));
  };

  // CRUD Functions for Media Campaigns
  const handleMediaCampaignSave = () => {
    if (mediaCampaignForm.id) {
      setMediaCampaigns(prev => prev.map(m => m.id === mediaCampaignForm.id ? { ...m, ...mediaCampaignForm } : m));
    } else {
      setMediaCampaigns(prev => [...prev, { ...mediaCampaignForm, id: Date.now().toString() } as MediaCampaign]);
    }
    setMediaCampaignModal({ open: false });
    setMediaCampaignForm({});
  };

  const handleMediaCampaignDelete = (id: string) => {
    setMediaCampaigns(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving client data:', editableClient);
    setIsEditing(false);
    // Here you would typically update the mock data or make an API call
  };

  const handleCancel = () => {
    setEditableClient({
      ...originalClient,
      cover: originalClient.cover || '',
      logo: originalClient.logo || '🏢',
      socialMedia: {
        facebook: originalClient.socialMedia?.facebook || '',
        instagram: originalClient.socialMedia?.instagram || '',
        linkedin: originalClient.socialMedia?.linkedin || ''
      }
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditableClient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (contactType: 'primaryContact' | 'financialContact', field: string, value: string) => {
    setEditableClient(prev => ({
      ...prev,
      [contactType]: {
        ...prev[contactType],
        [field]: value
      }
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setEditableClient(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleFileUpload = (field: 'logo' | 'cover', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditableClient(prev => ({
          ...prev,
          [field]: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const client = isEditing ? editableClient : originalClient;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-red-100 text-red-700';
      case 'onboarding':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'MEI':
        return 'Microempreendedor Individual';
      case 'PME':
        return 'Pequena e Média Empresa';
      case 'large':
        return 'Grande Porte';
      default:
        return size;
    }
  };

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot':
        return 'text-red-500 bg-red-50';
      case 'warm':
        return 'text-yellow-500 bg-yellow-50';
      case 'cold':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'hot':
        return '🔥';
      case 'warm':
        return '🌡️';
      case 'cold':
        return '❄️';
      default:
        return '🌡️';
    }
  };

  const getStakeholderTypeColor = (type: string) => {
    switch (type) {
      case 'decisor':
        return 'bg-purple-100 text-purple-700';
      case 'aprovador':
        return 'bg-gray-100 text-gray-700';
      case 'operacional':
        return 'bg-blue-100 text-blue-700';
      case 'influenciador':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStakeholderTypeLabel = (type: string) => {
    switch (type) {
      case 'decisor':
        return 'Decisor';
      case 'aprovador':
        return 'Aprovador';
      case 'operacional':
        return 'Operacional';
      case 'influenciador':
        return 'Influenciador';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-t-lg relative overflow-hidden">
            {client.cover && (
              <img 
                src={client.cover} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <label className="cursor-pointer bg-white/90 hover:bg-white rounded-lg p-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">Alterar Capa</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('cover', e)}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
          
          <div className="p-6 -mt-16 relative">
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl border-4 border-white shadow-lg overflow-hidden">
                  {typeof client.logo === 'string' && client.logo.startsWith('data:') ? (
                    <img src={client.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    client.logo || '🏢'
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('logo', e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={client.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="text-3xl font-bold h-12"
                          placeholder="Nome da empresa"
                        />
                        <Input
                          value={client.segment}
                          onChange={(e) => handleInputChange('segment', e.target.value)}
                          className="text-lg"
                          placeholder="Segmento"
                        />
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                        <p className="text-lg text-gray-600">{client.segment}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    )}
                    
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Select value={client.status} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={client.size} onValueChange={(value) => handleInputChange('size', value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MEI">MEI</SelectItem>
                            <SelectItem value="PME">PME</SelectItem>
                            <SelectItem value="large">Grande Porte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Onboarding'}
                        </Badge>
                        <Badge variant="outline">{getSizeLabel(client.size)}</Badge>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={client.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="h-8"
                        placeholder="Endereço"
                      />
                    ) : (
                      <span>{client.address}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        type="date"
                        value={client.entryDate}
                        onChange={(e) => handleInputChange('entryDate', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      <span>Cliente desde {new Date(client.entryDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={client.responsibleManager}
                        onChange={(e) => handleInputChange('responsibleManager', e.target.value)}
                        className="h-8"
                        placeholder="Gestor responsável"
                      />
                    ) : (
                      <span>Gestor: {client.responsibleManager}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={client.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="Website"
                        className="h-8"
                      />
                      <Input
                        value={client.socialMedia.linkedin || ''}
                        onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                        placeholder="LinkedIn"
                        className="h-8"
                      />
                      <Input
                        value={client.socialMedia.instagram || ''}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        placeholder="Instagram"
                        className="h-8"
                      />
                      <Input
                        value={client.socialMedia.facebook || ''}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        placeholder="Facebook"
                        className="h-8"
                      />
                    </div>
                  ) : (
                    <>
                      {client.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={client.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {client.socialMedia.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={client.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {client.socialMedia.instagram && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={client.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {client.socialMedia.facebook && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={client.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">Informações Gerais</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="relationship">Relacionamento</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="pages">Páginas & Links</TabsTrigger>
        </TabsList>

        {/* Informações Gerais */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Contato Principal</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={client.primaryContact.name}
                        onChange={(e) => handleContactChange('primaryContact', 'name', e.target.value)}
                        placeholder="Nome"
                      />
                      <Input
                        value={client.primaryContact.phone}
                        onChange={(e) => handleContactChange('primaryContact', 'phone', e.target.value)}
                        placeholder="Telefone"
                      />
                      <Input
                        value={client.primaryContact.email}
                        onChange={(e) => handleContactChange('primaryContact', 'email', e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-medium">{client.primaryContact.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{client.primaryContact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{client.primaryContact.email}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Contato Financeiro</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={client.financialContact.name}
                        onChange={(e) => handleContactChange('financialContact', 'name', e.target.value)}
                        placeholder="Nome"
                      />
                      <Input
                        value={client.financialContact.phone}
                        onChange={(e) => handleContactChange('financialContact', 'phone', e.target.value)}
                        placeholder="Telefone"
                      />
                      <Input
                        value={client.financialContact.email}
                        onChange={(e) => handleContactChange('financialContact', 'email', e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-medium">{client.financialContact.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{client.financialContact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{client.financialContact.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Segmento:</span>
                  {isEditing ? (
                    <Input
                      value={client.segment}
                      onChange={(e) => handleInputChange('segment', e.target.value)}
                      className="h-8 w-48"
                    />
                  ) : (
                    <span className="font-medium">{client.segment}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Porte:</span>
                  {isEditing ? (
                    <Select value={client.size} onValueChange={(value) => handleInputChange('size', value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEI">MEI</SelectItem>
                        <SelectItem value="PME">PME</SelectItem>
                        <SelectItem value="large">Grande Porte</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="font-medium">{getSizeLabel(client.size)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Endereço:</span>
                  {isEditing ? (
                    <Textarea
                      value={client.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-48 h-20"
                    />
                  ) : (
                    <span className="font-medium text-right">{client.address}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Data de Entrada:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={client.entryDate}
                      onChange={(e) => handleInputChange('entryDate', e.target.value)}
                      className="h-8 w-48"
                    />
                  ) : (
                    <span className="font-medium">{new Date(client.entryDate).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Senhas e Acessos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Senhas e Acessos
                </div>
                <Dialog 
                  open={passwordModal.open} 
                  onOpenChange={(open) => setPasswordModal({ open, item: open ? passwordModal.item : undefined })}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setPasswordForm({})}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {passwordForm.id ? 'Editar' : 'Adicionar'} Senha/Acesso
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="platform">Plataforma</Label>
                        <Input
                          id="platform"
                          value={passwordForm.platform || ''}
                          onChange={(e) => setPasswordForm({...passwordForm, platform: e.target.value})}
                          placeholder="Ex: Google Ads"
                        />
                      </div>
                      <div>
                        <Label htmlFor="login">Login</Label>
                        <Input
                          id="login"
                          value={passwordForm.login || ''}
                          onChange={(e) => setPasswordForm({...passwordForm, login: e.target.value})}
                          placeholder="Ex: usuario@empresa.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={passwordForm.status} onValueChange={(value) => setPasswordForm({...passwordForm, status: value as 'active' | 'inactive'})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                          id="notes"
                          value={passwordForm.notes || ''}
                          onChange={(e) => setPasswordForm({...passwordForm, notes: e.target.value})}
                          placeholder="Observações sobre o acesso"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handlePasswordSave} className="flex-1">
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setPasswordModal({ open: false })} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passwords.map((password) => (
                    <TableRow key={password.id}>
                      <TableCell>{password.platform}</TableCell>
                      <TableCell>{password.login}</TableCell>
                      <TableCell>
                        <Badge variant={password.status === 'active' ? 'secondary' : 'outline'}>
                          {password.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{password.notes}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPasswordForm(password);
                              setPasswordModal({ open: true, item: password });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este acesso? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handlePasswordDelete(password.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  placeholder="Adicione observações sobre o cliente..."
                  className="min-h-[100px]"
                  defaultValue="• Cliente prefere reuniões às sextas-feiras&#10;• Evitar campanhas em dezembro devido ao fechamento&#10;• Aprovações podem levar até 48h&#10;• Gosta de relatórios detalhados com métricas específicas&#10;• Disponibilidade limitada entre 12h-14h"
                />
              ) : (
                <div className="space-y-2 text-sm">
                  <p>• Cliente prefere reuniões às sextas-feiras</p>
                  <p>• Evitar campanhas em dezembro devido ao fechamento</p>
                  <p>• Aprovações podem levar até 48h</p>
                  <p>• Gosta de relatórios detalhados com métricas específicas</p>
                  <p>• Disponibilidade limitada entre 12h-14h</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stakeholders */}
        <TabsContent value="stakeholders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Stakeholders do Cliente
                </div>
                <Dialog 
                  open={stakeholderModal.open} 
                  onOpenChange={(open) => setStakeholderModal({ open, item: open ? stakeholderModal.item : undefined })}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setStakeholderForm({})}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {stakeholderForm.id ? 'Editar' : 'Adicionar'} Stakeholder
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={stakeholderForm.name || ''}
                          onChange={(e) => setStakeholderForm({...stakeholderForm, name: e.target.value})}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Cargo</Label>
                        <Input
                          id="position"
                          value={stakeholderForm.position || ''}
                          onChange={(e) => setStakeholderForm({...stakeholderForm, position: e.target.value})}
                          placeholder="Ex: Diretor de Marketing"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={stakeholderForm.type} onValueChange={(value) => setStakeholderForm({...stakeholderForm, type: value as 'decisor' | 'aprovador' | 'operacional' | 'influenciador'})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="decisor">Decisor</SelectItem>
                            <SelectItem value="aprovador">Aprovador</SelectItem>
                            <SelectItem value="operacional">Operacional</SelectItem>
                            <SelectItem value="influenciador">Influenciador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contact">Contato</Label>
                        <Input
                          id="contact"
                          value={stakeholderForm.contact || ''}
                          onChange={(e) => setStakeholderForm({...stakeholderForm, contact: e.target.value})}
                          placeholder="Email ou telefone"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleStakeholderSave} className="flex-1">
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setStakeholderModal({ open: false })} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakeholders.map((stakeholder) => (
                    <TableRow key={stakeholder.id}>
                      <TableCell className="font-medium">{stakeholder.name}</TableCell>
                      <TableCell>{stakeholder.position}</TableCell>
                      <TableCell>
                        <Badge className={getStakeholderTypeColor(stakeholder.type)}>
                          {getStakeholderTypeLabel(stakeholder.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{stakeholder.contact}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setStakeholderForm(stakeholder);
                              setStakeholderModal({ open: true, item: stakeholder });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este stakeholder? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleStakeholderDelete(stakeholder.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projetos */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projetos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Campanha Black Friday 2024</h4>
                      <Badge className="bg-green-100 text-green-700">Em Andamento</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Campanha completa para Black Friday com landing page e criativos</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Responsável: Lucas Pereira</span>
                      <span>Progresso: 65%</span>
                    </div>
                  </div>
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Renovação Website</h4>
                      <Badge className="bg-blue-100 text-blue-700">Planejamento</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Redesign completo do site institucional</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Responsável: Fernanda Silva</span>
                      <span>Progresso: 20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projetos Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Rebranding Completo</h4>
                      <Badge variant="outline">Concluído</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Renovação da identidade visual e materiais</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Concluído em: 15/09/2024</span>
                      <span>⭐ Avaliação: 5/5</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Campanha Dia das Mães</h4>
                      <Badge variant="outline">Concluído</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Campanha sazonal com excelentes resultados</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Concluído em: 30/05/2024</span>
                      <span>⭐ Avaliação: 4/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Relacionamento */}
        <TabsContent value="relationship" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Temperatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {isEditing ? (
                    <Select value={client.temperature} onValueChange={(value) => handleInputChange('temperature', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hot">🔥 Quente</SelectItem>
                        <SelectItem value="warm">🌡️ Morno</SelectItem>
                        <SelectItem value="cold">❄️ Frio</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getTemperatureColor(client.temperature)}`}>
                      <span className="text-2xl">{getTemperatureIcon(client.temperature)}</span>
                      <span className="font-medium">
                        {client.temperature === 'hot' ? 'Quente' : client.temperature === 'warm' ? 'Morno' : 'Frio'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-2">Última atualização: 15/11/2024</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  NPS Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={client.nps}
                      onChange={(e) => handleInputChange('nps', e.target.value)}
                      className="text-center text-3xl font-bold"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-green-600 mb-2">{client.nps}/10</div>
                  )}
                  <p className="text-sm text-gray-600">Última coleta: 15/10/2024</p>
                  <Badge className="mt-2 bg-green-100 text-green-700">Promotor</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Tipo de Contrato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  {isEditing ? (
                    <Select value={client.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recurring">Recorrente</SelectItem>
                        <SelectItem value="project">Projeto</SelectItem>
                        <SelectItem value="one-time">Pontual</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {client.contractType === 'recurring' ? 'Recorrente' : client.contractType === 'project' ? 'Projeto' : 'Pontual'}
                    </Badge>
                  )}
                  <p className="text-sm text-gray-600 mt-2">Renovação: Jan/2025</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de NPS</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Comentário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>15/10/2024</TableCell>
                      <TableCell><span className="font-bold text-green-600">9/10</span></TableCell>
                      <TableCell>Maria Costa</TableCell>
                      <TableCell>Excelente atendimento</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>15/07/2024</TableCell>
                      <TableCell><span className="font-bold text-green-600">8/10</span></TableCell>
                      <TableCell>Maria Costa</TableCell>
                      <TableCell>Bons resultados</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>15/04/2024</TableCell>
                      <TableCell><span className="font-bold text-yellow-600">7/10</span></TableCell>
                      <TableCell>Maria Costa</TableCell>
                      <TableCell>Melhorou comunicação</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datas Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Renovação de Contrato</TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell><Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Reunião Mensal</TableCell>
                      <TableCell>22/11/2024</TableCell>
                      <TableCell><Badge className="bg-blue-100 text-blue-700">Agendada</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Entrega Black Friday</TableCell>
                      <TableCell>25/11/2024</TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-700">No prazo</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                SLA/Escopo Contratado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">✅ 3 posts por semana nas redes sociais</p>
                <p className="text-sm">✅ 2 stories diários no Instagram</p>
                <p className="text-sm">✅ Relatório mensal de performance</p>
                <p className="text-sm">✅ Reunião quinzenal de alinhamento</p>
                <p className="text-sm">✅ Suporte técnico em horário comercial</p>
                <Button variant="outline" size="sm" className="mt-3">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver contrato completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipe */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipe da Agência</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.responsibleManager}</p>
                    <p className="text-sm text-gray-600">Gestor de Conta</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>maria.costa@agencia.com</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback><PenTool className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Lucas Pereira</p>
                    <p className="text-sm text-gray-600">Designer Criativo</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>lucas.pereira@agencia.com</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback><BarChart3 className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Fernanda Silva</p>
                    <p className="text-sm text-gray-600">Analista de Performance</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>fernanda.silva@agencia.com</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback><Video className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Carlos Santos</p>
                    <p className="text-sm text-gray-600">Editor de Vídeo</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>carlos.santos@agencia.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Histórico de Reuniões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Resumo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>15/11/2024</TableCell>
                      <TableCell>Alinhamento</TableCell>
                      <TableCell>Discussão sobre nova campanha</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>08/11/2024</TableCell>
                      <TableCell>Aprovação</TableCell>
                      <TableCell>Aprovação materiais Black Friday</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>01/11/2024</TableCell>
                      <TableCell>Planejamento</TableCell>
                      <TableCell>Estratégia fim de ano</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Alertas Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Reunião agendada para amanhã</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Relatório mensal pendente</span>
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Prazo de entrega em 3 dias</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tarefas Críticas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Prioridade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Finalizar criativos Black Friday</TableCell>
                    <TableCell>Lucas Pereira</TableCell>
                    <TableCell>20/11/2024</TableCell>
                    <TableCell><Badge className="bg-red-100 text-red-700">Alta</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Relatório de performance outubro</TableCell>
                    <TableCell>Fernanda Silva</TableCell>
                    <TableCell>18/11/2024</TableCell>
                    <TableCell><Badge className="bg-yellow-100 text-yellow-700">Média</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Aprovação de budget Q1 2025</TableCell>
                    <TableCell>Maria Costa</TableCell>
                    <TableCell>25/11/2024</TableCell>
                    <TableCell><Badge className="bg-red-100 text-red-700">Alta</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimos Feedbacks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-sm text-gray-600">15/10/2024</span>
                    </div>
                    <span className="text-sm text-gray-500">{client.primaryContact.name}</span>
                  </div>
                  <p className="text-sm">"Excelente trabalho na campanha! Os resultados superaram nossas expectativas."</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(4)}
                      </div>
                      <span className="text-sm text-gray-600">01/10/2024</span>
                    </div>
                    <span className="text-sm text-gray-500">{client.financialContact.name}</span>
                  </div>
                  <p className="text-sm">"Comunicação melhorou muito. Gostamos dos relatórios detalhados."</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Páginas & Links */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Páginas e Links
                </div>
                <Dialog 
                  open={pageLinkModal.open} 
                  onOpenChange={(open) => setPageLinkModal({ open, item: open ? pageLinkModal.item : undefined })}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setPageLinkForm({})}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {pageLinkForm.id ? 'Editar' : 'Adicionar'} Página/Link
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="page-name">Nome</Label>
                        <Input
                          id="page-name"
                          value={pageLinkForm.name || ''}
                          onChange={(e) => setPageLinkForm({...pageLinkForm, name: e.target.value})}
                          placeholder="Ex: Landing Page Black Friday"
                        />
                      </div>
                      <div>
                        <Label htmlFor="page-url">URL</Label>
                        <Input
                          id="page-url"
                          value={pageLinkForm.url || ''}
                          onChange={(e) => setPageLinkForm({...pageLinkForm, url: e.target.value})}
                          placeholder="Ex: https://exemplo.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="page-type">Tipo</Label>
                        <Select value={pageLinkForm.type} onValueChange={(value) => setPageLinkForm({...pageLinkForm, type: value as 'landing' | 'site' | 'blog' | 'loja'})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="landing">Landing Page</SelectItem>
                            <SelectItem value="site">Site</SelectItem>
                            <SelectItem value="blog">Blog</SelectItem>
                            <SelectItem value="loja">Loja</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="page-status">Status</Label>
                        <Select value={pageLinkForm.status} onValueChange={(value) => setPageLinkForm({...pageLinkForm, status: value as 'active' | 'inactive' | 'development'})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                            <SelectItem value="development">Em desenvolvimento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handlePageLinkSave} className="flex-1">
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setPageLinkModal({ open: false })} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageLinks.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>{page.name}</TableCell>
                      <TableCell className="text-blue-600">{page.url}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {page.type === 'landing' ? 'Landing Page' : 
                           page.type === 'site' ? 'Site' :
                           page.type === 'blog' ? 'Blog' : 'Loja'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            page.status === 'active' ? 'bg-green-100 text-green-700' :
                            page.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                          }
                        >
                          {page.status === 'active' ? 'Ativo' : 
                           page.status === 'inactive' ? 'Inativo' : 'Em desenvolvimento'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={page.url.startsWith('http') ? page.url : `https://${page.url}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPageLinkForm(page);
                              setPageLinkModal({ open: true, item: page });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta página/link? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handlePageLinkDelete(page.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Campanhas de Mídia
                </div>
                <Dialog 
                  open={mediaCampaignModal.open} 
                  onOpenChange={(open) => setMediaCampaignModal({ open, item: open ? mediaCampaignModal.item : undefined })}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setMediaCampaignForm({})}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {mediaCampaignForm.id ? 'Editar' : 'Adicionar'} Campanha de Mídia
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="campaign-name">Nome da Campanha</Label>
                        <Input
                          id="campaign-name"
                          value={mediaCampaignForm.name || ''}
                          onChange={(e) => setMediaCampaignForm({...mediaCampaignForm, name: e.target.value})}
                          placeholder="Ex: Black Friday - Awareness"
                        />
                      </div>
                      <div>
                        <Label htmlFor="campaign-platform">Plataforma</Label>
                        <Input
                          id="campaign-platform"
                          value={mediaCampaignForm.platform || ''}
                          onChange={(e) => setMediaCampaignForm({...mediaCampaignForm, platform: e.target.value})}
                          placeholder="Ex: Meta Ads, Google Ads"
                        />
                      </div>
                      <div>
                        <Label htmlFor="campaign-status">Status</Label>
                        <Select value={mediaCampaignForm.status} onValueChange={(value) => setMediaCampaignForm({...mediaCampaignForm, status: value as 'active' | 'inactive' | 'completed'})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                            <SelectItem value="completed">Finalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="campaign-investment">Investimento</Label>
                        <Input
                          id="campaign-investment"
                          value={mediaCampaignForm.investment || ''}
                          onChange={(e) => setMediaCampaignForm({...mediaCampaignForm, investment: e.target.value})}
                          placeholder="Ex: R$ 15.000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="campaign-result">Resultado</Label>
                        <Input
                          id="campaign-result"
                          value={mediaCampaignForm.result || ''}
                          onChange={(e) => setMediaCampaignForm({...mediaCampaignForm, result: e.target.value})}
                          placeholder="Ex: ROAS: 4.2x"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleMediaCampaignSave} className="flex-1">
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setMediaCampaignModal({ open: false })} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Investimento</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.platform}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                            campaign.status === 'inactive' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }
                        >
                          {campaign.status === 'active' ? 'Ativo' : 
                           campaign.status === 'inactive' ? 'Inativo' : 'Finalizado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.investment}</TableCell>
                      <TableCell>{campaign.result}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setMediaCampaignForm(campaign);
                              setMediaCampaignModal({ open: true, item: campaign });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleMediaCampaignDelete(campaign.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
  );
};

export default ClientProfile;
