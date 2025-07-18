
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FolderOpen, Mail, Calendar, CheckCircle } from 'lucide-react';
import { TeamMember } from '@/types/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import BorderPattern from './BorderPattern';
import BadgeDisplay from './BadgeDisplay';
import { cn } from '@/lib/utils';

interface TeamMemberCardProps {
  member: TeamMember;
  onClick?: () => void;
  className?: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  onClick, 
  className 
}) => {
  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'vacation':
        return 'bg-yellow-100 text-yellow-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'text-purple-600';
    if (level >= 6) return 'text-blue-600';
    if (level >= 4) return 'text-green-600';
    return 'text-orange-600';
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 w-48 h-64 bg-card relative",
        className
      )}
      onClick={onClick}
    >
      {/* Borda superior personalizada */}
      <BorderPattern 
        pattern={member.borderPattern} 
        color={member.borderColor}
      />
      
      {/* Badges Gamificadas no Topo */}
      <div className="absolute top-1 right-2 z-10">
        <BadgeDisplay badges={member.badges} maxVisible={3} />
      </div>
      
      <CardContent className="p-3 h-full flex flex-col">
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-2 mt-1">
          <Badge 
            variant="secondary" 
            className={cn("text-xs", getStatusColor(member.status))}
          >
            {member.status === 'active' ? 'Ativo' : 
             member.status === 'vacation' ? 'Férias' : 'Inativo'}
          </Badge>
          
          <span className={cn("text-xs font-bold", getLevelColor(member.level))}>
            Nv.{member.level}
          </span>
        </div>

        {/* Avatar e Info Principal */}
        <div className="flex flex-col items-center text-center mb-2">
          <Avatar className="w-12 h-12 mb-2 border-2 border-border">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="text-sm font-semibold">
              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
            {member.name}
          </h3>
          
          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
            {member.position}
          </p>
          
          <div className="text-xs text-muted-foreground">
            {member.department}
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-1 mb-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{member.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>
              Desde {format(new Date(member.hireDate), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>

        {/* Footer com Projetos (Ícones com Tooltips) */}
        <div className="mt-auto flex items-center justify-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help hover:text-primary transition-colors">
                <FolderOpen className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">
                  {member.activeProjectsCount}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.activeProjectsCount} projeto{member.activeProjectsCount !== 1 ? 's' : ''} ativo{member.activeProjectsCount !== 1 ? 's' : ''}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help hover:text-green-600 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">
                  {member.completedProjectsCount}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.completedProjectsCount} projeto{member.completedProjectsCount !== 1 ? 's' : ''} concluído{member.completedProjectsCount !== 1 ? 's' : ''}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
