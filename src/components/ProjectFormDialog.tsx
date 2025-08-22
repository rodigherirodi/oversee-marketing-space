
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ProjectDTO, ProjectFormData } from '@/types/database';
import { ClientSelector } from '@/components/shared/ClientSelector';

const projectSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  cliente_id: z.string().optional(),
  status: z.enum(['planejamento', 'em_andamento', 'em_revisao', 'em_pausa', 'concluido']),
  prioridade: z.enum(['Alta', 'Média', 'Baixa']).optional(),
  data_inicio: z.date().optional(),
  data_entrega: z.date().optional(),
  progresso: z.number().min(0).max(100),
  equipe: z.string().optional(),
  responsavel: z.string().optional(),
  briefing: z.string().optional(),
  escopo: z.string().optional(),
  observacoes: z.string().optional(),
});

type ProjectSchemaType = z.infer<typeof projectSchema>;

interface ProjectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  editProject?: ProjectDTO | null;
}

export const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editProject
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      titulo: '',
      status: 'planejamento',
      prioridade: 'Média',
      progresso: 0,
    }
  });

  const watchedStartDate = watch('data_inicio');
  const watchedEndDate = watch('data_entrega');

  useEffect(() => {
    if (editProject) {
      reset({
        titulo: editProject.titulo || '',
        cliente_id: editProject.cliente_id || '',
        status: editProject.status || 'planejamento',
        prioridade: editProject.prioridade || 'Média',
        data_inicio: editProject.data_inicio ? new Date(editProject.data_inicio) : undefined,
        data_entrega: editProject.data_entrega ? new Date(editProject.data_entrega) : undefined,
        progresso: editProject.progresso || 0,
        equipe: editProject.equipe || '',
        responsavel: editProject.responsavel || '',
        briefing: editProject.briefing || '',
        escopo: editProject.escopo || '',
        observacoes: editProject.observacoes || '',
      });
    } else {
      reset({
        titulo: '',
        status: 'planejamento',
        prioridade: 'Média',
        progresso: 0,
      });
    }
  }, [editProject, reset]);

  const handleFormSubmit = async (data: ProjectSchemaType) => {
    try {
      const formData: ProjectFormData = {
        titulo: data.titulo,
        cliente_id: data.cliente_id,
        status: data.status,
        prioridade: data.prioridade,
        data_inicio: data.data_inicio,
        data_entrega: data.data_entrega,
        progresso: data.progresso,
        equipe: data.equipe,
        responsavel: data.responsavel,
        briefing: data.briefing,
        escopo: data.escopo,
        observacoes: data.observacoes,
      };
      
      await onSubmit(formData);
      toast.success(editProject ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar projeto');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editProject ? 'Editar Projeto' : 'Novo Projeto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              {...register('titulo')}
              placeholder="Digite o título do projeto"
            />
            {errors.titulo && (
              <p className="text-sm text-red-500">{errors.titulo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Cliente</Label>
            <ClientSelector
              value={watch('cliente_id') || ''}
              onValueChange={(clientId) => setValue('cliente_id', clientId)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="em_revisao">Em Revisão</SelectItem>
                  <SelectItem value="em_pausa">Em Pausa</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={watch('prioridade')}
                onValueChange={(value) => setValue('prioridade', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !watchedStartDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedStartDate ? (
                      format(watchedStartDate, 'dd/MM/yyyy', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watchedStartDate}
                    onSelect={(date) => setValue('data_inicio', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !watchedEndDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedEndDate ? (
                      format(watchedEndDate, 'dd/MM/yyyy', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watchedEndDate}
                    onSelect={(date) => setValue('data_entrega', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="progresso">Progresso (%)</Label>
            <Input
              id="progresso"
              type="number"
              min="0"
              max="100"
              {...register('progresso', { valueAsNumber: true })}
              placeholder="0"
            />
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
              {isSubmitting ? 'Salvando...' : editProject ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
