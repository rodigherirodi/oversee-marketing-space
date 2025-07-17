
import React, { useState } from 'react';
import { Client } from '../types/entities';
import { mockClients } from '../data/mockData';
import { Search, Grid, List, Plus, Globe, Phone, Mail, TrendingUp } from 'lucide-react';

const Clients = () => {
  const [clients] = useState<Client[]>(mockClients);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.segment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || client.status === selectedStatus;
    const matchesSize = !selectedSize || client.size === selectedSize;
    
    return matchesSearch && matchesStatus && matchesSize;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'onboarding': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'onboarding': return 'Onboarding';
      default: return status;
    }
  };

  const getTemperatureColor = (temperature: string) => {
    switch (temperature) {
      case 'hot': return 'bg-red-100 text-red-700';
      case 'warm': return 'bg-yellow-100 text-yellow-700';
      case 'cold': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTemperatureLabel = (temperature: string) => {
    switch (temperature) {
      case 'hot': return 'Quente';
      case 'warm': return 'Morno';
      case 'cold': return 'Frio';
      default: return temperature;
    }
  };

  const ClientCard = ({ client }: { client: Client }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        {client.cover ? (
          <img 
            src={client.cover} 
            alt={client.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-white text-4xl font-bold">
              {client.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
            {getStatusLabel(client.status)}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">
            {client.logo}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{client.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{client.segment}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Porte:</span>
            <span className="text-sm font-medium text-gray-900">{client.size}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTemperatureColor(client.temperature)}`}>
            {getTemperatureLabel(client.temperature)}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{client.primaryContact.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{client.primaryContact.phone}</span>
          </div>
          {client.website && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span className="truncate">{client.website}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Gestor: {client.responsibleManager}</span>
          {client.nps && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>NPS: {client.nps}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ClientListItem = ({ client }: { client: Client }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            {client.cover ? (
              <img 
                src={client.cover} 
                alt={client.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-600 text-xl font-bold">
                {client.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{client.segment}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{client.address}</span>
              <span>•</span>
              <span>{client.primaryContact.name}</span>
              <span>•</span>
              <span>{client.responsibleManager}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Contrato</div>
            <div className="text-sm font-medium text-gray-900">
              {client.contractType === 'recurring' ? 'Recorrente' : 
               client.contractType === 'project' ? 'Projeto' : 'Único'}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
              {getStatusLabel(client.status)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTemperatureColor(client.temperature)}`}>
              {getTemperatureLabel(client.temperature)}
            </span>
          </div>
          
          {client.nps && (
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">NPS</div>
              <div className="text-2xl font-bold text-green-600">{client.nps}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600">Gerencie todos os clientes da agência</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Novo Cliente</span>
            </button>
          </div>

          {/* Filtros e Controles */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="onboarding">Onboarding</option>
              </select>

              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os portes</option>
                <option value="MEI">MEI</option>
                <option value="PME">PME</option>
                <option value="large">Grande Porte</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-600 text-sm font-medium mb-2">Total de Clientes</div>
              <div className="text-2xl font-bold text-gray-900">{filteredClients.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-600 text-sm font-medium mb-2">Ativos</div>
              <div className="text-2xl font-bold text-green-600">
                {filteredClients.filter(c => c.status === 'active').length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-600 text-sm font-medium mb-2">Onboarding</div>
              <div className="text-2xl font-bold text-blue-600">
                {filteredClients.filter(c => c.status === 'onboarding').length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-600 text-sm font-medium mb-2">NPS Médio</div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(filteredClients.reduce((acc, c) => acc + (c.nps || 0), 0) / filteredClients.length || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <ClientListItem key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
