
import React, { useState } from 'react';
import { useSupabaseProjects } from '@/hooks/useSupabaseProjects';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ProjectFormDialogProps {
  children: React.ReactNode;
}

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createProject, profiles, clients } = useSupabaseProjects();

  const [formData, setFormData] = useState({
    titulo: '',
    cliente_id: '',
    status: 'planejamento' as 'planejamento' | 'em_andamento' | 'em_revisao' | 'em_pausa' | 'concluido',
    prioridade: 'Média' as 'Alta' | 'Média' | 'Baixa',
    data_inicio: '',
    data_entrega: '',
    progresso: 0,
    equipe: '',
    responsavel: '',
    briefing: '',
    escopo: '',
    observacoes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Encontrar o nome do cliente selecionado
    const selectedClient = clients.find(client => client.id === formData.cliente_id);
    
    const project = await createProject({
      titulo: formData.titulo,
      cliente_id: formData.cliente_id || null,
      cliente: selectedClient?.nome || null,
      status: formData.status,
      prioridade: formData.prioridade,
      data_inicio: formData.data_inicio || null,
      data_entrega: formData.data_entrega || null,
      progresso: formData.progresso,
      equipe: formData.equipe || null,
      responsavel: formData.responsavel || null,
      briefing: formData.briefing || null,
      escopo: formData.escopo || null,
      observacoes: formData.observacoes || null,
      tags: [],
      materiais: null
    });

    if (project) {
      setIsOpen(false);
      setFormData({
        titulo: '',
        cliente_id: '',
        status: 'planejamento',
        prioridade: 'Média',
        data_inicio: '',
        data_entrega: '',
        progresso: 0,
        equipe: '',
        responsavel: '',
        briefing: '',
        escopo: '',
        observacoes: ''
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Projeto *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Digite o título do projeto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={formData.cliente_id} onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="briefing">Briefing</Label>
            <Textarea
              id="briefing"
              value={formData.briefing}
              onChange={(e) => setFormData(prev => ({ ...prev, briefing: e.target.value }))}
              placeholder="Descreva os objetivos do projeto..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="escopo">Escopo / Serviços Contratados</Label>
            <Textarea
              id="escopo"
              value={formData.escopo}
              onChange={(e) => setFormData(prev => ({ ...prev, escopo: e.target.value }))}
              placeholder="Liste todos os serviços e entregas..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="em_revisao">Em revisão</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="em_pausa">Em pausa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={formData.prioridade} onValueChange={(value: any) => setFormData(prev => ({ ...prev, prioridade: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progresso">Progresso (%)</Label>
              <Input
                id="progresso"
                type="number"
                min="0"
                max="100"
                value={formData.progresso}
                onChange={(e) => setFormData(prev => ({ ...prev, progresso: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_entrega">Data de Entrega</Label>
              <Input
                id="data_entrega"
                type="date"
                value={formData.data_entrega}
                onChange={(e) => setFormData(prev => ({ ...prev, data_entrega: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select value={formData.responsavel} onValueChange={(value) => setFormData(prev => ({ ...prev, responsavel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map(profile => (
                    <SelectItem key={profile.id} value={profile.name}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipe">Equipe</Label>
              <Input
                id="equipe"
                value={formData.equipe}
                onChange={(e) => setFormData(prev => ({ ...prev, equipe: e.target.value }))}
                placeholder="Nome1, Nome2, Nome3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Adicione observações importantes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
