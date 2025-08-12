
import React, { useState, useEffect } from 'react';
import { Plus, Search, Shield, Key, Eye, EyeOff, ExternalLink, Copy, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClientAccesses } from '@/hooks/useSupabaseClientAccesses';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';
import { supabase } from '@/integrations/supabase/client';
import AccessDialog from '@/components/AccessDialog';

interface AccessWithClient {
  id: string;
  cliente_id: string;
  plataforma: string;
  usuario: string | null;
  senha: string | null;
  notas: string | null;
  categoria: string | null;
  status: boolean | null;
  url: string | null;
  criado_em: string;
  atualizado_em: string;
  clientes: {
    id: string;
    nome: string;
  } | null;
}

const AccessTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [accesses, setAccesses] = useState<AccessWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccess, setEditingAccess] = useState<AccessWithClient | null>(null);
  
  const { toast } = useToast();
  const { clients } = useSupabaseClients();

  // Buscar acessos com dados do cliente
  const fetchAccesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cliente_acessos')
        .select(`
          id,
          cliente_id,
          plataforma,
          usuario,
          senha,
          notas,
          categoria,
          status,
          url,
          criado_em,
          atualizado_em,
          clientes:cliente_id(id, nome)
        `)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar acessos:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar acessos.",
          variant: "destructive",
        });
        return;
      }

      setAccesses(data || []);
    } catch (error) {
      console.error('Erro ao buscar acessos:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar acessos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccesses();
  }, []);

  // Filtrar acessos
  const filteredAccesses = accesses.filter(access => {
    const matchesSearch = 
      access.plataforma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      access.clientes?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      access.usuario?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || access.categoria === categoryFilter;
    const matchesClient = clientFilter === 'all' || access.cliente_id === clientFilter;
    
    return matchesSearch && matchesCategory && matchesClient;
  });

  // KPIs
  const totalAccesses = accesses.length;
  const activeAccesses = accesses.filter(a => a.status !== false).length;
  const uniqueClients = new Set(accesses.map(a => a.cliente_id)).size;
  const categories = new Set(accesses.filter(a => a.categoria).map(a => a.categoria)).size;

  // Obter categorias únicas para o filtro
  const availableCategories = Array.from(new Set(accesses.filter(a => a.categoria).map(a => a.categoria)));

  const togglePasswordVisibility = (accessId: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(accessId)) {
      newVisible.delete(accessId);
    } else {
      newVisible.add(accessId);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${type} copiado para a área de transferência.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao copiar para a área de transferência.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este acesso?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cliente_acessos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir acesso:', error);
        toast({
          title: "Erro",
          description: "Falha ao excluir acesso.",
          variant: "destructive",
        });
        return;
      }

      // Otimistic UI update
      setAccesses(prev => prev.filter(access => access.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Acesso excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir acesso:', error);
      toast({
        title: "Erro",
        description: "Falha ao excluir acesso.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingAccess) {
        // Update
        const { error } = await supabase
          .from('cliente_acessos')
          .update(data)
          .eq('id', editingAccess.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Acesso atualizado com sucesso!",
        });
      } else {
        // Insert
        const { error } = await supabase
          .from('cliente_acessos')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Acesso criado com sucesso!",
        });
      }

      fetchAccesses(); // Refresh data
      setIsDialogOpen(false);
      setEditingAccess(null);
    } catch (error) {
      console.error('Erro ao salvar acesso:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar acesso.",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category: string | null) => {
    if (!category) return 'Outros';
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

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-gray-100 text-gray-700';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando acessos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Acessos e Credenciais</h2>
          <p className="text-gray-600">Gerencie credenciais de plataformas organizadas por cliente</p>
        </div>
        <Button 
          onClick={() => {
            setEditingAccess(null);
            setIsDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Acesso
        </Button>
      </div>

      {/* Security Warning */}
      <Card className="border-amber-200 bg-amber-50">
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
      <div className="flex gap-4">
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
            {availableCategories.map((category) => (
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
                {client.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Acessos</CardTitle>
            <Key className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccesses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acessos Ativos</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccesses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Key className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories}</div>
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
              {filteredAccesses.map((access) => (
                <TableRow key={access.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Key className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{access.plataforma}</div>
                        {access.url && (
                          <div className="text-xs text-gray-500">{access.url}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {access.clientes?.nome || 'Cliente não encontrado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getCategoryColor(access.categoria)}`}>
                      {getCategoryLabel(access.categoria)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {access.usuario && (
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {access.usuario}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(access.usuario!, 'Login')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {access.senha && (
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {visiblePasswords.has(access.id) ? access.senha : '••••••••'}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(access.senha!, 'Senha')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={access.status !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {access.status !== false ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Key className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          setEditingAccess(access);
                          setIsDialogOpen(true);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        {access.url && (
                          <DropdownMenuItem onClick={() => window.open(access.url!, '_blank')}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir Link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(access.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAccesses.length === 0 && (
            <div className="text-center py-12">
              <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum acesso encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou adicione um novo acesso.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Dialog */}
      <AccessDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        access={editingAccess}
        onSave={handleSave}
      />
    </div>
  );
};

export default AccessTab;
