
import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  FileText, 
  Video, 
  Users, 
  Clock,
  Download,
  Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockOnboardingItems, OnboardingItem } from '@/data/culturaMockData';

const typeIcons = {
  document: FileText,
  video: Video,
  task: CheckCircle,
  meeting: Users
};

const typeColors = {
  document: 'bg-blue-100 text-blue-800',
  video: 'bg-red-100 text-red-800',
  task: 'bg-green-100 text-green-800',
  meeting: 'bg-purple-100 text-purple-800'
};

const Onboarding = () => {
  const [items, setItems] = useState<OnboardingItem[]>(mockOnboardingItems);
  
  const completedItems = items.filter(item => item.completed).length;
  const progress = (completedItems / items.length) * 100;

  const toggleItemCompletion = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Onboarding</h1>
        <p className="text-gray-600">Guia de integração para novos colaboradores</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso da Integração</CardTitle>
          <CardDescription>
            {completedItems} de {items.length} itens concluídos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% concluído
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-800">Bem-vindo(a) à nossa equipe! 🎉</CardTitle>
          <CardDescription className="text-pink-700">
            Estamos muito felizes em tê-lo(a) conosco. Este guia vai ajudá-lo(a) a se integrar 
            rapidamente à nossa cultura e processos. Siga os passos abaixo no seu próprio ritmo.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Onboarding Timeline */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline de Integração</h2>
        <div className="space-y-4">
          {items.map((item, index) => {
            const Icon = typeIcons[item.type];
            const isOverdue = item.dueDate && 
              new Date(item.dueDate) < new Date() && 
              !item.completed;
            
            return (
              <Card 
                key={item.id} 
                className={`transition-all ${
                  item.completed 
                    ? 'bg-green-50 border-green-200' 
                    : isOverdue 
                      ? 'bg-red-50 border-red-200'
                      : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <button
                      onClick={() => toggleItemCompletion(item.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <Badge className={typeColors[item.type]}>
                          {item.type === 'document' && 'Documento'}
                          {item.type === 'video' && 'Vídeo'}
                          {item.type === 'task' && 'Tarefa'}
                          {item.type === 'meeting' && 'Reunião'}
                        </Badge>
                        {item.duration && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </div>
                        )}
                      </div>
                      
                      <h3 className={`font-medium ${
                        item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      
                      <p className={`text-sm mt-1 ${
                        item.completed ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>

                      {item.dueDate && (
                        <div className={`text-sm mt-2 ${
                          isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                        }`}>
                          Prazo: {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                          {isOverdue && ' (Atrasado)'}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {item.type === 'document' && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      {item.type === 'video' && (
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos Adicionais</CardTitle>
          <CardDescription>
            Materiais extras para ajudar na sua integração
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-medium">Manual do Colaborador</h4>
                <p className="text-sm text-gray-600">Guia completo da empresa</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-medium">Conheça o Time</h4>
                <p className="text-sm text-gray-600">Perfis dos colaboradores</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
