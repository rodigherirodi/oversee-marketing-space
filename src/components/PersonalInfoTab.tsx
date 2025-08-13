import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TeamMember } from '@/types/entities';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, User } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEmergencyContact } from '@/hooks/useEmergencyContact';
import { EmergencyContactData } from '@/schemas/emergencyContactSchema';

interface PersonalInfoTabProps {
  member: TeamMember;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ member }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone || '',
    address: member.address || '',
    birth_date: member.birth_date || '',
    avatar: member.avatar || '',
  });

  const [emergencyContactData, setEmergencyContactData] = useState<EmergencyContactData>({
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
  });

  const { updateTeamMember } = useTeamMembers();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { fetchEmergencyContact, updateEmergencyContact, isLoading: emergencyLoading } = useEmergencyContact();

  const canEdit = isAdmin || user?.id === member.id;

  // Load emergency contact data on component mount
  useEffect(() => {
    const loadEmergencyContact = async () => {
      const data = await fetchEmergencyContact(member.id);
      setEmergencyContactData(data);
    };

    loadEmergencyContact();
  }, [member.id, fetchEmergencyContact]);

  const handleSave = async () => {
    try {
      await updateTeamMember(member.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      address: member.address || '',
      birth_date: member.birth_date || '',
      avatar: member.avatar || '',
    });
    setIsEditing(false);
  };

  const handleEmergencyContactSave = async () => {
    const result = await updateEmergencyContact(member.id, emergencyContactData);
    if (result.success) {
      // Data is already updated in state, UI will reflect immediately
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione um arquivo de imagem válido (JPG, PNG, GIF)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${member.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = data.publicUrl;
      
      // Update avatar in database
      await updateTeamMember(member.id, { avatar: avatarUrl });
      
      setEditData(prev => ({ ...prev, avatar: avatarUrl }));
      
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={editData.avatar || member.avatar} alt={member.name} />
            <AvatarFallback className="text-2xl">
              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          {canEdit && (
            <div className="absolute -bottom-2 -right-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <Button
                size="sm"
                variant="outline"
                className="rounded-full w-8 h-8 p-0"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-lg text-muted-foreground">{member.position}</p>
              <p className="text-sm text-muted-foreground">{member.department}</p>
            </div>
          )}
        </div>

        {canEdit && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} disabled={isUploading}>
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Email</p>
                {isEditing ? (
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Telefone</p>
                {isEditing ? (
                  <Input
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{member.phone || 'Não informado'}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Endereço</p>
                {isEditing ? (
                  <Input
                    value={editData.address}
                    onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Cidade, Estado"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{member.address || 'Não informado'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Data de Nascimento</p>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.birth_date}
                    onChange={(e) => setEditData(prev => ({ ...prev, birth_date: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {member.birth_date ? format(new Date(member.birth_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informado'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Data de Contratação</p>
                <p className="text-sm text-muted-foreground">
                  {member.hire_date ? format(new Date(member.hire_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Contato de Emergência</CardTitle>
            {canEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleEmergencyContactSave}
                disabled={emergencyLoading}
              >
                <Save className="w-4 h-4 mr-1" />
                Salvar Contato
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergency_name" className="text-sm font-medium">Nome</Label>
              {canEdit ? (
                <Input
                  id="emergency_name"
                  value={emergencyContactData.emergency_contact_name}
                  onChange={(e) => setEmergencyContactData(prev => ({ 
                    ...prev, 
                    emergency_contact_name: e.target.value 
                  }))}
                  placeholder="Nome completo"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  {emergencyContactData.emergency_contact_name || 'Não informado'}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="emergency_phone" className="text-sm font-medium">Telefone</Label>
              {canEdit ? (
                <InputMask
                  mask="(99) 99999-9999"
                  value={emergencyContactData.emergency_contact_phone}
                  onChange={(e) => setEmergencyContactData(prev => ({ 
                    ...prev, 
                    emergency_contact_phone: e.target.value 
                  }))}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="emergency_phone"
                      placeholder="(11) 99999-9999"
                      className="mt-1"
                    />
                  )}
                </InputMask>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  {emergencyContactData.emergency_contact_phone || 'Não informado'}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="emergency_relationship" className="text-sm font-medium">Parentesco</Label>
              {canEdit ? (
                <Input
                  id="emergency_relationship"
                  value={emergencyContactData.emergency_contact_relationship}
                  onChange={(e) => setEmergencyContactData(prev => ({ 
                    ...prev, 
                    emergency_contact_relationship: e.target.value 
                  }))}
                  placeholder="Ex: Mãe, Esposo(a)"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  {emergencyContactData.emergency_contact_relationship || 'Não informado'}
                </p>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="text-xs text-muted-foreground mt-2">
              * Nome é obrigatório quando telefone ou parentesco são preenchidos
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
