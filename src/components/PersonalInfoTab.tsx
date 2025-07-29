
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TeamMember } from '@/types/entities';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalInfoTabProps {
  member: TeamMember;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ member }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone || '',
    address: member.address || '',
    birth_date: member.birth_date || '',
  });

  const { updateTeamMember } = useTeamMembers();
  const { user, isAdmin } = useAuth();

  const canEdit = isAdmin || user?.id === member.id;

  const handleSave = async () => {
    await updateTeamMember(member.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      address: member.address || '',
      birth_date: member.birth_date || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="text-2xl">
            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        
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
                <Button size="sm" onClick={handleSave}>
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
    </div>
  );
};

export default PersonalInfoTab;
