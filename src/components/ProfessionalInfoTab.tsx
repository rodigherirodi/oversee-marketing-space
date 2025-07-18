
import React from 'react';
import { TeamMember } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, User, DollarSign, Award } from 'lucide-react';

interface ProfessionalInfoTabProps {
  member: TeamMember;
}

const ProfessionalInfoTab: React.FC<ProfessionalInfoTabProps> = ({ member }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cargo e Departamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Cargo Atual</p>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Departamento</p>
                <p className="text-sm text-muted-foreground">{member.department}</p>
              </div>
            </div>
            
            {member.supervisor && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Supervisor</p>
                  <p className="text-sm text-muted-foreground">{member.supervisor}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Financeiras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {member.salary && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Salário</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {member.salary.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Habilidades e Competências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {member.goals && member.goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metas e Objetivos</CardTitle>
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

export default ProfessionalInfoTab;
