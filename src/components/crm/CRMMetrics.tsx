
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CRMMetrics } from '@/types/crm';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Award,
  Clock,
  FileText
} from 'lucide-react';

interface CRMMetricsProps {
  metrics: CRMMetrics;
}

export const CRMMetricsComponent: React.FC<CRMMetricsProps> = ({ metrics }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);
  };

  const metricsData = [
    {
      title: 'Total de Leads',
      value: metrics.totalLeads.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Valor em Negociação',
      value: formatCurrency(metrics.totalValue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Taxa de Conversão',
      value: `${metrics.conversionRate}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(metrics.averageTicket),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Vendas Mês',
      value: metrics.wonThisMonth.toString(),
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Ciclo Médio',
      value: `${metrics.averageSalesCycle}d`,
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Propostas Ativas',
      value: metrics.activeProposals.toString(),
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
      {metricsData.map((metric) => (
        <Card key={metric.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-2">
            <div className="flex items-center gap-1.5">
              <div className={`p-1 rounded-md ${metric.bgColor}`}>
                <metric.icon className={`w-3 h-3 ${metric.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-none">{metric.value}</p>
                <p className="text-[10px] text-gray-600 truncate mt-0.5">{metric.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
