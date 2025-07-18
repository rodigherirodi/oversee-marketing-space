
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUpload from './ImageUpload';
import { Client } from '@/types/entities';
import { useToast } from '@/hooks/use-toast';

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: (client: Omit<Client, 'id' | 'createdAt'>) => void;
}

type FormData = Omit<Client, 'id' | 'createdAt'>;

const ClientFormDialog: React.FC<ClientFormDialogProps> = ({ open, onOpenChange, onClientAdded }) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      status: 'onboarding',
      size: 'MEI',
      contractType: 'recurring',
      temperature: 'warm',
      entryDate: new Date().toISOString().split('T')[0],
    }
  });

  const logo = watch('logo');

  const onSubmit = (data: FormData) => {
    try {
      onClientAdded(data);
      toast({
        title: 'Cliente cadastrado!',
        description: 'O novo cliente foi adicionado com sucesso.',
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao cadastrar o cliente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Empresa *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Nome é obrigatório' })}
                    placeholder="Ex: Tech Solutions Ltda"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="segment">Segmento *</Label>
                  <Input
                    id="segment"
                    {...register('segment', { required: 'Segmento é obrigatório' })}
                    placeholder="Ex: Tecnologia"
                  />
                  {errors.segment && <p className="text-sm text-red-500">{errors.segment.message}</p>}
                </div>
              </div>

              <div>
                <Label>Logo da Empresa</Label>
                <ImageUpload
                  value={logo}
                  onChange={(value) => setValue('logo', value)}
                  fallbackText={watch('name')?.charAt(0) || 'L'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={watch('status')} onValueChange={(value) => setValue('status', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Porte da Empresa</Label>
                  <Select value={watch('size')} onValueChange={(value) => setValue('size', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEI">Microempreendedor Individual</SelectItem>
                      <SelectItem value="PME">Pequena e Média Empresa</SelectItem>
                      <SelectItem value="large">Grande Porte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    {...register('address', { required: 'Endereço é obrigatório' })}
                    placeholder="Rua, número, cidade - UF"
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    {...register('website')}
                    placeholder="https://www.exemplo.com.br"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contatos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Contato Principal</h4>
                  <div>
                    <Label htmlFor="primaryContact.name">Nome *</Label>
                    <Input
                      id="primaryContact.name"
                      {...register('primaryContact.name', { required: 'Nome do contato é obrigatório' })}
                      placeholder="Nome do responsável"
                    />
                    {errors.primaryContact?.name && <p className="text-sm text-red-500">{errors.primaryContact.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="primaryContact.email">Email *</Label>
                    <Input
                      id="primaryContact.email"
                      type="email"
                      {...register('primaryContact.email', { required: 'Email é obrigatório' })}
                      placeholder="email@exemplo.com"
                    />
                    {errors.primaryContact?.email && <p className="text-sm text-red-500">{errors.primaryContact.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="primaryContact.phone">Telefone *</Label>
                    <Input
                      id="primaryContact.phone"
                      {...register('primaryContact.phone', { required: 'Telefone é obrigatório' })}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.primaryContact?.phone && <p className="text-sm text-red-500">{errors.primaryContact.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Contato Financeiro</h4>
                  <div>
                    <Label htmlFor="financialContact.name">Nome *</Label>
                    <Input
                      id="financialContact.name"
                      {...register('financialContact.name', { required: 'Nome do contato financeiro é obrigatório' })}
                      placeholder="Nome do responsável financeiro"
                    />
                    {errors.financialContact?.name && <p className="text-sm text-red-500">{errors.financialContact.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="financialContact.email">Email *</Label>
                    <Input
                      id="financialContact.email"
                      type="email"
                      {...register('financialContact.email', { required: 'Email financeiro é obrigatório' })}
                      placeholder="financeiro@exemplo.com"
                    />
                    {errors.financialContact?.email && <p className="text-sm text-red-500">{errors.financialContact.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="financialContact.phone">Telefone *</Label>
                    <Input
                      id="financialContact.phone"
                      {...register('financialContact.phone', { required: 'Telefone financeiro é obrigatório' })}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.financialContact?.phone && <p className="text-sm text-red-500">{errors.financialContact.phone.message}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Comerciais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Comerciais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contractType">Tipo de Contrato</Label>
                  <Select value={watch('contractType')} onValueChange={(value) => setValue('contractType', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">Recorrente</SelectItem>
                      <SelectItem value="project">Projeto</SelectItem>
                      <SelectItem value="one-time">Pontual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="temperature">Temperatura</Label>
                  <Select value={watch('temperature')} onValueChange={(value) => setValue('temperature', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cold">Frio</SelectItem>
                      <SelectItem value="warm">Morno</SelectItem>
                      <SelectItem value="hot">Quente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="entryDate">Data de Entrada</Label>
                  <Input
                    id="entryDate"
                    type="date"
                    {...register('entryDate', { required: 'Data de entrada é obrigatória' })}
                  />
                  {errors.entryDate && <p className="text-sm text-red-500">{errors.entryDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsibleManager">Responsável *</Label>
                  <Input
                    id="responsibleManager"
                    {...register('responsibleManager', { required: 'Responsável é obrigatório' })}
                    placeholder="Nome do gerente responsável"
                  />
                  {errors.responsibleManager && <p className="text-sm text-red-500">{errors.responsibleManager.message}</p>}
                </div>

                <div>
                  <Label htmlFor="nps">NPS (0-10)</Label>
                  <Input
                    id="nps"
                    type="number"
                    min="0"
                    max="10"
                    {...register('nps', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'NPS deve ser entre 0 e 10' },
                      max: { value: 10, message: 'NPS deve ser entre 0 e 10' }
                    })}
                    placeholder="8"
                  />
                  {errors.nps && <p className="text-sm text-red-500">{errors.nps.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Redes Sociais (Opcional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="socialMedia.facebook">Facebook</Label>
                  <Input
                    id="socialMedia.facebook"
                    {...register('socialMedia.facebook')}
                    placeholder="https://facebook.com/empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="socialMedia.instagram">Instagram</Label>
                  <Input
                    id="socialMedia.instagram"
                    {...register('socialMedia.instagram')}
                    placeholder="https://instagram.com/empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="socialMedia.linkedin">LinkedIn</Label>
                  <Input
                    id="socialMedia.linkedin"
                    {...register('socialMedia.linkedin')}
                    placeholder="https://linkedin.com/company/empresa"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Cadastrar Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
