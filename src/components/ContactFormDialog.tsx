
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { ClientContactFormData } from '@/hooks/useSupabaseClientContacts';

interface ContactFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ClientContactFormData, 'cliente_id'>) => Promise<void>;
  contact?: any;
}

export const ContactFormDialog: React.FC<ContactFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  contact
}) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<Omit<ClientContactFormData, 'cliente_id'>>({
    defaultValues: {
      nome: contact?.nome || '',
      email: contact?.email || '',
      telefone: contact?.telefone || '',
      cargo: contact?.cargo || '',
      tipo: contact?.tipo || 'outro',
      is_primary: contact?.is_primary || false,
      observacoes: contact?.observacoes || '',
    }
  });

  React.useEffect(() => {
    if (contact) {
      setValue('nome', contact.nome || '');
      setValue('email', contact.email || '');
      setValue('telefone', contact.telefone || '');
      setValue('cargo', contact.cargo || '');
      setValue('tipo', contact.tipo || 'outro');
      setValue('is_primary', contact.is_primary || false);
      setValue('observacoes', contact.observacoes || '');
    } else {
      reset({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        tipo: 'outro',
        is_primary: false,
        observacoes: '',
      });
    }
  }, [contact, setValue, reset]);

  const handleFormSubmit = async (data: Omit<ClientContactFormData, 'cliente_id'>) => {
    await onSubmit(data);
    onClose();
  };

  const tipoValue = watch('tipo');
  const isPrimaryValue = watch('is_primary');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{contact ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              {...register('nome', { required: true })}
              placeholder="Nome completo"
            />
          </div>

          <div>
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              {...register('cargo')}
              placeholder="Ex: Diretor, Gerente..."
            />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de Contato</Label>
            <Select value={tipoValue} onValueChange={(value) => setValue('tipo', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="principal">Principal</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="operacional">Operacional</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              {...register('telefone')}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_primary"
              checked={isPrimaryValue}
              onCheckedChange={(checked) => setValue('is_primary', !!checked)}
            />
            <Label htmlFor="is_primary">Contato principal</Label>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {contact ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
