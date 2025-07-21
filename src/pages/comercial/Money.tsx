
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  Users,
  Award,
  BarChart3,
  Filter,
  Download
} from 'lucide-react';

const Money = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const salesData = [
    {
      name: 'João Silva',
      sales: 185000,
      goal: 200000,
      commission: 9250,
      deals: 8,
      conversion: 72
    },
    {
      name: 'Maria Santos',
      sales: 220000,
      goal: 200000,
      commission: 11000,
      deals: 12,
      conversion: 85
    },
    {
      name: 'Carlos Oliveira',
      sales: 165000,
      goal: 180000,
      commission: 8250,
      deals: 6,
      conversion: 68
    }
  ];

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Money</h1>
          <p className="text-gray-600">Dashboard de performance comercial e financeira</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">R$ 570.000</p>
                <p className="text-sm text-gray-600">Vendas do Mês</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-sm text-gray-600">Meta Alcançada</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">26</p>
                <p className="text-sm text-gray-600">Negócios Fechados</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">R$ 28.500</p>
                <p className="text-sm text-gray-600">Comissões do Mês</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+15%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meta vs Realizado */}
      <Card>
        <CardHeader>
          <CardTitle>Meta vs Realizado</CardTitle>
          <CardDescription>Acompanhamento mensal das metas de vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Meta do Mês</p>
                <p className="text-2xl font-bold text-gray-900">R$ 600.000</p>
              </div>
              <div>
                <p className="text-sm font-medium">Realizado</p>
                <p className="text-2xl font-bold text-green-600">R$ 570.000</p>
              </div>
              <div>
                <p className="text-sm font-medium">Restante</p>
                <p className="text-2xl font-bold text-orange-600">R$ 30.000</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: '95%' }}></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Dias Restantes</p>
                <p className="text-xl font-bold text-green-700">8</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Média Diária Necessária</p>
                <p className="text-xl font-bold text-blue-700">R$ 3.750</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Projeção do Mês</p>
                <p className="text-xl font-bold text-purple-700">R$ 595.000</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Individual */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Individual</CardTitle>
          <CardDescription>Desempenho dos vendedores no período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.map((seller, index) => (
              <div key={seller.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {seller.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{seller.name}</h3>
                      <p className="text-sm text-gray-600">{seller.deals} negócios fechados</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">R$ {seller.sales.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Comissão: R$ {seller.commission.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Meta: R$ {seller.goal.toLocaleString()}</span>
                    <span>{Math.round((seller.sales / seller.goal) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(seller.sales / seller.goal) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="flex justify-between mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {seller.conversion}% conversão
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {(seller.sales / seller.goal) >= 1 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${(seller.sales / seller.goal) >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {(seller.sales / seller.goal) >= 1 ? 'Acima' : 'Abaixo'} da meta
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comissões Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle>Comissões e Bonificações</CardTitle>
          <CardDescription>Detalhamento das comissões por vendedor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comissão Base</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonificação</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesData.map((seller) => (
                  <tr key={seller.name}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{seller.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">R$ {seller.sales.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">R$ {seller.commission.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      R$ {(seller.sales >= seller.goal ? 2000 : 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">
                      R$ {(seller.commission + (seller.sales >= seller.goal ? 2000 : 0)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Money;
