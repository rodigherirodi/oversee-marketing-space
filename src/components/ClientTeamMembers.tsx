
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, X } from 'lucide-react';
import { mockTeamMembers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface ClientTeamMembersProps {
  clientId: string;
}

export const ClientTeamMembers: React.FC<ClientTeamMembersProps> = ({ clientId }) => {
  // Mock selected members for client - in real app this would come from API
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(['1', '3', '5']);
  const { toast } = useToast();

  const selectedMembers = mockTeamMembers.filter(member => 
    selectedMemberIds.includes(member.id)
  );

  const removeMember = (memberId: string) => {
    setSelectedMemberIds(prev => prev.filter(id => id !== memberId));
    toast({
      title: "Membro removido",
      description: "O membro foi removido da equipe do cliente."
    });
  };

  if (selectedMembers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum membro da equipe atribuído ainda.</p>
        <p className="text-sm">Use o botão "Gerenciar Equipe" para adicionar membros.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {selectedMembers.map((member) => (
        <Card key={member.id} className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 w-6 h-6 p-0"
            onClick={() => removeMember(member.id)}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{member.phone}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {member.department}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
