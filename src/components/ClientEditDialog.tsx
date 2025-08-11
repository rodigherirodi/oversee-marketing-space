
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client } from '@/types/entities';
import { useProfiles } from '@/hooks/useProfiles';
import ImageUpload from '@/components/ImageUpload';

interface ClientEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onSave: (client: Client) => Promise<any>;
}

const ClientEditDialog: React.FC<ClientEditDialogProps> = ({
  open,
  onOpenChange,
  client,
  onSave,
}) => {
  const [formData, setFormData] = useState<Client>(client);
  const [isSaving, setIsSaving] = useState(false);
  const { profiles } = useProfiles();

  useEffect(() => {
    setFormData(client);
  }, [client]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof Client, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Logo do Cliente</Label>
            <ImageUpload
              value={formData.logo}
              onChange={(value) => handleInputChange('logo', value)}
              fallbackText={formData.name.charAt(0)}
              clientId={formData.id}
            />
          </div>

          <div>
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="segment">Segmento</Label>
            <Input
              id="segment"
              value={formData.segment}
              onChange={(e) => handleInputChange('segment', e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="description">Sobre o cliente</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Breve descrição sobre o cliente..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="size">Porte da Empresa</Label>
            <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEI">Microempresa</SelectItem>
                <SelectItem value="PME">Pequena/Média Empresa</SelectItem>
                <SelectItem value="large">Grande Empresa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="onboarding">Prospect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="temperature">Temperatura</Label>
            <Select value={formData.temperature} onValueChange={(value) => handleInputChange('temperature', value)}>
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
            <Label htmlFor="contractType">Tipo de Contrato</Label>
            <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
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
            <Label htmlFor="responsibleManager">Gestor Responsável</Label>
            <Select 
              value={formData.responsibleManager || ''} 
              onValueChange={(value) => handleInputChange('responsibleManager', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um gestor" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name} - {profile.position || profile.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="entryDate">Data de Entrada</Label>
            <Input
              id="entryDate"
              type="date"
              value={formData.entryDate?.split('T')[0] || ''}
              onChange={(e) => handleInputChange('entryDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="nps">NPS Atual</Label>
            <Input
              id="nps"
              type="number"
              min="0"
              max="10"
              value={formData.nps || ''}
              onChange={(e) => handleInputChange('nps', parseInt(e.target.value))}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.socialMedia?.facebook || ''}
              onChange={(e) => handleInputChange('socialMedia', { 
                ...formData.socialMedia, 
                facebook: e.target.value 
              })}
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.socialMedia?.instagram || ''}
              onChange={(e) => handleInputChange('socialMedia', { 
                ...formData.socialMedia, 
                instagram: e.target.value 
              })}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.socialMedia?.linkedin || ''}
              onChange={(e) => handleInputChange('socialMedia', { 
                ...formData.socialMedia, 
                linkedin: e.target.value 
              })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientEditDialog;
