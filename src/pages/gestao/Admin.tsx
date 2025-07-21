
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Users, 
  Shield,
  Database,
  Globe,
  Key,
  Bell,
  Mail,
  Palette,
  Code,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const Admin = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const users = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      role: 'Administrador',
      status: 'active',
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@empresa.com',
      role: 'Editor',
      status: 'active',
      lastLogin: '2024-01-19'
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos@empresa.com',
      role: 'Usuário',
      status: 'inactive',
      lastLogin: '2024-01-15'
    }
  ];

  const permissions = [
    { name: 'Gerenciar Usuários', description: 'Criar, editar e excluir usuários', enabled: true },
    { name: 'Configurações Gerais', description: 'Modificar configurações do sistema', enabled: true },
    { name: 'Relatórios Avançados', description: 'Acesso a relatórios detalhados', enabled: false },
    { name: 'Integrações', description: 'Configurar integrações externas', enabled: true },
    { name: 'Backup/Restore', description: 'Realizar backup e restauração', enabled: false }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador': return 'bg-red-100 text-red-700';
      case 'Editor': return 'bg-blue-100 text-blue-700';
      case 'Usuário': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
          <p className="text-gray-600">Ferramentas administrativas da plataforma</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Configurações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Usuários</h3>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Permissões</h3>
            <p className="text-2xl font-bold text-green-600">8</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Banco</h3>
            <p className="text-sm text-green-600">Saudável</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">API</h3>
            <p className="text-sm text-green-600">Online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gerenciamento de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>Controle de acesso e permissões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
            <CardDescription>Ajustes gerais da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notificações */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notificações
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Notificações por Email</p>
                    <p className="text-xs text-gray-600">Receber alertas via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-gray-600">Notificações no navegador</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">SMS</p>
                    <p className="text-xs text-gray-600">Alertas críticos por SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Integrações */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Code className="w-4 h-4" />
                Integrações
              </h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Configurar SMTP
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  Chaves de API
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Webhooks
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissões e Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Permissões do Sistema</CardTitle>
            <CardDescription>Controle de acesso às funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permissions.map((permission, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{permission.name}</h3>
                    <p className="text-sm text-gray-600">{permission.description}</p>
                  </div>
                  <Switch checked={permission.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup e Manutenção</CardTitle>
            <CardDescription>Ferramentas de backup e manutenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Último Backup</h4>
              <p className="text-sm text-green-600">20/01/2024 às 03:00</p>
              <p className="text-sm text-green-600">Status: Sucesso</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Fazer Backup
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Restaurar
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Otimizar Banco
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Limpar Cache
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Palette className="w-4 h-4 mr-2" />
                Personalização
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
