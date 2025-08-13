
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Database, Globe } from 'lucide-react';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';

const SystemMetrics: React.FC = () => {
  const { systemStatus, isLoading } = useSystemMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
      case 'offline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Saudável';
      case 'online':
        return 'Online';
      case 'warning':
        return 'Atenção';
      case 'error':
        return 'Erro';
      case 'offline':
        return 'Offline';
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold">Usuários</h3>
          <p className="text-2xl font-bold text-blue-600">{systemStatus?.users_count || 0}</p>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold">Permissões</h3>
          <p className="text-2xl font-bold text-green-600">{systemStatus?.permissions_count || 0}</p>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold">Banco</h3>
          <p className={`text-sm font-medium ${getStatusColor(systemStatus?.database || 'error')}`}>
            {getStatusText(systemStatus?.database || 'error')}
          </p>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4 text-center">
          <Globe className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <h3 className="font-semibold">API</h3>
          <p className={`text-sm font-medium ${getStatusColor(systemStatus?.api || 'offline')}`}>
            {getStatusText(systemStatus?.api || 'offline')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMetrics;
