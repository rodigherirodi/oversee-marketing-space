
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSupabaseClients } from '@/hooks/useSupabaseClients';

const accessSchema = z.object({
  cliente_id: z.string().min(1, 'Cliente é obrigatório'),
  plataforma: z.string().min(1, 'Plataforma é obrigatória'),
  categoria: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  usuario: z.string().optional(),
  senha: z.string().optional(),
  notas: z.string().optional(),
  status: z.boolean().default(true),
});

type AccessFormData = z.infer<typeof accessSchema>;

interface AccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  access?: any;
  onSave: (data: AccessFormData) => Promise<void>;
}

const categories = [
  { value: 'social', label: 'Redes Sociais' },
  { value: 'ads', label: 'Anúncios' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'email', label: 'E-mail' },
  { value: 'hosting', label: 'Hospedagem' },
  { value: 'other', label: 'Outros' },
];

const AccessDialog: React.FC<AccessDialogProps> = ({
  open,
  onOpenChange,
  access,
  onSave,
}) => {
  const { clients } = useSupabaseClients();
  
  const form = useForm<AccessFormData>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      cliente_id: '',
      plataforma: '',
      categoria: '',
      url: '',
      usuario: '',
      senha: '',
      notas: '',
      status: true,
    },
  });

  useEffect(() => {
    if (access) {
      form.reset({
        cliente_id: access.cliente_id || '',
        plataforma: access.plataforma || '',
        categoria: access.categoria || '',
        url: access.url || '',
        usuario: access.usuario || '',
        senha: access.senha || '',
        notas: access.notas || '',
        status: access.status !== false,
      });
    } else {
      form.reset({
        cliente_id: '',
        plataforma: '',
        categoria: '',
        url: '',
        usuario: '',
        senha: '',
        notas: '',
        status: true,
      });
    }
  }, [access, form, open]);

  const handleSubmit = async (data: AccessFormData) => {
    try {
      await onSave(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar acesso:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {access ? 'Editar Acesso' : 'Adicionar Acesso'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cliente_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nome}
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
              name="plataforma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plataforma *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Google Analytics, WordPress" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://exemplo.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário/Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="usuario@exemplo.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Observações sobre este acesso..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Este acesso está ativo e funcional
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AccessDialog;
