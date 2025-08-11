
import React, { useState } from 'react';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import ClientFormDialog from '@/components/ClientFormDialog';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const navigate = useNavigate();
  const { clients, loading, addClient } = useSupabaseClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureColor = (temperature: string | null) => {
    switch (temperature) {
      case 'quente': return 'bg-red-100 text-red-800';
      case 'morno': return 'bg-orange-100 text-orange-800';
      case 'frio': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      case 'prospect': return 'Prospect';
      default: return status;
    }
  };

  const getTemperatureLabel = (temperature: string | null) => {
    switch (temperature) {
      case 'quente': return 'Quente';
      case 'morno': return 'Morno';
      case 'frio': return 'Frio';
      default: return 'N/A';
    }
  };

  const getPorteLabel = (porte: string | null) => {
    switch (porte) {
      case 'micro': return 'Micro';
      case 'pequeno': return 'Pequeno';
      case 'medio': return 'Médio';
      case 'grande': return 'Grande';
      default: return 'N/A';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (client.segmento && client.segmento.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesSize = sizeFilter === 'all' || client.porte === sizeFilter;
    
    return matchesSearch && matchesStatus && matchesSize;
  });

  const handleClientAdded = async (clientData: any) => {
    const newClient = await addClient({
      nome: clientData.name,
      segmento: clientData.segment,
      porte: clientData.size,
      status: clientData.status,
      temperatura: clientData.temperature,
      tipo_contrato: clientData.contractType,
      cliente_desde: clientData.entryDate,
      endereco: clientData.address,
      nps_atual: clientData.nps,
      tags: []
    });
    
    if (newClient) {
      setIsClientFormOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus clientes e acompanhe relacionamentos
          </p>
        </div>
        
        <Button onClick={() => setIsClientFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Porte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="micro">Micro</SelectItem>
              <SelectItem value="pequeno">Pequeno</SelectItem>
              <SelectItem value="medio">Médio</SelectItem>
              <SelectItem value="grande">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/clients/${client.id}`)}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={client.logo_url || undefined} alt={client.nome} />
                  <AvatarFallback>
                    <Building2 className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{client.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{client.segmento || 'Sem segmento'}</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap mt-3">
                <Badge className={getStatusColor(client.status)}>
                  {getStatusLabel(client.status)}
                </Badge>
                {client.temperatura && (
                  <Badge variant="outline" className={getTemperatureColor(client.temperatura)}>
                    {getTemperatureLabel(client.temperatura)}
                  </Badge>
                )}
                {client.porte && (
                  <Badge variant="secondary">
                    {getPorteLabel(client.porte)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                {client.cliente_desde && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cliente desde:</span>
                    <span>{new Date(client.cliente_desde).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                
                {client.nps_atual !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">NPS:</span>
                    <Badge variant={client.nps_atual >= 7 ? 'default' : client.nps_atual >= 4 ? 'secondary' : 'destructive'}>
                      {client.nps_atual}/10
                    </Badge>
                  </div>
                )}
                
                {client.tipo_contrato && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Contrato:</span>
                    <span className="capitalize">
                      {client.tipo_contrato === 'recorrente' && 'Recorrente'}
                      {client.tipo_contrato === 'pontual' && 'Pontual'}
                      {client.tipo_contrato === 'projeto_unico' && 'Projeto Único'}
                    </span>
                  </div>
                )}

                {client.cidade && client.uf && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Localização:</span>
                    <span>{client.cidade}, {client.uf}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            {clients.length === 0 
              ? "Adicione seu primeiro cliente para começar"
              : "Tente ajustar os filtros de busca"
            }
          </p>
          <Button onClick={() => setIsClientFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Cliente
          </Button>
        </div>
      )}

      {/* Client Form Dialog */}
      <ClientFormDialog
        open={isClientFormOpen}
        onOpenChange={setIsClientFormOpen}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
};

export default Clients;
