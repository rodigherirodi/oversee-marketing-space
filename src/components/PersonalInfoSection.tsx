
import React from 'react';
import { TrendingUp, Star, Clock, Award } from 'lucide-react';
import { Client } from '@/types/entities';

interface PersonalInfoSectionProps {
  client: Client;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ client }) => {
  return (
    <div className="space-y-4">
      {/* Métricas reorganizadas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-600" />
          <div>
            <div className="font-medium">Satisfação</div>
            <div className="text-gray-600">{client.nps ? `${client.nps}/10` : 'N/A'}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <div>
            <div className="font-medium">Cliente desde</div>
            <div className="text-gray-600">{new Date(client.entryDate).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <div>
            <div className="font-medium">Temperatura</div>
            <div className="text-gray-600">
              {client.temperature === 'hot' ? 'Quente' : 
               client.temperature === 'warm' ? 'Morno' : 'Frio'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-600" />
          <div>
            <div className="font-medium">Status</div>
            <div className="text-gray-600">
              {client.status === 'active' ? 'Ativo' : 
               client.status === 'inactive' ? 'Inativo' : 'Onboarding'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
