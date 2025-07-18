
import React, { useState } from 'react';
import { Project } from '@/types/entities';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Plus,
  Upload,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResultsTabProps {
  project: Project;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ project }) => {
  const [newKpi, setNewKpi] = useState({ name: '', target: '', current: '' });

  const kpis = [
    {
      id: 1,
      name: 'Conversão do Site',
      target: '5%',
      current: '3.2%',
      status: 'warning'
    },
    {
      id: 2,
      name: 'CTR das Campanhas',
      target: '2.5%',
      current: '3.1%',
      status: 'success'
    },
    {
      id: 3,
      name: 'Cost per Click',
      target: 'R$ 2,50',
      current: 'R$ 2,10',
      status: 'success'
    }
  ];

  const results = [
    {
      id: 1,
      period: 'Janeiro 2024',
      metric: 'Leads Qualificados',
      value: '127',
      previousValue: '89',
      change: '+42.7%'
    },
    {
      id: 2,
      period: 'Janeiro 2024',
      metric: 'Impressões',
      value: '45.2K',
      previousValue: '38.1K',
      change: '+18.6%'
    }
  ];

  const handleAddKpi = () => {
    if (newKpi.name && newKpi.target) {
      console.log('Novo KPI:', newKpi);
      setNewKpi({ name: '', target: '', current: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              KPIs Definidos
            </CardTitle>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo KPI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {kpis.map((kpi) => (
              <div 
                key={kpi.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  kpi.status === 'success' 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-yellow-50 border-yellow-400'
                }`}
              >
                <h4 className="font-medium text-gray-900">{kpi.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-sm text-gray-600">Meta: {kpi.target}</p>
                    <p className="text-lg font-semibold">{kpi.current}</p>
                  </div>
                  <TrendingUp 
                    className={`w-5 h-5 ${
                      kpi.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                    }`} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add new KPI form */}
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Adicionar Novo KPI</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nome do KPI"
                value={newKpi.name}
                onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Meta"
                value={newKpi.target}
                onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Valor atual"
                value={newKpi.current}
                onChange={(e) => setNewKpi({ ...newKpi, current: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={handleAddKpi} size="sm" className="mt-3">
              Adicionar KPI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resultados Parciais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{result.metric}</p>
                    <p className="text-sm text-gray-600">{result.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{result.value}</p>
                    <p className="text-sm text-green-600">{result.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboards e Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Google Analytics</p>
                  <p className="text-sm text-gray-600">Relatório de performance</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Facebook Ads</p>
                  <p className="text-sm text-gray-600">Dashboard de campanhas</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Faça upload de prints de dashboards
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Selecionar arquivo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Observações de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            placeholder="Adicione observações sobre a performance do projeto..."
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <Button className="mt-3">Salvar Observações</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsTab;
