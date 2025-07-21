
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookText, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Star,
  Clock,
  Users,
  FileText,
  Video,
  Link
} from 'lucide-react';

const Playbooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const playbooks = [
    {
      id: '1',
      title: 'Primeiro Contato - Cold Call',
      description: 'Script e estratégia para primeiros contatos telefônicos',
      category: 'Prospecção',
      type: 'Script',
      lastUpdated: '2024-01-15',
      rating: 4.8,
      usage: 156,
      author: 'João Silva',
      resources: ['script', 'checklist', 'examples']
    },
    {
      id: '2',
      title: 'Apresentação de Proposta',
      description: 'Modelo completo para apresentação de propostas comerciais',
      category: 'Apresentação',
      type: 'Template',
      lastUpdated: '2024-01-10',
      rating: 4.9,
      usage: 203,
      author: 'Maria Santos',
      resources: ['template', 'video', 'examples']
    },
    {
      id: '3',
      title: 'Objeções Comuns e Respostas',
      description: 'Guia para lidar com as principais objeções dos clientes',
      category: 'Objeções',
      type: 'Guia',
      lastUpdated: '2024-01-08',
      rating: 4.7,
      usage: 134,
      author: 'Carlos Oliveira',
      resources: ['guide', 'checklist', 'video']
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Prospecção': return 'bg-blue-100 text-blue-700';
      case 'Apresentação': return 'bg-purple-100 text-purple-700';
      case 'Objeções': return 'bg-orange-100 text-orange-700';
      case 'Fechamento': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Script': return <FileText className="w-4 h-4" />;
      case 'Template': return <BookText className="w-4 h-4" />;
      case 'Guia': return <FileText className="w-4 h-4" />;
      case 'Vídeo': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Playbooks</h1>
          <p className="text-gray-600">Biblioteca de scripts, templates e guias de vendas</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Playbook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookText className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-gray-600">Playbooks Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">493</p>
                <p className="text-sm text-gray-600">Usos Este Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-gray-600">Avaliação Média</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Atualizados Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar playbooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todas as categorias</option>
          <option value="prospeccao">Prospecção</option>
          <option value="apresentacao">Apresentação</option>
          <option value="objecoes">Objeções</option>
          <option value="fechamento">Fechamento</option>
        </select>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Prospecção', 'Apresentação', 'Objeções', 'Fechamento'].map((category) => (
          <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {category === 'Prospecção' && '8'}
                {category === 'Apresentação' && '6'}
                {category === 'Objeções' && '5'}
                {category === 'Fechamento' && '5'}
              </p>
              <p className="text-sm text-gray-600">playbooks</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Playbooks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {playbooks.map((playbook) => (
          <Card key={playbook.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(playbook.type)}
                  <div>
                    <CardTitle className="text-lg">{playbook.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {playbook.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getCategoryColor(playbook.category)}>
                  {playbook.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Rating and Usage */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {playbook.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {playbook.usage} usos
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(playbook.lastUpdated).toLocaleDateString()}
                </div>
              </div>

              {/* Resources */}
              <div className="flex flex-wrap gap-2">
                {playbook.resources.map((resource, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {resource}
                  </Badge>
                ))}
              </div>

              {/* Author */}
              <p className="text-sm text-gray-600">
                Por <span className="font-medium">{playbook.author}</span>
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visualizar
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Playbooks;
