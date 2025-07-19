
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy,
  Clock,
  BookOpen,
  Target,
  Calendar,
  Award
} from 'lucide-react';
import { TrilhaDetalhada } from '../../types/trilhas';
import { useTrilhas } from '../../contexts/TrilhasContext';

interface ProgressTrackerProps {
  trilha: TrilhaDetalhada;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ trilha }) => {
  const { getTrilhaProgress } = useTrilhas();
  const progress = getTrilhaProgress(trilha.id);
  
  const completedCount = progress?.completedCourses.length || 0;
  const progressPercentage = Math.round((completedCount / trilha.totalCourses) * 100);
  const mandatoryCourses = trilha.courses.filter(course => course.mandatory).length;
  const completedMandatory = trilha.courses.filter(course => 
    course.mandatory && progress?.completedCourses.includes(course.id)
  ).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Progresso da Trilha
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progresso Principal */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className={`text-2xl font-bold ${getProgressColor(progressPercentage)}`}>
              {progressPercentage}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-sm text-gray-600">
            {completedCount} de {trilha.totalCourses} cursos concluídos
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Cursos Obrigatórios</span>
            </div>
            <p className="text-lg font-semibold">
              {completedMandatory}/{mandatoryCourses}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Tempo Estimado</span>
            </div>
            <p className="text-lg font-semibold">
              {trilha.estimatedHours}h
            </p>
          </div>
        </div>

        {/* Informações de Progresso */}
        {progress && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Iniciado em: {formatDate(progress.startedAt)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Último acesso: {formatDate(progress.lastAccessed)}</span>
            </div>
          </div>
        )}

        {/* Badge de Certificação */}
        {trilha.certificate && (
          <div className="pt-4 border-t">
            {progress?.certificateEarned ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Award className="w-4 h-4 mr-1" />
                Certificado Conquistado!
              </Badge>
            ) : progressPercentage === 100 ? (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Trophy className="w-4 h-4 mr-1" />
                Pronto para Certificação
              </Badge>
            ) : (
              <Badge variant="outline">
                <Award className="w-4 h-4 mr-1" />
                Certificado Disponível
              </Badge>
            )}
          </div>
        )}

        {/* Próximos Passos */}
        {progressPercentage < 100 && (
          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm mb-2">Próximo Curso:</h4>
            {trilha.courses
              .filter(course => !progress?.completedCourses.includes(course.id))
              .sort((a, b) => a.order - b.order)
              .slice(0, 1)
              .map(course => (
                <div key={course.id} className="text-sm text-gray-600">
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </p>
                </div>
              ))
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
