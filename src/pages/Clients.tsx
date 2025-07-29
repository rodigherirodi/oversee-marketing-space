
import React, { useState } from 'react';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ClientFormDialog from '@/components/ClientFormDialog';
import { useClients } from '@/hooks/useClients';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const navigate = useNavigate();
  const { clients, addClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'onboarding': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureColor = (temperature: string) => {
    switch (temperature) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-orange-100 text-orange-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.segment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesSize = sizeFilter === 'all' || client.size === sizeFilter;
    
    return matchesSearch && matchesStatus && matchesSize;
  });

  const handleClientAdded = (client: any) => {
    addClient(client);
    setIsClientFormOpen(false);
  };

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
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Porte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="MEI">MEI</SelectItem>
              <SelectItem value="PME">PME</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
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
                  <AvatarImage src={client.logo} alt={client.name} />
                  <AvatarFallback>
                    <Building2 className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{client.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{client.segment}</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap mt-3">
                <Badge className={getStatusColor(client.status)}>
                  {client.status === 'active' && 'Ativo'}
                  {client.status === 'inactive' && 'Inativo'}
                  {client.status === 'onboarding' && 'Onboarding'}
                </Badge>
                <Badge variant="outline" className={getTemperatureColor(client.temperature)}>
                  {client.temperature === 'hot' && 'Quente'}
                  {client.temperature === 'warm' && 'Morno'}
                  {client.temperature === 'cold' && 'Frio'}
                </Badge>
                <Badge variant="secondary">
                  {client.size}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Responsável:</span>
                  <span>{client.responsibleManager}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Entrada:</span>
                  <span>{new Date(client.entryDate).toLocaleDateString('pt-BR')}</span>
                </div>
                
                {client.nps && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">NPS:</span>
                    <Badge variant={client.nps >= 7 ? 'default' : client.nps >= 4 ? 'secondary' : 'destructive'}>
                      {client.nps}/10
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contrato:</span>
                  <span className="capitalize">
                    {client.contractType === 'recurring' && 'Recorrente'}
                    {client.contractType === 'project' && 'Projeto'}
                    {client.contractType === 'one-time' && 'Pontual'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Adicione seu primeiro cliente para começar
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
