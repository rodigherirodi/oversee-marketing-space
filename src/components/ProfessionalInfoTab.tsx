
import React, { useState } from 'react';
import { TeamMember } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, User, DollarSign, Award, Edit2, Save, X } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useAuth } from '@/contexts/AuthContext';

interface ProfessionalInfoTabProps {
  member: TeamMember;
}

const ProfessionalInfoTab: React.FC<ProfessionalInfoTabProps> = ({ member }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    position: member.position || '',
    department: member.department,
    hire_date: member.hire_date || '',
    level: member.level,
    status: member.status || 'active',
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
      position: member.position || '',
      department: member.department,
      hire_date: member.hire_date || '',
      level: member.level,
      status: member.status || 'active',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {canEdit && (
        <div className="flex justify-end gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cargo e Departamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Cargo Atual</p>
                {isEditing ? (
                  <Input
                    value={editData.position}
                    onChange={(e) => setEditData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="Ex: Desenvolvedor Frontend"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{member.position || 'Não informado'}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Departamento</p>
                {isEditing ? (
                  <Select 
                    value={editData.department} 
                    onValueChange={(value) => setEditData(prev => ({ ...prev, department: value as any }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operacao">Operação</SelectItem>
                      <SelectItem value="academy">Academy</SelectItem>
                      <SelectItem value="cultura">Cultura</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="gestao">Gestão</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">{member.department}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Status</p>
                {isEditing ? (
                  <Select 
                    value={editData.status} 
                    onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="vacation">Férias</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status === 'active' ? 'Ativo' : 
                     member.status === 'vacation' ? 'Férias' : 'Inativo'}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações de Carreira</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Data de Contratação</p>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.hire_date}
                    onChange={(e) => setEditData(prev => ({ ...prev, hire_date: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {member.hire_date ? new Date(member.hire_date).toLocaleDateString('pt-BR') : 'Não informado'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Nível</p>
                {isEditing ? (
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={editData.level}
                    onChange={(e) => setEditData(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">Nível {member.level}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Habilidades e Competências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {member.skills && member.skills.length > 0 ? (
              member.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma habilidade cadastrada</p>
            )}
          </div>
        </CardContent>
      </Card>

      {member.goals && member.goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metas e Objetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {member.goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">{goal}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfessionalInfoTab;
