
import React, { useState } from 'react';
import { Plus, Search, Key, Eye, EyeOff, ExternalLink, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAccess } from '../data/newMockData';

const Access = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const filteredAccess = mockAccess.filter(access => {
    const matchesSearch = access.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         access.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         access.login.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || access.category === categoryFilter;
    const matchesClient = clientFilter === 'all' || access.clientId === clientFilter;
    return matchesSearch && matchesCategory && matchesClient;
  });

  const categories = Array.from(new Set(mockAccess.map(a => a.category)));
  const clients = Array.from(new Set(mockAccess.map(a => ({ id: a.clientId, name: a.client.name }))));

  const togglePasswordVisibility = (accessId: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(accessId)) {
      newVisible.delete(accessId);
    } else {
      newVisible.add(accessId);
    }
    setVisiblePasswords(newVisible);
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      social: 'Redes Sociais',
      ads: 'Anúncios',
      analytics: 'Analytics',
      email: 'E-mail',
      hosting: 'Hospedagem',
      other: 'Outros'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      social: 'bg-blue-100 text-blue-700',
      ads: 'bg-green-100 text-green-700',
      analytics: 'bg-purple-100 text-purple-700',
      email: 'bg-orange-100 text-orange-700',
      hosting: 'bg-red-100 text-red-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Acessos e Credenciais</h1>
              <p className="text-gray-600">Gerencie login e senhas de plataformas organizados por cliente</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Acesso
            </Button>
          </div>
        </div>

        {/* Security Warning */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="font-medium text-amber-800">Informação Sensível</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Esta seção contém credenciais sensíveis. Use com responsabilidade e mantenha a segurança.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por plataforma, cliente ou login..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {getCategoryLabel(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Acessos</CardTitle>
              <Key className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAccess.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acessos Ativos</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAccess.filter(a => a.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Key className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Shield className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Access Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Acessos</CardTitle>
            <CardDescription>
              Credenciais organizadas por plataforma e cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Senha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccess.map((access) => (
                  <TableRow key={access.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Key className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{access.platform}</div>
                          {access.url && (
                            <div className="text-xs text-gray-500">{access.url}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={access.client.logo} 
                          alt={access.client.name}
                          className="w-6 h-6 rounded"
                        />
                        <span className="font-medium">{access.client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getCategoryColor(access.category)}`}>
                        {getCategoryLabel(access.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {access.login}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {visiblePasswords.has(access.id) ? access.password : '••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(access.id)}
                        >
                          {visiblePasswords.has(access.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={access.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {access.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {access.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={access.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAccess.length === 0 && (
              <div className="text-center py-12">
                <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum acesso encontrado</h3>
                <p className="text-gray-600">Tente ajustar os filtros ou adicione um novo acesso.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Access;
