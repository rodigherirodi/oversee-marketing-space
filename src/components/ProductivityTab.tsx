
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, FolderOpen, Target } from 'lucide-react';
import { TeamMember } from '@/types/entities';

interface ProductivityTabProps {
  member: TeamMember;
}

const ProductivityTab: React.FC<ProductivityTabProps> = ({ member }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas/Semana</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.hours_worked_week || member.hoursWorkedWeek || 40}h</div>
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
            <div className="text-2xl font-bold">{member.task_completion_rate || member.taskCompletionRate || 0}%</div>
            <Progress value={member.task_completion_rate || member.taskCompletionRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.active_projects_count || member.activeProjectsCount || 0}</div>
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
            <div className="text-2xl font-bold">{member.completed_projects_count || member.completedProjectsCount || 0}</div>
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
                <span>{member.task_completion_rate || member.taskCompletionRate || 0}%</span>
              </div>
              <Progress value={member.task_completion_rate || member.taskCompletionRate || 0} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carga Horária Semanal</span>
                <span>{member.hours_worked_week || member.hoursWorkedWeek || 40}/40h</span>
              </div>
              <Progress value={((member.hours_worked_week || member.hoursWorkedWeek || 40) / 40) * 100} />
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
                <span className="text-2xl font-bold">{member.active_projects_count || member.activeProjectsCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Projetos Concluídos</p>
                    <p className="text-sm text-muted-foreground">Finalizados com sucesso</p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{member.completed_projects_count || member.completedProjectsCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductivityTab;
