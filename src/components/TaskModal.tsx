import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TaskDTO, TaskFormData } from '@/types/database';
import { ClientSelector } from '@/components/shared/ClientSelector';
import { ProjectSelector } from '@/components/shared/ProjectSelector';
import SimpleTeamMemberSelector from '@/components/SimpleTeamMemberSelector';

const taskSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed', 'cancelled']),
  prioridade: z.enum(['low', 'medium', 'high']),
  data_entrega: z.date().optional(),
  projeto_id: z.string().optional(),
  cliente_id: z.string().optional(),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  squad: z.string().min(1, 'Squad é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  tags: z.array(z.string()).default([]),
});

type TaskSchemaType = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  editTask?: TaskDTO | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editTask
}) => {
  const [currentTag, setCurrentTag] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      status: 'todo',
      prioridade: 'medium',
      responsavel: '',
      squad: 'operacao',
      tipo: 'task',
      tags: [],
    }
  });

  const watchedTags = watch('tags') || [];
  const watchedDueDate = watch('data_entrega');

  useEffect(() => {
    if (editTask) {
      reset({
        titulo: editTask.titulo || '',
        descricao: editTask.descricao || '',
        status: editTask.status || 'todo',
        prioridade: editTask.prioridade || 'medium',
        data_entrega: editTask.data_entrega ? new Date(editTask.data_entrega) : undefined,
        projeto_id: editTask.projeto_id || '',
        cliente_id: editTask.cliente_id || '',
        responsavel: editTask.responsavel || '',
        squad: editTask.squad || 'operacao',
        tipo: editTask.tipo || 'task',
        tags: editTask.tags || [],
      });
      setSelectedClientId(editTask.cliente_id || '');
    } else {
      reset({
        titulo: '',
        descricao: '',
        status: 'todo',
        prioridade: 'medium',
        responsavel: '',
        squad: 'operacao',
        tipo: 'task',
        tags: [],
      });
      setSelectedClientId('');
    }
  }, [editTask, reset]);

  const handleFormSubmit = async (data: TaskSchemaType) => {
    try {
      const formData: TaskFormData = {
        titulo: data.titulo,
        status: data.status,
        prioridade: data.prioridade,
        responsavel: data.responsavel,
        squad: data.squad,
        tipo: data.tipo,
        tags: data.tags || [],
        descricao: data.descricao,
        data_entrega: data.data_entrega,
        projeto_id: data.projeto_id,
        cliente_id: data.cliente_id,
      };
      
      await onSubmit(formData);
      toast.success(editTask ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar tarefa');
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !watchedTags.includes(currentTag.trim())) {
      const newTags = [...watchedTags, currentTag.trim()];
      setValue('tags', newTags);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = watchedTags.filter(tag => tag !== tagToRemove);
    setValue('tags', newTags);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              {...register('titulo')}
              placeholder="Digite o título da tarefa"
            />
            {errors.titulo && (
              <p className="text-sm text-red-500">{errors.titulo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Descreva a tarefa..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: any) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="review">Em Revisão</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={watch('prioridade')}
                onValueChange={(value: any) => setValue('prioridade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <ClientSelector
                value={selectedClientId}
                onValueChange={(clientId) => {
                  setSelectedClientId(clientId);
                  setValue('cliente_id', clientId);
                  setValue('projeto_id', '');
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Projeto</Label>
              <ProjectSelector
                clientId={selectedClientId}
                value={watch('projeto_id') || ''}
                onValueChange={(projectId) => setValue('projeto_id', projectId)}
                disabled={!selectedClientId}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Responsável *</Label>
            <SimpleTeamMemberSelector
              selectedMember={watch('responsavel')}
              onSelectMember={(memberId) => setValue('responsavel', memberId)}
            />
            {errors.responsavel && (
              <p className="text-sm text-red-500">{errors.responsavel.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Squad *</Label>
              <Select
                value={watch('squad')}
                onValueChange={(value) => setValue('squad', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a squad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operacao">Operação</SelectItem>
                  <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select
                value={watch('tipo')}
                onValueChange={(value) => setValue('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Tarefa</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="improvement">Melhoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data de Entrega</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !watchedDueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedDueDate ? (
                    format(watchedDueDate, 'dd/MM/yyyy', { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watchedDueDate}
                  onSelect={(date) => setValue('data_entrega', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Digite uma tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {watchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {watchedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : editTask ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
