
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Map, 
  Clock, 
  Users, 
  Award, 
  PlayCircle, 
  CheckCircle2,
  BookOpen,
  Star
} from 'lucide-react';

const Trilhas = () => {
  const trilhas = [
    {
      id: 1,
      title: "Fundamentos de Design",
      description: "Aprenda os princípios básicos do design gráfico e digital",
      duration: "40 horas",
      students: 1250,
      rating: 4.8,
      progress: 65,
      level: "Iniciante",
      courses: 8,
      completed: 5,
      image: "🎨",
      tags: ["Design", "UI/UX", "Criatividade"]
    },
    {
      id: 2,
      title: "Desenvolvimento Frontend",
      description: "Domine React, TypeScript e as melhores práticas de desenvolvimento",
      duration: "60 horas",
      students: 890,
      rating: 4.9,
      progress: 30,
      level: "Intermediário",
      courses: 12,
      completed: 4,
      image: "💻",
      tags: ["React", "TypeScript", "Frontend"]
    },
    {
      id: 3,
      title: "Marketing Digital",
      description: "Estratégias completas para conquistar o mundo digital",
      duration: "45 horas",
      students: 2100,
      rating: 4.7,
      progress: 0,
      level: "Iniciante",
      courses: 10,
      completed: 0,
      image: "📱",
      tags: ["Marketing", "Social Media", "SEO"]
    },
    {
      id: 4,
      title: "Gestão de Projetos",
      description: "Metodologias ágeis e ferramentas para liderar projetos",
      duration: "35 horas",
      students: 756,
      rating: 4.6,
      progress: 100,
      level: "Avançado",
      courses: 7,
      completed: 7,
      image: "📊",
      tags: ["Gestão", "Agile", "Liderança"]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante': return 'bg-green-100 text-green-700';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-700';
      case 'Avançado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trilhas de Aprendizado</h1>
        <p className="text-gray-600">
          Jornadas estruturadas de conhecimento para seu desenvolvimento profissional
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Map className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Trilhas Disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <PlayCircle className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Em Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-gray-600">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">85</p>
                <p className="text-sm text-gray-600">Horas Estudadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trilhas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trilhas.map((trilha) => (
          <Card key={trilha.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{trilha.image}</div>
                  <div>
                    <CardTitle className="text-lg">{trilha.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {trilha.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getLevelColor(trilha.level)}>
                  {trilha.level}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>{trilha.progress}%</span>
                </div>
                <Progress value={trilha.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {trilha.completed} de {trilha.courses} cursos concluídos
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {trilha.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {trilha.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {trilha.students.toLocaleString()} alunos
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {trilha.rating}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {trilha.progress === 0 ? (
                  <Button className="w-full" variant="outline">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Iniciar Trilha
                  </Button>
                ) : trilha.progress === 100 ? (
                  <Button className="w-full" variant="outline">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Revisar Trilha
                  </Button>
                ) : (
                  <Button className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continuar Trilha
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Trilhas;
