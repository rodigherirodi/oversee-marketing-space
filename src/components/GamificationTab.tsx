
import React from 'react';
import { TeamMember } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Award } from 'lucide-react';

interface GamificationTabProps {
  member: TeamMember;
}

const GamificationTab: React.FC<GamificationTabProps> = ({ member }) => {
  const nextLevelXP = (member.level + 1) * 100;
  const currentLevelXP = member.level * 100;
  const progressToNextLevel = member.points > currentLevelXP 
    ? ((member.points - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    : 0;

  const badges = member.badges || ['🌟'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível Atual</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Nível {member.level}</div>
            <Progress value={Math.min(progressToNextLevel, 100)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {member.points} / {nextLevelXP} XP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Totais</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.points.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Pontos acumulados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges.length}</div>
            <p className="text-xs text-muted-foreground">
              Conquistas desbloqueadas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Badges Conquistadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <span className="text-2xl mb-2">{badge}</span>
                <span className="text-xs text-center">Badge {index + 1}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progresso de Nível</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nível {member.level}</span>
                <span>Nível {member.level + 1}</span>
              </div>
              <Progress value={Math.min(progressToNextLevel, 100)} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currentLevelXP} XP</span>
                <span>{nextLevelXP} XP</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {member.points >= nextLevelXP 
                ? 'Parabéns! Você atingiu o próximo nível!'
                : `Você precisa de ${nextLevelXP - member.points} pontos para o próximo nível.`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Estatísticas de Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-lg font-semibold">{member.task_completion_rate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projetos Ativos</p>
                <p className="text-lg font-semibold">{member.active_projects_count}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projetos Concluídos</p>
                <p className="text-lg font-semibold">{member.completed_projects_count}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horas/Semana</p>
                <p className="text-lg font-semibold">{member.hours_worked_week}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {member.goals && member.goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Metas de Carreira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {member.goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">{goal}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GamificationTab;
