
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/types/entities';
import { 
  ArrowLeft, 
  Edit,
  CheckCircle,
  AlertCircle,
  Pause,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Play className="w-4 h-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-red-600" />;
      case 'review':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Play className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'Em Progresso';
      case 'planning': return 'Planejamento';
      case 'review': return 'Em Revisão';
      case 'paused': return 'Em Pausa';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-green-100 text-green-700 border-green-200';
      case 'planning': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'paused': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(project.status)}`}>
          {getStatusIcon(project.status)}
          <span className="text-sm font-medium">{getStatusText(project.status)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
