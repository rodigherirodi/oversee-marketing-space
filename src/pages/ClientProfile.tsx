
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  MapPin, 
  Globe, 
  Calendar, 
  Users, 
  Star,
  Edit,
  Upload
} from 'lucide-react';
import { useSupabaseClients, ClientFormData } from '@/hooks/useSupabaseClients';
import { useClientLogo } from '@/hooks/useClientLogo';
import { transformSupabaseClientToClient } from '@/utils/clientTransforms';
import ClientEditDialog from '@/components/ClientEditDialog';
import { ClientContactsSection } from '@/components/ClientContactsSection';
import { ClientMeetingsSection } from '@/components/ClientMeetingsSection';
import { ClientNotesSection } from '@/components/ClientNotesSection';

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { getClient, updateClient } = useSupabaseClients();
  const { uploadLogo, isUploading } = useClientLogo();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchClient = async () => {
    if (!id) return;
    
    setLoading(true);
    const clientData = await getClient(id);
    if (clientData) {
      setClient(clientData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !client?.id) return;

    const logoUrl = await uploadLogo(file, client.id);
    if (logoUrl) {
      await updateClient(client.id, { logo_url: logoUrl });
      fetchClient();
    }
  };

  const handleSaveClient = async (updatedClient: any) => {
    if (!client?.id) return;
    
    // Convert Client interface back to Supabase format with proper typing
    const supabaseData: Partial<ClientFormData> = {
      nome: updatedClient.name,
      segmento: updatedClient.segment,
      descricao: updatedClient.description,
      porte: updatedClient.size === 'MEI' ? 'micro' : 
             updatedClient.size === 'PME' ? 'pequeno' : 
             updatedClient.size === 'large' ? 'grande' : 'medio',
      status: updatedClient.status === 'active' ? 'ativo' : 
              updatedClient.status === 'inactive' ? 'inativo' : 'prospect',
      temperatura: updatedClient.temperature === 'cold' ? 'frio' : 
                   updatedClient.temperature === 'warm' ? 'morno' : 'quente',
      tipo_contrato: updatedClient.contractType === 'recurring' ? 'recorrente' : 
                     updatedClient.contractType === 'project' ? 'projeto_unico' : 'pontual',
      gestor_id: updatedClient.responsibleManager,
      cliente_desde: updatedClient.entryDate,
      nps_atual: updatedClient.nps,
      endereco: updatedClient.address,
      site: updatedClient.website,
      redes_sociais: updatedClient.socialMedia,
    };

    await updateClient(client.id, supabaseData);
    fetchClient();
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!client) {
    return <div className="p-6">Cliente não encontrado</div>;
  }

  const transformedClient = transformSupabaseClientToClient(client);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'quente': return 'bg-red-100 text-red-800';
      case 'morno': return 'bg-yellow-100 text-yellow-800';
      case 'frio': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={client.logo_url} alt={client.nome} />
                  <AvatarFallback className="text-xl">
                    {client.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90">
                  <Upload className="w-3 h-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{client.nome}</h1>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(client.status)}>
                    {client.status === 'ativo' ? 'Ativo' : 
                     client.status === 'inativo' ? 'Inativo' : 'Prospect'}
                  </Badge>
                  {client.temperatura && (
                    <Badge className={getTemperatureColor(client.temperatura)}>
                      {client.temperatura === 'quente' ? 'Quente' : 
                       client.temperatura === 'morno' ? 'Morno' : 'Frio'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.descricao && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Sobre o cliente</h4>
                  <p className="text-sm leading-relaxed">{client.descricao}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{client.segmento || 'Segmento não informado'}</span>
              </div>
              
              {client.endereco && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{client.endereco}</span>
                </div>
              )}
              
              {client.site && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={client.site} target="_blank" rel="noopener noreferrer" 
                     className="text-sm text-blue-600 hover:underline">
                    {client.site}
                  </a>
                </div>
              )}
              
              {client.cliente_desde && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Cliente desde {new Date(client.cliente_desde).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              
              {client.nps_atual && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">NPS: {client.nps_atual}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="contacts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contacts">Contatos</TabsTrigger>
              <TabsTrigger value="meetings">Reuniões</TabsTrigger>
              <TabsTrigger value="notes">Anotações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contacts">
              <ClientContactsSection clientId={client.id} />
            </TabsContent>
            
            <TabsContent value="meetings">
              <ClientMeetingsSection clientId={client.id} />
            </TabsContent>
            
            <TabsContent value="notes">
              <ClientNotesSection clientId={client.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Dialog */}
      <ClientEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={transformedClient}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default ClientProfile;
