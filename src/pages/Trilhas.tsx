import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Map, Clock, Users, Award, PlayCircle, CheckCircle2, BookOpen, Star, Filter, Search } from 'lucide-react';
import { useTrilhas } from '../contexts/TrilhasContext';
const Trilhas = () => {
  const navigate = useNavigate();
  const {
    trilhas,
    userProgress
  } = useTrilhas();
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');

  // Calcular estatísticas
  const totalTrilhas = trilhas.length;
  const trilhasInProgress = Object.keys(userProgress.trilhaProgresses).length;
  const trilhasCompleted = userProgress.completedTrilhas;
  const totalHoursStudied = userProgress.totalHoursStudied;

  // Filtrar trilhas
  const filteredTrilhas = trilhas.filter(trilha => {
    if (filterCategory && trilha.category !== filterCategory) return false;
    if (filterRole && trilha.targetRole !== filterRole) return false;
    return true;
  });
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return 'bg-green-100 text-green-700';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-700';
      case 'Avançado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const getCategoryLabel = (category: string) => {
    const labels = {
      'cargo': 'Por Cargo',
      'tema-transversal': 'Tema Transversal',
      'onboarding': 'Onboarding'
    };
    return labels[category as keyof typeof labels] || category;
  };
  const getRoleLabel = (role: string) => {
    const labels = {
      'gerente-projetos': 'Gerente de Projetos',
      'analista-trafego': 'Analista de Tráfego',
      'designer': 'Designer',
      'novo-colaborador': 'Novo Colaborador'
    };
    return labels[role as keyof typeof labels] || role;
  };
  const handleTrilhaClick = (trilhaId: string) => {
    navigate(`/trilhas/${trilhaId}`);
  };
  const getProgressForTrilha = (trilhaId: string) => {
    const progress = userProgress.trilhaProgresses[trilhaId];
    if (!progress) return 0;
    const trilha = trilhas.find(t => t.id === trilhaId);
    if (!trilha) return 0;
    return Math.round(progress.completedCourses.length / trilha.totalCourses * 100);
  };

  // Agrupar trilhas por categoria
  const trilhasPorCategoria = filteredTrilhas.reduce((acc, trilha) => {
    const categoria = trilha.category;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(trilha);
    return acc;
  }, {} as Record<string, typeof trilhas>);
  return <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trilhas de Aprendizado</h1>
        <p className="text-gray-600">
          Jornadas estruturadas de conhecimento para seu desenvolvimento profissional
        </p>
      </div>

      {/* Stats Aprimoradas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Map className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalTrilhas}</p>
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
                <p className="text-2xl font-bold">{trilhasInProgress}</p>
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
                <p className="text-2xl font-bold">{trilhasCompleted}</p>
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
                <p className="text-2xl font-bold">{totalHoursStudied}</p>
                <p className="text-sm text-gray-600">Horas Estudadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-1 border rounded-md text-sm">
          <option value="">Todas as Categorias</option>
          <option value="cargo">Por Cargo</option>
          <option value="tema-transversal">Tema Transversal</option>
          <option value="onboarding">Onboarding</option>
        </select>
        
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-1 border rounded-md text-sm">
          <option value="">Todos os Cargos</option>
          <option value="gerente-projetos">Gerente de Projetos</option>
          <option value="analista-trafego">Analista de Tráfego</option>
          <option value="designer">Designer</option>
          <option value="novo-colaborador">Novo Colaborador</option>
        </select>
        
        {(filterCategory || filterRole) && <Button variant="outline" size="sm" onClick={() => {
        setFilterCategory('');
        setFilterRole('');
      }}>
            Limpar Filtros
          </Button>}
      </div>

      {/* Trilhas por Categoria */}
      {Object.entries(trilhasPorCategoria).map(([categoria, trilhasCategoria]) => <div key={categoria} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {getCategoryLabel(categoria)}
            <Badge variant="outline">{trilhasCategoria.length}</Badge>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trilhasCategoria.map(trilha => {
          const currentProgress = getProgressForTrilha(trilha.id);
          const trilhaProgress = userProgress.trilhaProgresses[trilha.id];
          return <Card key={trilha.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTrilhaClick(trilha.id)}>
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
                        <span>{currentProgress}%</span>
                      </div>
                      <Progress value={currentProgress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {trilhaProgress?.completedCourses.length || 0} de {trilha.totalCourses} cursos concluídos
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {trilha.tags.slice(0, 3).map((tag, index) => <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>)}
                      {trilha.tags.length > 3 && <Badge variant="outline" className="text-xs">
                          +{trilha.tags.length - 3}
                        </Badge>}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {trilha.duration}
                      </div>
                      
                      
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {currentProgress === 0 ? <Button className="w-full" variant="outline">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Iniciar Trilha
                        </Button> : currentProgress === 100 ? <Button className="w-full" variant="outline">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Revisar Trilha
                        </Button> : <Button className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Continuar Trilha
                        </Button>}
                    </div>
                  </CardContent>
                </Card>;
        })}
          </div>
        </div>)}
      
      {filteredTrilhas.length === 0 && <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma trilha encontrada
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros para encontrar trilhas adequadas ao seu perfil.
          </p>
        </div>}
    </div>;
};
export default Trilhas;