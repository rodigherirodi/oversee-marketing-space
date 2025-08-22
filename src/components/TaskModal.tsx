
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ClientSelector } from '@/components/shared/ClientSelector';
import { ProjectSelector } from '@/components/shared/ProjectSelector';
import TeamMemberSelector from '@/components/TeamMemberSelector';
import { TaskFormData } from '@/types/database';

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
  editTask?: any;
}

const statusOptions = [
  { value: 'todo', label: 'A Fazer' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'review', label: 'Em Revisão' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
];

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

const squadOptions = [
  { value: 'operacao', label: 'Operação' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'desenvolvimento', label: 'Desenvolvimento' },
];

const typeOptions = [
  { value: 'task', label: 'Tarefa' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'improvement', label: 'Melhoria' },
  { value: 'research', label: 'Pesquisa' },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editTask,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'todo',
      prioridade: 'medium',
      squad: 'operacao',
      tipo: 'task',
      tags: [],
    },
  });

  const watchedClientId = watch('cliente_id');

  useEffect(() => {
    if (editTask) {
      reset({
        titulo: editTask.title || editTask.titulo,
        descricao: editTask.description || editTask.descricao,
        status: editTask.status,
        prioridade: editTask.priority || editTask.prioridade,
        data_entrega: editTask.dueDate ? new Date(editTask.dueDate) : 
                      editTask.data_entrega ? new Date(editTask.data_entrega) : undefined,
        projeto_id: editTask.project_id || editTask.projeto_id,
        cliente_id: editTask.client_id || editTask.cliente_id,
        responsavel: editTask.assignee_id || editTask.responsavel || '',
        squad: editTask.squad || 'operacao',
        tipo: editTask.type || editTask.tipo || 'task',
        tags: editTask.tags || [],
      });
      setSelectedClientId(editTask.client_id || editTask.cliente_id || '');
    } else {
      reset({
        status: 'todo',
        prioridade: 'medium',
        squad: 'operacao',
        tipo: 'task',
        tags: [],
      });
      setSelectedClientId('');
    }
  }, [editTask, reset]);

  useEffect(() => {
    if (watchedClientId !== selectedClientId) {
      setSelectedClientId(watchedClientId || '');
      // Clear project selection when client changes
      if (watchedClientId !== editTask?.cliente_id) {
        setValue('projeto_id', '');
      }
    }
  }, [watchedClientId, selectedClientId, setValue, editTask]);

  const onFormSubmit = async (data: TaskSchemaType) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data as TaskFormData);
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
      setSelectedClientId('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                {...register('titulo')}
                placeholder="Digite o título da tarefa"
                disabled={isSubmitting}
              />
              {errors.titulo && (
                <p className="text-sm text-destructive">{errors.titulo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={watch('status')} 
                onValueChange={(value) => setValue('status', value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Descreva a tarefa..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select 
                value={watch('prioridade')} 
                onValueChange={(value) => setValue('prioridade', value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data de Entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watch('data_entrega') && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('data_entrega') ? (
                      format(watch('data_entrega'), "PPP", { locale: ptBR })
                    ) : (
                      "Selecione uma data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watch('data_entrega')}
                    onSelect={(date) => setValue('data_entrega', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <ClientSelector
                value={watch('cliente_id')}
                onValueChange={(value) => setValue('cliente_id', value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label>Projeto</Label>
              <ProjectSelector
                value={watch('projeto_id')}
                onValueChange={(value) => setValue('projeto_id', value)}
                clientId={selectedClientId}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Responsável *</Label>
              <TeamMemberSelector
                value={watch('responsavel')}
                onValueChange={(value) => setValue('responsavel', value)}
                disabled={isSubmitting}
              />
              {errors.responsavel && (
                <p className="text-sm text-destructive">{errors.responsavel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Squad</Label>
              <Select 
                value={watch('squad')} 
                onValueChange={(value) => setValue('squad', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {squadOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select 
                value={watch('tipo')} 
                onValueChange={(value) => setValue('tipo', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : editTask ? 'Atualizar' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
