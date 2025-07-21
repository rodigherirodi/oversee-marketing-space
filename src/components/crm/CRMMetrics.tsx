
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CRMMetrics } from '@/types/crm';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calendar,
  Award,
  Activity,
  Clock
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
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Valor Total Pipeline',
      value: formatCurrency(metrics.totalValue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Taxa de Conversão',
      value: `${metrics.conversionRate}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(metrics.averageTicket),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Leads Este Mês',
      value: metrics.leadsThisMonth.toString(),
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Vendas Este Mês',
      value: metrics.wonThisMonth.toString(),
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Perdas Este Mês',
      value: metrics.lostThisMonth.toString(),
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Velocidade Pipeline',
      value: `${metrics.pipelineVelocity} dias`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsData.map((metric) => (
        <Card key={metric.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600 truncate">{metric.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
