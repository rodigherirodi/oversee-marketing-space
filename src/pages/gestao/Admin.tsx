
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2,
  Download,
  Upload,
  Database,
  Palette
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import SystemMetrics from '@/components/admin/SystemMetrics';
import UserFormDialog from '@/components/admin/UserFormDialog';
import SettingsDialog from '@/components/admin/SettingsDialog';

const Admin = () => {
  const { isAdmin } = useAuth();
  const { users, isLoading, createUser, updateUser, deleteUser, isCreating, isUpdating, isDeleting } = useAdminUsers();

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você precisa de permissões de administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      case 'team_lead': return 'bg-purple-100 text-purple-700';
      case 'user': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'team_lead': return 'Líder de Equipe';
      case 'user': return 'Usuário';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
          <p className="text-gray-600">Ferramentas administrativas da plataforma</p>
        </div>
        <UserFormDialog onSubmit={createUser} isLoading={isCreating} />
      </div>

      {/* Métricas do Sistema */}
      <SystemMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gerenciamento de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>Controle de acesso e permissões</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <UserFormDialog 
                          user={user} 
                          onSubmit={updateUser} 
                          isLoading={isUpdating} 
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configurações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
            <CardDescription>Ajustes gerais da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingsDialog />
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                <Database className="w-4 h-4 mr-2" />
                Otimizar Banco
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Palette className="w-4 h-4 mr-2" />
                Personalização
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup e Manutenção */}
      <Card>
        <CardHeader>
          <CardTitle>Backup e Manutenção</CardTitle>
          <CardDescription>Ferramentas de backup e manutenção</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Último Backup</h4>
            <p className="text-sm text-green-600">{new Date().toLocaleDateString('pt-BR')} às 03:00</p>
            <p className="text-sm text-green-600">Status: Sucesso</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Download className="w-4 h-4" />
              Fazer Backup
            </Button>
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Upload className="w-4 h-4" />
              Restaurar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
