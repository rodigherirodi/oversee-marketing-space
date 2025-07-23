
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TeamMember } from '@/types/entities';
import { MeetingHistory, MeetingFormData } from '@/types/client-history';
import { useMeetingHistory } from '@/hooks/useMeetingHistory';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeetingHistoryTable } from '@/components/client/MeetingHistoryTable';
import { MeetingFormDialog } from '@/components/client/MeetingFormDialog';
import { CriticalTasksCard } from '@/components/client/CriticalTasksCard';
import { TaskProvider } from '@/contexts/TaskContext';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface PersonalInfoTabProps {
  member: TeamMember;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ member }) => {
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useMeetingHistory('1'); // Using client ID '1'
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingHistory | undefined>();

  const handleAddMeeting = () => {
    setEditingMeeting(undefined);
    setIsDialogOpen(true);
  };

  const handleEditMeeting = (meeting: MeetingHistory) => {
    setEditingMeeting(meeting);
    setIsDialogOpen(true);
  };

  const handleSubmitMeeting = (data: MeetingFormData) => {
    if (editingMeeting) {
      updateMeeting(editingMeeting.id, data);
    } else {
      addMeeting(data);
    }
    setIsDialogOpen(false);
    setEditingMeeting(undefined);
  };

  const handleDeleteMeeting = (id: string) => {
    deleteMeeting(id);
  };

  return (
    <TaskProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="text-2xl">
              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <p className="text-lg text-muted-foreground">{member.position}</p>
            <p className="text-sm text-muted-foreground">{member.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              
              {member.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{member.phone}</p>
                  </div>
                </div>
              )}
              
              {member.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">{member.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {member.birthDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Data de Nascimento</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(member.birthDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Data de Contratação</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(member.hireDate), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meeting History Section */}
        <MeetingHistoryTable
          meetings={meetings}
          onAdd={handleAddMeeting}
          onEdit={handleEditMeeting}
          onDelete={handleDeleteMeeting}
        />

        {/* Critical Tasks Section */}
        <CriticalTasksCard clientId="1" />

        {/* Meeting Form Dialog */}
        <MeetingFormDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingMeeting(undefined);
          }}
          onSubmit={handleSubmitMeeting}
          meeting={editingMeeting}
        />
      </div>
    </TaskProvider>
  );
};

export default PersonalInfoTab;
