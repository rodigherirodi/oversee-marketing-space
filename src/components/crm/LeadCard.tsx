
import React from 'react';
import { Lead } from '@/types/crm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  User, 
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-700';
      case 'linkedin': return 'bg-indigo-100 text-indigo-700';
      case 'indicacao': return 'bg-green-100 text-green-700';
      case 'evento': return 'bg-purple-100 text-purple-700';
      case 'cold-call': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  const handleCardClick = () => {
    navigate(`/comercial/crm/lead/${lead.id}`);
  };

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
      onClick={handleCardClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{lead.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{lead.company}</span>
            </div>
          </div>
        </div>

        {/* Value and Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 font-semibold text-green-600">
            <DollarSign className="w-4 h-4" />
            {formatCurrency(lead.value)}
          </div>
          <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
            Score: {lead.score}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span className="truncate">{lead.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{lead.phone}</span>
          </div>
        </div>

        {/* Tags */}
        {lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {lead.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{lead.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Source and Probability */}
        <div className="flex items-center justify-between">
          <Badge className={`text-xs ${getSourceBadgeColor(lead.source)}`}>
            {lead.source}
          </Badge>
          <div className="text-xs text-gray-500">
            {lead.probability}% prob.
          </div>
        </div>

        {/* Next Follow Up */}
        {lead.nextFollowUp && (
          <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t">
            <Calendar className="w-3 h-3" />
            <span>Próximo: {formatDate(lead.nextFollowUp)}</span>
          </div>
        )}

        {/* Assigned To */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <User className="w-3 h-3" />
          <span>Responsável: {lead.assignedTo}</span>
        </div>
      </CardContent>
    </Card>
  );
};
