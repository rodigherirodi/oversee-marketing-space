import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useProjects } from '@/hooks/useProjects';
import { useStakeholders } from '@/hooks/useStakeholders';
import { useSupabaseClientAccesses } from '@/hooks/useSupabaseClientAccesses';
import { useClientLogo } from '@/hooks/useClientLogo';
import PersonalInfoSection from '@/components/PersonalInfoSection';
import { ClientNotesSection } from '@/components/ClientNotesSection';
import { ClientContactsSection } from '@/components/ClientContactsSection';
import { ClientMeetingsSection } from '@/components/ClientMeetingsSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Calendar, 
  ExternalLink, 
  Mail, 
  MapPin, 
  MoreHorizontal,
  Plus,
  Phone, 
  Users,
  Key,
  Eye,
  EyeOff,
  Upload,
  Facebook,
  Instagram,
  Linkedin,
  Save,
  Edit
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageLinkDialog from '@/components/PageLinkDialog';
import { usePageLinks } from '@/hooks/usePageLinks';
import TeamMemberSelector from '@/components/TeamMemberSelector';
import NPSHistorySection from '@/components/NPSHistorySection';
import ImportantDatesSection from '@/components/ImportantDatesSection';
import SLASection from '@/components/SLASection';
import ClientEditDialog from '@/components/ClientEditDialog';
import StakeholderDialog from '@/components/StakeholderDialog';
import AccessDialog from '@/components/AccessDialog';
import { Client } from '@/types/entities';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, updateClient, loading: clientsLoading } = useSupabaseClients();
  const { projects } = useProjects();
  const { stakeholders, addStakeholder, updateStakeholder, deleteStakeholder } = useStakeholders(id || '');
  const { accesses, addAccess, updateAccess, deleteAccess } = useSupabaseClientAccesses(id || '');
  const { uploadLogo, isUploading } = useClientLogo();
  
  const [isClientEditDialogOpen, setIsClientEditDialogOpen] = useState(false);
  const [isStakeholderDialogOpen, setIsStakeholderDialogOpen] = useState(false);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [currentStakeholder, setCurrentStakeholder] = useState<any | null>(null);
  const [currentAccess, setCurrentAccess] = useState<any | null>(null);
  const [isPageLinkDialogOpen, setIsPageLinkDialogOpen] = useState(false);
  const [currentPageLink, setCurrentPageLink] = useState<any | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [isEditingSocialMedia, setIsEditingSocialMedia] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState({
    facebook: '',
    instagram: '',
    linkedin: ''
  });
  
  // Encontra o cliente usando os dados do Supabase
  const client = clients.find(c => c.id === id);
  const clientProjects = projects.filter(project => project.clientId === id);
  const { pageLinks, addPageLink, updatePageLink, deletePageLink } = usePageLinks(id || '');

  // Inicializa dados de redes sociais
  React.useEffect(() => {
    if (client?.redes_sociais) {
      setSocialMediaData({
        facebook: client.redes_sociais.facebook || '',
        instagram: client.redes_sociais.instagram || '',
        linkedin: client.redes_sociais.linkedin || ''
      });
    }
  }, [client]);

  // Loading state
  if (clientsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Carregando perfil do cliente...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Cliente não encontrado</h2>
          <p className="text-gray-600 mb-4">O cliente que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => navigate('/clients')}>
            Voltar para Clientes
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-700';
      case 'inativo':
        return 'bg-red-100 text-red-700';
      case 'prospect':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'micro':
        return 'Microempresa';
      case 'pequeno':
        return 'Pequena Empresa';
      case 'medio':
        return 'Média Empresa';
      case 'grande':
        return 'Grande Empresa';
      default:
        return size;
    }
  };

  const getPageTypeLabel = (type: string) => {
    switch (type) {
      case 'website':
        return 'Website';
      case 'landing':
        return 'Landing Page';
      case 'campaign':
        return 'Campanha';
      case 'social':
        return 'Mídia Social';
      default:
        return type;
    }
  };
  
  const getPageStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };
  
  const getPageStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-amber-100 text-amber-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return importance;
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !client) return;

    const logoUrl = await uploadLogo(file, client.id);
    if (logoUrl) {
      // Refresh the page to see the updated logo
      window.location.reload();
    }
  };

  const handleSaveSocialMedia = async () => {
    if (!client) return;
    
    const success = await updateClient(client.id, {
      redes_sociais: socialMediaData
    });
    
    if (success) {
      setIsEditingSocialMedia(false);
    }
  };

  const handleOpenStakeholderDialog = (stakeholder = null) => {
    setCurrentStakeholder(stakeholder);
    setIsStakeholderDialogOpen(true);
  };

  const handleSaveStakeholder = (data: any) => {
    if (currentStakeholder) {
      updateStakeholder(currentStakeholder.id, data);
    } else {
      addStakeholder(data);
    }
    setCurrentStakeholder(null);
  };

  const handleOpenAccessDialog = (access = null) => {
    setCurrentAccess(access);
    setIsAccessDialogOpen(true);
  };

  const handleSaveAccess = async (data: any) => {
    if (currentAccess) {
      await updateAccess(currentAccess.id, data);
    } else {
      await addAccess(data);
    }
    setCurrentAccess(null);
  };

  const handleOpenPageLinkDialog = (pageLink = null) => {
    setCurrentPageLink(pageLink);
    setIsPageLinkDialogOpen(true);
  };
  
  const handleSavePageLink = (data: any) => {
    if (currentPageLink) {
      updatePageLink(currentPageLink.id, data);
    } else {
      addPageLink(data);
    }
  };

  const handleNavigateToProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const togglePasswordVisibility = (accessId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [accessId]: !prev[accessId]
    }));
  };

  // Helper function to map Supabase status to Client interface status
  const mapSupabaseStatusToClientStatus = (supabaseStatus: string): 'active' | 'inactive' | 'onboarding' => {
    switch (supabaseStatus) {
      case 'ativo':
        return 'active';
      case 'inativo':
        return 'inactive';
      case 'prospect':
        return 'onboarding';
      default:
        return 'active';
    }
  };

  // Helper function to map Client status back to Supabase
  const mapClientStatusToSupabaseStatus = (clientStatus: string): 'ativo' | 'inativo' | 'prospect' => {
    switch (clientStatus) {
      case 'active':
        return 'ativo';
      case 'inactive':
        return 'inativo';
      case 'onboarding':
        return 'prospect';
      default:
        return 'ativo';
    }
  };

  // Helper function to map Supabase size to Client interface size
  const mapSupabaseSizeToClientSize = (supabaseSize: string): 'MEI' | 'PME' | 'large' => {
    switch (supabaseSize) {
      case 'micro':
        return 'MEI';
      case 'pequeno':
        return 'PME';
      case 'medio':
        return 'large';
      case 'grande':
        return 'large';
      default:
        return 'PME';
    }
  };

  // Helper function to map Client size back to Supabase
  const mapClientSizeToSupabaseSize = (clientSize: string): 'micro' | 'pequeno' | 'medio' | 'grande' => {
    switch (clientSize) {
      case 'MEI':
        return 'micro';
      case 'PME':
        return 'pequeno';
      case 'large':
        return 'grande';
      default:
        return 'pequeno';
    }
  };

  // Helper function to map Supabase temperature to Client interface temperature
  const mapSupabaseTemperatureToClientTemperature = (supabaseTemperature: string): 'cold' | 'warm' | 'hot' => {
    switch (supabaseTemperature) {
      case 'frio':
        return 'cold';
      case 'morno':
        return 'warm';
      case 'quente':
        return 'hot';
      default:
        return 'cold';
    }
  };

  // Helper function to map Client temperature back to Supabase
  const mapClientTemperatureToSupabaseTemperature = (clientTemperature: string): 'frio' | 'morno' | 'quente' => {
    switch (clientTemperature) {
      case 'cold':
        return 'frio';
      case 'warm':
        return 'morno';
      case 'hot':
        return 'quente';
      default:
        return 'frio';
    }
  };

  // Helper function to map Supabase contract type to Client interface contract type
  const mapSupabaseContractTypeToClientContractType = (supabaseContractType: string): 'recurring' | 'project' | 'one-time' => {
    switch (supabaseContractType) {
      case 'recorrente':
        return 'recurring';
      case 'projeto_unico':
        return 'project';
      case 'pontual':
        return 'one-time';
      default:
        return 'one-time';
    }
  };

  // Helper function to map Client contract type back to Supabase
  const mapClientContractTypeToSupabaseContractType = (clientContractType: string): 'recorrente' | 'pontual' | 'projeto_unico' => {
    switch (clientContractType) {
      case 'recurring':
        return 'recorrente';
      case 'project':
        return 'projeto_unico';
      case 'one-time':
        return 'pontual';
      default:
        return 'pontual';
    }
  };

  // Converte o cliente do Supabase para o formato esperado pelos componentes
  const clientForComponents: Client = {
    id: client.id,
    name: client.nome,
    segment: client.segmento || '',
    size: mapSupabaseSizeToClientSize(client.porte || 'pequeno'),
    status: mapSupabaseStatusToClientStatus(client.status),
    temperature: mapSupabaseTemperatureToClientTemperature(client.temperatura || 'frio'),
    contractType: mapSupabaseContractTypeToClientContractType(client.tipo_contrato || 'pontual'),
    entryDate: client.cliente_desde || client.criado_em,
    nps: client.nps_atual,
    address: client.endereco || '',
    website: client.site || '',
    logo: client.logo_url || '',
    responsibleManager: client.gestor_id || 'Não definido',
    primaryContact: {
      name: 'Contato Principal',
      phone: '(00) 00000-0000',
      email: 'contato@empresa.com'
    },
    financialContact: {
      name: 'Contato Financeiro',
      phone: '(00) 00000-0000',
      email: 'financeiro@empresa.com'
    },
    socialMedia: {
      facebook: client.redes_sociais?.facebook || '',
      instagram: client.redes_sociais?.instagram || '',
      linkedin: client.redes_sociais?.linkedin || ''
    },
    createdAt: client.criado_em
  };

  const handleClientUpdate = async (data: Client) => {
    // Map the client data back to Supabase format
    const supabaseData = {
      nome: data.name,
      segmento: data.segment,
      porte: mapClientSizeToSupabaseSize(data.size),
      status: mapClientStatusToSupabaseStatus(data.status),
      temperatura: mapClientTemperatureToSupabaseTemperature(data.temperature),
      tipo_contrato: mapClientContractTypeToSupabaseContractType(data.contractType),
      cliente_desde: data.entryDate,
      nps_atual: data.nps,
      endereco: data.address,
      site: data.website,
      redes_sociais: data.socialMedia
    };
    
    return await updateClient(client.id, supabaseData);
  };

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={client.logo_url || ''} />
              <AvatarFallback>{client.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <Button
                size="sm"
                variant="outline"
                className="rounded-full w-8 h-8 p-0"
                onClick={() => document.getElementById('logo-upload')?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{client.nome}</h1>
              <Badge className={getStatusColor(client.status)}>
                {client.status === 'ativo' ? 'Ativo' : 
                 client.status === 'inativo' ? 'Inativo' : 'Prospect'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Building className="w-4 h-4" />
              <span>{client.segmento || 'Segmento não informado'}</span>
              <span>•</span>
              <span>{getSizeLabel(client.porte || 'micro')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsClientEditDialogOpen(true)}>
            Editar Dados
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Arquivar Cliente</DropdownMenuItem>
              <DropdownMenuItem>Exportar Dados</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Excluir Cliente</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Client Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="pages">Páginas & Campanhas</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="relationship">Relacionamento</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Informações Principais</h2>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h2 className="text-xl font-semibold mb-4">Endereço</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span>{client.endereco || 'Endereço não informado'}</span>
                    </div>
                    
                    {client.site && (
                      <div className="flex items-start gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-500 mt-1" />
                        <a 
                          href={client.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {client.site}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Redes Sociais</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingSocialMedia(!isEditingSocialMedia)}
                    >
                      {isEditingSocialMedia ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  {isEditingSocialMedia ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            value={socialMediaData.facebook}
                            onChange={(e) => setSocialMediaData(prev => ({ ...prev, facebook: e.target.value }))}
                            placeholder="URL do Facebook"
                          />
                        </div>
                        <div>
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            value={socialMediaData.instagram}
                            onChange={(e) => setSocialMediaData(prev => ({ ...prev, instagram: e.target.value }))}
                            placeholder="URL do Instagram"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={socialMediaData.linkedin}
                            onChange={(e) => setSocialMediaData(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="URL do LinkedIn"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveSocialMedia}>Salvar</Button>
                        <Button variant="outline" onClick={() => setIsEditingSocialMedia(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      {socialMediaData.facebook && (
                        <a href={socialMediaData.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </a>
                      )}
                      {socialMediaData.instagram && (
                        <a href={socialMediaData.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-600 hover:underline">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </a>
                      )}
                      {socialMediaData.linkedin && (
                        <a href={socialMediaData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:underline">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                      {!socialMediaData.facebook && !socialMediaData.instagram && !socialMediaData.linkedin && (
                        <p className="text-muted-foreground">Nenhuma rede social configurada</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Detalhes do Contrato</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Tipo de Contrato</span>
                        <span className="font-medium">
                          {client.tipo_contrato === 'recorrente' ? 'Recorrente' : 
                          client.tipo_contrato === 'projeto_unico' ? 'Projeto Único' : 'Pontual'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Cliente Desde</span>
                        <span className="font-medium">
                          {client.cliente_desde ? new Date(client.cliente_desde).toLocaleDateString('pt-BR') : 'Não informado'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Temperatura</span>
                        <span className="font-medium">
                          {client.temperatura === 'quente' ? 'Quente' : 
                          client.temperatura === 'morno' ? 'Morno' : 'Frio'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">NPS Atual</span>
                        <span className="font-medium">{client.nps_atual || 'Não avaliado'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Acessos Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Acessos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plataforma</TableHead>
                      <TableHead>Usuário/Email</TableHead>
                      <TableHead>Senha</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accesses.map((access) => (
                      <TableRow key={access.id}>
                        <TableCell>{access.plataforma}</TableCell>
                        <TableCell>{access.usuario}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>
                              {visiblePasswords[access.id] ? access.senha : '••••••••••'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePasswordVisibility(access.id)}
                            >
                              {visiblePasswords[access.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{access.notas}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenAccessDialog(access)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteAccess(access.id)}
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleOpenAccessDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Acesso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <ClientContactsSection clientId={client.id} />
          <ClientMeetingsSection clientId={client.id} />
          <ClientNotesSection clientId={client.id} />
        </TabsContent>

        {/* Pages & Campaigns Tab */}
        <TabsContent value="pages" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Páginas e Campanhas</h2>
            <Button onClick={() => handleOpenPageLinkDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageLinks.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>{getPageTypeLabel(page.type)}</TableCell>
                      <TableCell>{page.dateRange}</TableCell>
                      <TableCell>
                        <Badge className={getPageStatusColor(page.status)}>
                          {getPageStatusLabel(page.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={page.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Link
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenPageLinkDialog(page)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deletePageLink(page.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {pageLinks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        Nenhuma página ou campanha encontrada para este cliente.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <PageLinkDialog
            open={isPageLinkDialogOpen}
            onOpenChange={setIsPageLinkDialogOpen}
            pageLink={currentPageLink}
            onSave={handleSavePageLink}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Projetos</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Projeto
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientProjects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleNavigateToProject(project.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge className={
                        project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'planning' ? 'bg-purple-100 text-purple-800' :
                        project.status === 'paused' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {project.status === 'completed' ? 'Concluído' :
                         project.status === 'in-progress' ? 'Em Progresso' :
                         project.status === 'planning' ? 'Planejamento' :
                         project.status === 'paused' ? 'Pausado' : 'Revisão'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <span>Progresso: {project.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {clientProjects.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 mb-4">Este cliente ainda não possui projetos.</p>
                <Button>Criar Primeiro Projeto</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="relationship" className="space-y-6">
          <h2 className="text-xl font-semibold mb-6">Relacionamento com o Cliente</h2>
          
          <div className="space-y-8">
            <NPSHistorySection clientId={client.id} />
            <ImportantDatesSection clientId={client.id} />
            <SLASection clientId={client.id} />
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <h2 className="text-xl font-semibold mb-6">Equipe do Cliente</h2>
          
          <TeamMemberSelector clientId={client.id} />
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Stakeholders</h2>
            <Button onClick={() => handleOpenStakeholderDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Stakeholder
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Importância</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stakeholders.map((stakeholder) => (
                      <TableRow key={stakeholder.id}>
                        <TableCell className="font-medium">{stakeholder.name}</TableCell>
                        <TableCell>{stakeholder.position}</TableCell>
                        <TableCell>{stakeholder.department}</TableCell>
                        <TableCell>{stakeholder.email}</TableCell>
                        <TableCell>{stakeholder.phone}</TableCell>
                        <TableCell>
                          <Badge className={getImportanceColor(stakeholder.importance)}>
                            {getImportanceLabel(stakeholder.importance)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenStakeholderDialog(stakeholder)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => deleteStakeholder(stakeholder.id)}
                              >
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {stakeholders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Nenhum stakeholder encontrado para este cliente.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ClientEditDialog
        open={isClientEditDialogOpen}
        onOpenChange={setIsClientEditDialogOpen}
        client={clientForComponents}
        onSave={handleClientUpdate}
      />

      <StakeholderDialog
        open={isStakeholderDialogOpen}
        onOpenChange={setIsStakeholderDialogOpen}
        stakeholder={currentStakeholder}
        clientId={client.id}
        onSave={handleSaveStakeholder}
      />

      <AccessDialog
        open={isAccessDialogOpen}
        onOpenChange={setIsAccessDialogOpen}
        access={currentAccess}
        onSave={handleSaveAccess}
      />
    </div>
  );
};

export default ClientProfile;
