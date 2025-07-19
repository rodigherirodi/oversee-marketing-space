
import React from 'react';
import { Calendar, Clock, Award, MapPin, TrendingUp } from 'lucide-react';
import { UserProductivity } from '@/types/newEntities';
import { Badge } from '@/components/ui/badge';

interface PersonalInfoSectionProps {
  user: UserProductivity;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-blue-600" />
          <div>
            <div className="font-medium">Contratação</div>
            <div className="text-gray-600">{new Date(user.hireDate).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-green-600" />
          <div>
            <div className="font-medium">Tempo na empresa</div>
            <div className="text-gray-600">{user.timeInCompany}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-purple-600" />
          <div>
            <div className="font-medium">Timezone</div>
            <div className="text-gray-600">{user.timezone}</div>
          </div>
        </div>
        
        {user.lastPromotion && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <div>
              <div className="font-medium">Última promoção</div>
              <div className="text-gray-600">{new Date(user.lastPromotion.date).toLocaleDateString('pt-BR')}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Certificações */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Certificações Ativas
        </h4>
        <div className="flex flex-wrap gap-2">
          {user.certifications.map((cert, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {cert.name} - {cert.issuer}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Projetos-chave */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Projetos-chave</h4>
        <div className="flex flex-wrap gap-2">
          {user.keyProjects.map((project, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {project}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
