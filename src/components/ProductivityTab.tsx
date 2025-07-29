
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, FolderOpen, Target } from 'lucide-react';
import { useProductivityData } from '@/hooks/useProductivityData';

interface ProductivityTabProps {
  member: {
    id: string;
    name: string;
    email: string;
    position: string;
    department: string;
    avatar: string;
    status: string;
    level: number;
    points: number;
    taskCompletionRate: number;
    activeProjectsCount: number;
    completedProjectsCount: number;
    hoursWorkedWeek: number;
    createdAt: string;
    phone: string;
    birthDate: string;
    hireDate: string;
    address: string;
    borderPattern: string;
    borderColor: string;
  };
}

const ProductivityTab: React.FC<ProductivityTabProps> = ({ member }) => {
  // Para demonstração, vamos usar dados básicos do membro
  // Em um cenário real, você poderia criar um hook específico para buscar dados de produtividade de outros usuários
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas/Semana</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.hoursWorkedWeek}h</div>
            <p className="text-xs text-muted-foreground">
              Média semanal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.taskCompletionRate}%</div>
            <Progress value={member.taskCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.activeProjectsCount}</div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.completedProjectsCount}</div>
            <p className="text-xs text-muted-foreground">
              Finalizados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Taxa de Conclusão de Tarefas</span>
                <span>{member.taskCompletionRate}%</span>
              </div>
              <Progress value={member.taskCompletionRate} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carga Horária Semanal</span>
                <span>{member.hoursWorkedWeek}/40h</span>
              </div>
              <Progress value={(member.hoursWorkedWeek / 40) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Histórico de Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Projetos Ativos</p>
                    <p className="text-sm text-muted-foreground">Em andamento</p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{member.activeProjectsCount}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Projetos Concluídos</p>
                    <p className="text-sm text-muted-foreground">Finalizados com sucesso</p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{member.completedProjectsCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductivityTab;
