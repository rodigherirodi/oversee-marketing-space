
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Download, 
  Trophy,
  Star,
  Calendar
} from 'lucide-react';
import { TrilhaDetalhada } from '../../types/trilhas';
import { useTrilhas } from '../../contexts/TrilhasContext';

interface CertificateCardProps {
  trilha: TrilhaDetalhada;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ trilha }) => {
  const { getTrilhaProgress } = useTrilhas();
  const progress = getTrilhaProgress(trilha.id);
  
  const completedCount = progress?.completedCourses.length || 0;
  const progressPercentage = Math.round((completedCount / trilha.totalCourses) * 100);
  const isCompleted = progressPercentage === 100;
  const certificateEarned = progress?.certificateEarned || false;

  const handleDownloadCertificate = () => {
    // Simular download do certificado
    console.log(`Downloading certificate for trilha: ${trilha.title}`);
    // Aqui você integraria com um gerador de certificados ou API
  };

  if (!trilha.certificate) {
    return null;
  }

  return (
    <Card className={`${certificateEarned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className={`w-5 h-5 ${certificateEarned ? 'text-yellow-600' : 'text-gray-600'}`} />
          Certificação
          {certificateEarned && (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              <Trophy className="w-3 h-3 mr-1" />
              Conquistado!
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {certificateEarned ? (
          // Certificado conquistado
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Parabéns! Certificado Conquistado!
              </h3>
              <p className="text-sm text-gray-600">
                Você completou com sucesso a trilha "{trilha.title}"
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-yellow-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Trilha:</span>
                <span className="font-medium">{trilha.title}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cursos Concluídos:</span>
                <span className="font-medium">{completedCount}/{trilha.totalCourses}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Horas de Estudo:</span>
                <span className="font-medium">{trilha.estimatedHours}h</span>
              </div>
              
              {progress?.startedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Data de Conclusão:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(progress.lastAccessed).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
            
            <Button onClick={handleDownloadCertificate} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Baixar Certificado
            </Button>
          </div>
        ) : isCompleted ? (
          // Trilha completa, mas certificado não emitido ainda
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Trilha Completa!
              </h3>
              <p className="text-sm text-gray-600">
                Você completou todos os cursos. Seu certificado será emitido em breve.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 text-sm">
                <Star className="w-4 h-4" />
                <span className="font-medium">Certificado em processamento</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Aguarde algumas horas para que seu certificado seja gerado automaticamente.
              </p>
            </div>
          </div>
        ) : (
          // Trilha em progresso
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Certificado Disponível
              </h3>
              <p className="text-sm text-gray-600">
                Complete todos os cursos desta trilha para conquistar seu certificado
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso:</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Restam:</span>
                <span className="font-medium">
                  {trilha.totalCourses - completedCount} curso(s)
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Continue estudando para desbloquear seu certificado!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateCard;
