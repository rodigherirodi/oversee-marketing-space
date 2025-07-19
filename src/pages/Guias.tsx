
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileQuestion, 
  Clock, 
  Search,
  BookOpen,
  Download,
  ExternalLink,
  Calendar,
  User,
  Tag
} from 'lucide-react';

const Guias = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const guias = [
    {
      id: 1,
      title: "Guia Completo de React Hooks",
      description: "Tudo que você precisa saber sobre React Hooks com exemplos práticos",
      author: "Equipe Academy",
      category: "Desenvolvimento",
      readTime: "15 min",
      publishDate: "2024-02-15",
      tags: ["React", "Hooks", "JavaScript", "Frontend"],
      type: "Tutorial",
      difficulty: "Intermediário",
      downloadable: true,
      image: "⚛️",
      featured: true
    },
    {
      id: 2,
      title: "Design System: Do Conceito à Implementação",
      description: "Passo a passo para criar e manter um design system eficaz",
      author: "Maria Silva",
      category: "Design",
      readTime: "20 min",
      publishDate: "2024-02-10",
      tags: ["Design System", "UI/UX", "Figma", "Componentes"],
      type: "Guia Prático",
      difficulty: "Avançado",
      downloadable: true,
      image: "🎨",
      featured: true
    },
    {
      id: 3,
      title: "SEO para Iniciantes: Primeiros Passos",
      description: "Como otimizar seu conteúdo para mecanismos de busca",
      author: "João Santos",
      category: "Marketing",
      readTime: "12 min",
      publishDate: "2024-02-08",
      tags: ["SEO", "Marketing Digital", "Google", "Conteúdo"],
      type: "Introdução",
      difficulty: "Iniciante",
      downloadable: false,
      image: "🔍",
      featured: false
    },
    {
      id: 4,
      title: "Metodologias Ágeis na Prática",
      description: "Implementando Scrum e Kanban em equipes reais",
      author: "Ana Costa",
      category: "Gestão",
      readTime: "18 min",
      publishDate: "2024-02-05",
      tags: ["Scrum", "Kanban", "Agile", "Gestão de Projetos"],
      type: "Caso de Estudo",
      difficulty: "Intermediário",
      downloadable: true,
      image: "📊",
      featured: false
    },
    {
      id: 5,
      title: "TypeScript: Configuração e Boas Práticas",
      description: "Como configurar TypeScript em projetos e seguir as melhores práticas",
      author: "Pedro Lima",
      category: "Desenvolvimento",
      readTime: "25 min",
      publishDate: "2024-02-01",
      tags: ["TypeScript", "JavaScript", "Configuração", "Boas Práticas"],
      type: "Tutorial",
      difficulty: "Intermediário",
      downloadable: true,
      image: "📘",
      featured: false
    },
    {
      id: 6,
      title: "Psicologia das Cores no Design Digital",
      description: "Como usar cores para influenciar comportamentos e emoções",
      author: "Carla Mendes",
      category: "Design",
      readTime: "10 min",
      publishDate: "2024-01-28",
      tags: ["Cores", "Psicologia", "Design", "UX"],
      type: "Teoria",
      difficulty: "Iniciante",
      downloadable: false,
      image: "🌈",
      featured: false
    }
  ];

  const categories = ["Todos", "Desenvolvimento", "Design", "Marketing", "Gestão"];
  const types = ["Todos", "Tutorial", "Guia Prático", "Introdução", "Caso de Estudo", "Teoria"];
  
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeType, setActiveType] = useState("Todos");

  const filteredGuias = guias.filter(guia => {
    const matchesSearch = guia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guia.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guia.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === "Todos" || guia.category === activeCategory;
    const matchesType = activeType === "Todos" || guia.type === activeType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-700';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-700';
      case 'Avançado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tutorial': return 'bg-blue-100 text-blue-700';
      case 'Guia Prático': return 'bg-purple-100 text-purple-700';
      case 'Introdução': return 'bg-green-100 text-green-700';
      case 'Caso de Estudo': return 'bg-orange-100 text-orange-700';
      case 'Teoria': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guias</h1>
        <p className="text-gray-600">
          Documentação prática e tutoriais para acelerar seu aprendizado
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar guias por título, descrição ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Categoria:</span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Tipo:</span>
            {types.map((type) => (
              <Button
                key={type}
                variant={activeType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGuias.map((guia) => (
          <Card key={guia.id} className={`hover:shadow-md transition-shadow ${guia.featured ? 'ring-2 ring-purple-200' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{guia.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg line-clamp-2">{guia.title}</CardTitle>
                      {guia.featured && <Badge variant="outline" className="text-xs">Em Destaque</Badge>}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {guia.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(guia.difficulty)}>
                    {guia.difficulty}
                  </Badge>
                  <Badge className={getTypeColor(guia.type)}>
                    {guia.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {guia.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(guia.publishDate).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {guia.readTime}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {guia.tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ler Guia
                </Button>
                {guia.downloadable && (
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Guias;
