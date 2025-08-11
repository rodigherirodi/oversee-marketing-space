
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MeetingFormData } from '@/hooks/useSupabaseClientMeetings';

const meetingFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  data_hora: z.string().min(1, 'Data e hora são obrigatórias'),
  tipo: z.enum(['alinhamento', 'aprovacao', 'planejamento', 'apresentacao', 'outro']).optional(),
  resumo: z.string().optional(),
  duracao: z.number().optional(),
  link_gravacao: z.string().url('Link deve ser uma URL válida').optional().or(z.literal('')),
  observacoes: z.string().optional(),
});

const meetingTypes = [
  { value: 'alinhamento', label: 'Alinhamento' },
  { value: 'aprovacao', label: 'Aprovação' },
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'apresentacao', label: 'Apresentação' },
  { value: 'outro', label: 'Outro' },
];

interface MeetingFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MeetingFormData) => void;
  meeting?: any;
}

export const MeetingFormDialog: React.FC<MeetingFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  meeting,
}) => {
  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      titulo: meeting?.titulo || '',
      data_hora: meeting?.data_hora ? new Date(meeting.data_hora).toISOString().slice(0, 16) : '',
      tipo: meeting?.tipo || 'alinhamento',
      resumo: meeting?.resumo || '',
      duracao: meeting?.duracao || undefined,
      link_gravacao: meeting?.link_gravacao || '',
      observacoes: meeting?.observacoes || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof meetingFormSchema>) => {
    const formData: MeetingFormData = {
      titulo: values.titulo,
      data_hora: values.data_hora,
      tipo: values.tipo,
      resumo: values.resumo || undefined,
      duracao: values.duracao || undefined,
      link_gravacao: values.link_gravacao || undefined,
      observacoes: values.observacoes || undefined,
    };
    onSubmit(formData);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {meeting ? 'Editar Reunião' : 'Nova Reunião'}
          </DialogTitle>
          <DialogDescription>
            {meeting ? 'Edite as informações da reunião' : 'Adicione uma nova reunião ao histórico'}
          </DialogDescription>
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
                    <Input {...field} placeholder="Título da reunião" />
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
                      <Input {...field} type="datetime-local" />
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
                        {meetingTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duracao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (minutos)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="60"
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="resumo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Breve resumo da reunião..." rows={3} />
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
                    <Textarea {...field} placeholder="Observações adicionais..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {meeting ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
