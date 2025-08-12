
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MeetingFormData } from '@/hooks/useSupabaseClientMeetings';

const meetingSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  data_hora: z.string().min(1, 'Data e hora são obrigatórias'),
  tipo: z.enum(['alinhamento', 'aprovacao', 'planejamento', 'apresentacao', 'outro']).optional(),
  resumo: z.string().optional(),
  duracao: z.number().optional(),
  participantes: z.array(z.string()).optional(),
  link_gravacao: z.string().optional(),
  observacoes: z.string().optional(),
});

interface MeetingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MeetingFormData) => Promise<void>;
  initialData?: Partial<MeetingFormData & { data_hora: string; titulo: string; tipo: string; resumo: string; duracao: number; link_gravacao: string; observacoes: string; participantes: string[] }>;
  isEditing?: boolean;
}

const MeetingFormDialog: React.FC<MeetingFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const form = useForm<z.infer<typeof meetingSchema>>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      titulo: initialData?.titulo || '',
      data_hora: initialData?.data_hora ? new Date(initialData.data_hora).toISOString().slice(0, 16) : '',
      tipo: (initialData?.tipo as 'alinhamento' | 'aprovacao' | 'planejamento' | 'apresentacao' | 'outro') || 'alinhamento',
      resumo: initialData?.resumo || '',
      duracao: initialData?.duracao || undefined,
      link_gravacao: initialData?.link_gravacao || '',
      observacoes: initialData?.observacoes || '',
      participantes: initialData?.participantes || [],
    },
  });

  const handleSubmit = async (values: z.infer<typeof meetingSchema>) => {
    const submitData: MeetingFormData = {
      titulo: values.titulo,
      data_hora: values.data_hora,
      tipo: values.tipo,
      resumo: values.resumo,
      duracao: values.duracao,
      participantes: values.participantes,
      link_gravacao: values.link_gravacao,
      observacoes: values.observacoes,
    };
    
    await onSubmit(submitData);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Reunião' : 'Nova Reunião'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Reunião de alinhamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alinhamento">Alinhamento</SelectItem>
                        <SelectItem value="aprovacao">Aprovação</SelectItem>
                        <SelectItem value="planejamento">Planejamento</SelectItem>
                        <SelectItem value="apresentacao">Apresentação</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (minutos)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="60"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Resumo dos principais pontos discutidos..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link_gravacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link da Gravação</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Criar'} Reunião
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingFormDialog;
