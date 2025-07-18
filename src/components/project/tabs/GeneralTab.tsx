
import React from 'react';
import { Project } from '@/types/entities';
import { 
  Building, 
  User, 
  Users, 
  Calendar, 
  Target, 
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneralTabProps {
  project: Project;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ project }) => {
  const cronogramaItems = [
    { id: 1, task: 'Briefing inicial', completed: true, date: '2024-01-15' },
    { id: 2, task: 'Definição de escopo', completed: true, date: '2024-01-20' },
    { id: 3, task: 'Criação dos layouts', completed: true, date: '2024-02-01' },
    { id: 4, task: 'Aprovação do cliente', completed: false, date: '2024-02-15' },
    { id: 5, task: 'Desenvolvimento', completed: false, date: '2024-03-01' },
    { id: 6, task: 'Testes e ajustes', completed: false, date: '2024-03-15' },
    { id: 7, task: 'Entrega final', completed: false, date: '2024-03-30' }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Progresso do Projeto</h3>
            <span className="text-2xl font-bold text-blue-600">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Início</span>
            <span>Conclusão</span>
          </div>
        </CardContent>
      </Card>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{project.client.name}</p>
            <p className="text-sm text-gray-500">{project.client.segment}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <User className="w-4 h-4" />
              Responsável
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{project.responsibleManager}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{project.teamMembers.length} membros</p>
            <div className="mt-2 space-y-1">
              {project.teamMembers.slice(0, 3).map((member, index) => (
                <p key={index} className="text-sm text-gray-600">{member}</p>
              ))}
              {project.teamMembers.length > 3 && (
                <p className="text-sm text-gray-500">+{project.teamMembers.length - 3} mais</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data de Início
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Data de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Não definida'}
            </p>
          </CardContent>
        </Card>

        {project.budget && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {project.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Briefing and Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Briefing do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cronograma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cronogramaItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {item.completed && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.task}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralTab;
