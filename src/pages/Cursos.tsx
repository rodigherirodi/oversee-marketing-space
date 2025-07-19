
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  PlayCircle, 
  Search,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const Cursos = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const cursos = [
    {
      id: 1,
      title: "Introdução ao React",
      description: "Aprenda os fundamentos do React do zero",
      instructor: "Maria Silva",
      duration: "8 horas",
      students: 1850,
      rating: 4.9,
      price: "Gratuito",
      level: "Iniciante",
      category: "Desenvolvimento",
      image: "⚛️",
      tags: ["React", "JavaScript", "Frontend"],
      lessons: 24,
      completed: false,
      progress: 0,
      publishDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Design Systems Avançado",
      description: "Construa sistemas de design escaláveis e consistentes",
      instructor: "João Santos",
      duration: "12 horas",
      students: 892,
      rating: 4.8,
      price: "R$ 199",
      level: "Avançado",
      category: "Design",
      image: "🎨",
      tags: ["Design System", "Figma", "UI/UX"],
      lessons: 18,
      completed: false,
      progress: 45,
      publishDate: "2024-02-01"
    },
    {
      id: 3,
      title: "Marketing de Conteúdo",
      description: "Estratégias para criar conteúdo que converte",
      instructor: "Ana Costa",
      duration: "6 horas",
      students: 2340,
      rating: 4.7,
      price: "R$ 149",
      level: "Intermediário",
      category: "Marketing",
      image: "📝",
      tags: ["Content Marketing", "SEO", "Social Media"],
      lessons: 15,
      completed: true,
      progress: 100,
      publishDate: "2024-01-20"
    },
    {
      id: 4,
      title: "TypeScript Essencial",
      description: "Domine TypeScript para desenvolvimento mais seguro",
      instructor: "Pedro Lima",
      duration: "10 horas",
      students: 1456,
      rating: 4.9,
      price: "R$ 179",
      level: "Intermediário",
      category: "Desenvolvimento",
      image: "📘",
      tags: ["TypeScript", "JavaScript", "Programming"],
      lessons: 28,
      completed: false,
      progress: 20,
      publishDate: "2024-02-10"
    },
    {
      id: 5,
      title: "Gestão Ágil de Projetos",
      description: "Metodologias ágeis na prática",
      instructor: "Carlos Mendes",
      duration: "7 horas",
      students: 987,
      rating: 4.6,
      price: "R$ 129",
      level: "Intermediário",
      category: "Gestão",
      image: "📊",
      tags: ["Agile", "Scrum", "Kanban"],
      lessons: 20,
      completed: false,
      progress: 0,
      publishDate: "2024-01-30"
    }
  ];

  const categories = ["Todos", "Desenvolvimento", "Design", "Marketing", "Gestão"];
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = curso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curso.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || curso.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante': return 'bg-green-100 text-green-700';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-700';
      case 'Avançado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const meusCursos = cursos.filter(curso => curso.progress > 0 || curso.completed);
  const cursosDisponiveis = cursos.filter(curso => curso.progress === 0 && !curso.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cursos</h1>
        <p className="text-gray-600">
          Desenvolva suas habilidades com cursos especializados
        </p>
      </div>

      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todos">Todos os Cursos</TabsTrigger>
          <TabsTrigger value="meus">Meus Cursos ({meusCursos.length})</TabsTrigger>
          <TabsTrigger value="disponiveis">Disponíveis ({cursosDisponiveis.length})</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
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

        <TabsContent value="todos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCursos.map((curso) => (
              <Card key={curso.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{curso.image}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{curso.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {curso.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={getLevelColor(curso.level)}>
                      {curso.level}
                    </Badge>
                    <span className="text-sm font-medium text-purple-600">{curso.price}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Por {curso.instructor}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {curso.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {curso.lessons} aulas
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {curso.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {curso.rating}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {curso.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {curso.progress > 0 ? 'Continuar' : 'Iniciar Curso'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meus" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meusCursos.map((curso) => (
              <Card key={curso.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{curso.image}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{curso.title}</CardTitle>
                        <p className="text-sm text-gray-600">Por {curso.instructor}</p>
                      </div>
                    </div>
                    {curso.completed && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{curso.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all" 
                        style={{ width: `${curso.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {curso.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {curso.lessons} aulas
                    </div>
                  </div>

                  <Button className="w-full">
                    {curso.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Revisar Curso
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Continuar Curso
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="disponiveis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosDisponiveis.map((curso) => (
              <Card key={curso.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{curso.image}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{curso.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {curso.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={getLevelColor(curso.level)}>
                      {curso.level}
                    </Badge>
                    <span className="text-sm font-medium text-purple-600">{curso.price}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Por {curso.instructor}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(curso.publishDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {curso.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {curso.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {curso.rating}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Iniciar Curso
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cursos;
