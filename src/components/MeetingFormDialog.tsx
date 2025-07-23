
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
import { Meeting, MeetingFormData } from '@/types/client-history';

const meetingFormSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  type: z.enum(['alinhamento', 'aprovacao', 'planejamento', 'apresentacao', 'outro']),
  summary: z.string().min(5, 'Resumo deve ter pelo menos 5 caracteres'),
  participants: z.array(z.string()).default([]),
  duration: z.string().min(1, 'Duração é obrigatória'),
  link: z.string().url('Link deve ser uma URL válida').optional().or(z.literal('')),
  notes: z.string().optional(),
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
  meeting?: Meeting;
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
      date: meeting?.date || '',
      type: meeting?.type || 'alinhamento',
      summary: meeting?.summary || '',
      participants: meeting?.participants || [],
      duration: meeting?.duration || '',
      link: meeting?.link || '',
      notes: meeting?.notes || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof meetingFormSchema>) => {
    const formData: MeetingFormData = {
      ...values,
      participants: values.participants || [],
      link: values.link || undefined,
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 1h30min" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da Reunião</FormLabel>
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
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Breve descrição da reunião" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Anotações adicionais..." rows={3} />
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
