
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Video, 
  Link2, 
  Download,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { MaterialComplementar } from '../../types/trilhas';

interface MaterialsSectionProps {
  materials: MaterialComplementar[];
}

const MaterialsSection: React.FC<MaterialsSectionProps> = ({ materials }) => {
  const getIcon = (type: MaterialComplementar['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'link':
        return <Link2 className="w-4 h-4" />;
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: MaterialComplementar['type']) => {
    const labels = {
      pdf: 'PDF',
      video: 'Vídeo',
      link: 'Link',
      article: 'Artigo'
    };
    return labels[type];
  };

  const getTypeColor = (type: MaterialComplementar['type']) => {
    const colors = {
      pdf: 'bg-red-100 text-red-700',
      video: 'bg-purple-100 text-purple-700',
      link: 'bg-blue-100 text-blue-700',
      article: 'bg-green-100 text-green-700'
    };
    return colors[type];
  };

  const handleMaterialClick = (material: MaterialComplementar) => {
    if (material.type === 'pdf') {
      // Simular download
      console.log(`Downloading: ${material.title}`);
    } else {
      // Abrir link em nova aba
      window.open(material.url, '_blank');
    }
  };

  if (materials.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Materiais Complementares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Nenhum material complementar disponível para esta trilha.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Materiais Complementares
          <Badge variant="outline" className="ml-2">
            {materials.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {materials.map((material) => (
          <div 
            key={material.id}
            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(material.type)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-gray-900">
                  {material.title}
                </h4>
                <Badge className={getTypeColor(material.type)}>
                  {getTypeLabel(material.type)}
                </Badge>
              </div>
              
              {material.description && (
                <p className="text-sm text-gray-600">
                  {material.description}
                </p>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMaterialClick(material)}
                className="w-fit"
              >
                {material.type === 'pdf' ? (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Acessar
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MaterialsSection;
