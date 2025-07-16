import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  User, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  AlertTriangle,
  Star,
  TrendingUp,
  Shield,
  MessageSquare,
  Clock,
  Tag,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { Client } from '../types';

interface ClientProfileProps {
  client: Client;
  onClose: () => void;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ client, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'relationship' | 'team' | 'history'>('info');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getTemperatureColor = (temperature?: string) => {
    switch (temperature) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureLabel = (temperature?: string) => {
    switch (temperature) {
      case 'hot': return 'Quente';
      case 'warm': return 'Morno';
      case 'cold': return 'Frio';
      default: return 'Indefinido';
    }
  };

  const tabs = [
    { id: 'info', label: 'Informações', icon: FileText },
    { id: 'projects', label: 'Projetos', icon: Building },
    { id: 'relationship', label: 'Relacionamento', icon: Users },
    { id: 'team', label: 'Equipe', icon: User },
    { id: 'history', label: 'Histórico', icon: Clock }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <div 
            className="h-32 bg-gradient-to-br from-blue-500 to-purple-600"
            style={{ background: `linear-gradient(135deg, ${client.color}40, ${client.color}80)` }}
          />
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="absolute -bottom-6 left-6">
            <div 
              className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: client.color }}
            >
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>

        {/* Client Info Header */}
        <div className="pt-10 px-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">{client.company}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">
                  Cliente desde {new Date(client.startDate).toLocaleDateString('pt-BR')}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{client.segment || 'Segmento não definido'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTemperatureColor(client.temperature)}`}>
                {getTemperatureLabel(client.temperature)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                client.status === 'active' ? 'bg-green-100 text-green-800' :
                client.status === 'onboarding' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {client.status === 'active' ? 'Ativo' : 
                 client.status === 'onboarding' ? 'Onboarding' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informações Gerais</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Empresa</p>
                        <p className="font-medium">{client.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Segmento</p>
                        <p className="font-medium">{client.segment || 'Não definido'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        {client.website ? (
                          <a href={client.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline flex items-center">
                            {client.website} <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        ) : (
                          <p className="font-medium text-gray-400">Não informado</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Endereço</p>
                        <p className="font-medium">
                          {client.address ? `${client.address.street}, ${client.address.city} - ${client.address.state}` : 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contatos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contatos</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Contato Principal</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{client.primaryContact?.name || 'Não informado'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{client.primaryContact?.phone || client.phone || 'Não informado'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{client.primaryContact?.email || client.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Contato Financeiro</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{client.financialContact?.name || 'Não informado'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{client.financialContact?.phone || 'Não informado'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{client.financialContact?.email || 'Não informado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Senhas e Acessos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Senhas e Acessos</h3>
                {client.credentials && client.credentials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {client.credentials.map((credential) => (
                      <div key={credential.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{credential.platform}</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{credential.category}</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Usuário</p>
                            <p className="text-sm font-mono">{credential.username}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Senha</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-mono">
                                {showPasswords[credential.id] ? credential.password : '••••••••'}
                              </p>
                              <button
                                onClick={() => togglePasswordVisibility(credential.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords[credential.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum acesso cadastrado</p>
                )}
              </div>

              {/* Stakeholders */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stakeholders</h3>
                {client.stakeholders && client.stakeholders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {client.stakeholders.map((stakeholder) => (
                      <div key={stakeholder.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{stakeholder.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            stakeholder.relationship === 'decisor' ? 'bg-red-100 text-red-800' :
                            stakeholder.relationship === 'influenciador' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {stakeholder.relationship}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{stakeholder.role}</p>
                        <div className="space-y-1">
                          {stakeholder.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{stakeholder.email}</span>
                            </div>
                          )}
                          {stakeholder.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{stakeholder.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum stakeholder cadastrado</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Projetos</h3>
              <p className="text-gray-500">Projetos relacionados ao cliente aparecerão aqui</p>
            </div>
          )}

          {activeTab === 'relationship' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">NPS e Satisfação</h3>
                  {client.nps && client.nps.length > 0 ? (
                    <div className="space-y-3">
                      {client.nps.slice(0, 3).map((nps, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="font-medium">{nps.score}/10</span>
                            </div>
                            <span className="text-sm text-gray-500">{new Date(nps.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <p className="text-sm text-gray-600">{nps.comments}</p>
                          <p className="text-xs text-gray-500 mt-1">Por: {nps.collectedBy}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum NPS coletado</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Contrato</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Tipo de Contrato</p>
                      <p className="font-medium">
                        {client.contractType === 'recurring' ? 'Recorrente' :
                         client.contractType === 'one-time' ? 'Pontual' :
                         client.contractType === 'project-based' ? 'Por Projeto' : 'Não definido'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Valor do Contrato</p>
                      <p className="font-medium text-green-600">
                        {client.contractValue ? `R$ ${client.contractValue.toLocaleString('pt-BR')}` : 'Não informado'}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Porte da Empresa</p>
                      <p className="font-medium">
                        {client.companySize === 'MEI' ? 'MEI' :
                         client.companySize === 'PME' ? 'PME' :
                         client.companySize === 'Large' ? 'Grande Porte' : 'Não informado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {client.notes || 'Nenhuma observação cadastrada'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipe da Agência</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Atendimento</h4>
                    <p className="text-sm text-gray-600">{client.team?.account || 'Não atribuído'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Criativo</h4>
                    <p className="text-sm text-gray-600">{client.team?.creative || 'Não atribuído'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Analista</h4>
                    <p className="text-sm text-gray-600">{client.team?.analyst || 'Não atribuído'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Editor</h4>
                    <p className="text-sm text-gray-600">{client.team?.editor || 'Não atribuído'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Reuniões</h3>
                {client.meetings && client.meetings.length > 0 ? (
                  <div className="space-y-3">
                    {client.meetings.map((meeting) => (
                      <div key={meeting.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                          <span className="text-sm text-gray-500">{new Date(meeting.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{meeting.summary}</p>
                        <p className="text-xs text-gray-500">
                          Participantes: {meeting.participants.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma reunião registrada</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas</h3>
                {client.alerts && client.alerts.length > 0 ? (
                  <div className="space-y-3">
                    {client.alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'error' ? 'bg-red-50 border-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        'bg-blue-50 border-blue-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className={`w-4 h-4 ${
                              alert.type === 'error' ? 'text-red-500' :
                              alert.type === 'warning' ? 'text-yellow-500' :
                              'text-blue-500'
                            }`} />
                            <p className="text-sm font-medium">{alert.message}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum alerta ativo</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;