
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Clock,
  Users,
  Star,
  BookOpen,
  Award
} from 'lucide-react';
import { useTrilhas } from '../contexts/TrilhasContext';
import CourseChecklist from '../components/trilhas/CourseChecklist';
import ProgressTracker from '../components/trilhas/ProgressTracker';
import MaterialsSection from '../components/trilhas/MaterialsSection';
import NotesSection from '../components/trilhas/NotesSection';
import CertificateCard from '../components/trilhas/CertificateCard';

const TrilhaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTrilhaById } = useTrilhas();
  
  const trilha = getTrilhaById(id || '');

  if (!trilha) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/trilhas')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Trilhas
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Trilha não encontrada
          </h1>
          <p className="text-gray-600">
            A trilha que você está procurando não existe ou foi removida.
          </p>
        </div>
      </div>
    );
  }

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
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/trilhas')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Trilhas
        </Button>
      </div>

      {/* Header da Trilha */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{trilha.image}</div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {trilha.title}
                </h1>
                <p className="text-gray-600 text-lg">
                  {trilha.description}
                </p>
              </div>
              
              <Badge className={getLevelColor(trilha.level)}>
                {trilha.level}
              </Badge>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {trilha.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{trilha.duration}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-green-600" />
                <span>{trilha.students.toLocaleString()} alunos</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{trilha.rating}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>{trilha.totalCourses} cursos</span>
              </div>
            </div>

            {/* Pré-requisitos */}
            {trilha.prerequisites.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Pré-requisitos:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {trilha.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certificação */}
            {trilha.certificate && (
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                <Award className="w-4 h-4" />
                <span className="font-medium">
                  Certificado disponível após conclusão de todos os cursos
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lista de Cursos */}
          <CourseChecklist trilhaId={trilha.id} courses={trilha.courses} />
          
          {/* Materiais Complementares */}
          <MaterialsSection materials={trilha.materialsComplements} />
          
          {/* Seção de Anotações */}
          <NotesSection trilhaId={trilha.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progresso */}
          <ProgressTracker trilha={trilha} />
          
          {/* Certificado */}
          <CertificateCard trilha={trilha} />
        </div>
      </div>
    </div>
  );
};

export default TrilhaDetail;
