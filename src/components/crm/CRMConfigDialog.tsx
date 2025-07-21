import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  GitBranch, 
  Tags, 
  Users,
  Palette
} from 'lucide-react';

interface CRMConfigDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CRMConfigDialog: React.FC<CRMConfigDialogProps> = ({
  open,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('pipelines');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações do CRM
          </DialogTitle>
          <DialogDescription>
            Personalize seu CRM de acordo com suas necessidades
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pipelines" className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Pipelines
            </TabsTrigger>
            <TabsTrigger value="stages" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Estágios
            </TabsTrigger>
            <TabsTrigger value="fields" className="flex items-center gap-2">
              <Tags className="w-4 h-4" />
              Campos
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipelines" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Pipelines</CardTitle>
                <CardDescription>
                  Configure os pipelines do seu CRM para diferentes tipos de negócio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {['Assessoria', 'Produtora', 'Consultoria'].map((pipeline) => (
                    <div key={pipeline} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{pipeline}</h4>
                        <p className="text-sm text-gray-600">Pipeline para serviços de {pipeline.toLowerCase()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Ativo</Badge>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  + Adicionar Pipeline
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estágios dos Pipelines</CardTitle>
                <CardDescription>
                  Personalize os estágios de cada pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {[
                    { name: 'Em Contato', color: 'bg-blue-500', probability: 25 },
                    { name: 'Reunião', color: 'bg-yellow-500', probability: 50 },
                    { name: 'Proposta Enviada', color: 'bg-purple-500', probability: 75 },
                    { name: 'Venda', color: 'bg-green-500', probability: 100 },
                    { name: 'Perdido', color: 'bg-red-500', probability: 0 },
                  ].map((stage) => (
                    <div key={stage.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                        <div>
                          <h4 className="font-medium">{stage.name}</h4>
                          <p className="text-sm text-gray-600">{stage.probability}% de probabilidade</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campos Personalizados</CardTitle>
                <CardDescription>
                  Configure campos adicionais para capturar informações específicas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {[
                    { name: 'Tipo de Empresa', type: 'Select', required: true },
                    { name: 'Número de Funcionários', type: 'Select', required: false },
                    { name: 'Urgência', type: 'Select', required: false },
                  ].map((field) => (
                    <div key={field.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{field.name}</h4>
                        <p className="text-sm text-gray-600">
                          Tipo: {field.type} {field.required && '• Obrigatório'}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  + Adicionar Campo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usuários e Permissões</CardTitle>
                <CardDescription>
                  Gerencie os usuários que podem acessar o CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {[
                    { name: 'Maria Santos', role: 'Administrador', active: true },
                    { name: 'Carlos Lima', role: 'Vendedor', active: true },
                    { name: 'Ana Silva', role: 'Vendedor', active: true },
                    { name: 'Pedro Costa', role: 'Vendedor', active: false },
                  ].map((user) => (
                    <div key={user.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.active ? 'default' : 'secondary'}>
                          {user.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  + Adicionar Usuário
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onClose}>
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
