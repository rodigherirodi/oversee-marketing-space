import React, { useState } from 'react';
import { Project } from '@/types/entities';
import { 
  TestTube, 
  Plus, 
  Play, 
  Pause, 
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TestsTabProps {
  project: Project;
}

const TestsTab: React.FC<TestsTabProps> = ({ project }) => {
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    expectedResult: '',
    status: 'planned'
  });

  const tests = [
    {
      id: 1,
      title: 'Teste A/B - Landing Page Principal',
      description: 'Testar duas versões do botão CTA na landing page',
      status: 'running',
      expectedResult: 'Aumentar conversão em 15%',
      actualResult: 'Em andamento...',
      createdAt: '2024-01-20'
    },
    {
      id: 2,
      title: 'Teste de Copy - Email Marketing',
      description: 'Comparar diferentes subject lines nos emails',
      status: 'completed',
      expectedResult: 'Melhorar taxa de abertura',
      actualResult: 'Aumento de 23% na taxa de abertura',
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      title: 'Teste de Cores - Botão de Conversão',
      description: 'Testar botão azul vs botão verde',
      status: 'planned',
      expectedResult: 'Identificar melhor performance',
      actualResult: 'Não iniciado',
      createdAt: '2024-01-22'
    }
  ];

  const ideas = [
    {
      id: 1,
      title: 'Pop-up de Exit Intent',
      description: 'Implementar pop-up quando usuário tenta sair da página',
      category: 'Conversão',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Chat Bot Personalizado',
      description: 'Bot com respostas específicas do segmento do cliente',
      category: 'Experiência',
      priority: 'high'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      default:
        return <TestTube className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Em Execução';
      case 'completed': return 'Concluído';
      case 'paused': return 'Pausado';
      default: return 'Planejado';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddTest = () => {
    if (newTest.title && newTest.description) {
      console.log('Novo teste:', newTest);
      setNewTest({ title: '', description: '', expectedResult: '', status: 'planned' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tests Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Testes A/B e Experimentos
            </CardTitle>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Teste
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{test.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                      {getStatusText(test.status)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Resultado Esperado:</p>
                    <p className="text-sm text-gray-600">{test.expectedResult}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Resultado Atual:</p>
                    <p className="text-sm text-gray-600">{test.actualResult}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-gray-500">
                    Criado em {new Date(test.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Editar</Button>
                    {test.status === 'planned' && (
                      <Button size="sm">Iniciar Teste</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add new test form */}
          <div className="border-t pt-6 mt-6">
            <h5 className="font-medium text-gray-900 mb-4">Adicionar Novo Teste</h5>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Título do teste"
                value={newTest.title}
                onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Descrição do teste"
                value={newTest.description}
                onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <input
                type="text"
                placeholder="Resultado esperado"
                value={newTest.expectedResult}
                onChange={(e) => setNewTest({ ...newTest, expectedResult: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleAddTest}>Adicionar Teste</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Ideias e Brainstorming
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea) => (
              <div key={idea.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{idea.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    idea.priority === 'high' ? 'bg-red-100 text-red-700' :
                    idea.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {idea.priority === 'high' ? 'Alta' :
                     idea.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {idea.category}
                  </span>
                  <Button variant="ghost" size="sm">
                    Transformar em Teste
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-4">
            <Lightbulb className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Adicione suas ideias e insights para o projeto
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nova Ideia
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestsTab;
