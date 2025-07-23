
import { useState } from 'react';
import { TeamMember } from '@/types/entities';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { toast } from '@/components/ui/use-toast';

export const useClientTeamMembers = (clientId: string) => {
  const { teamMembers } = useTeamMembers();
  const [clientTeamMemberIds, setClientTeamMemberIds] = useState<string[]>(['member-1', 'member-3']);
  
  const clientTeamMembers = teamMembers.filter(member => 
    clientTeamMemberIds.includes(member.id)
  );
  
  const availableTeamMembers = teamMembers.filter(member => 
    !clientTeamMemberIds.includes(member.id)
  );

  const addTeamMember = (memberId: string) => {
    if (clientTeamMemberIds.includes(memberId)) {
      toast({
        title: "Membro já adicionado",
        description: "Este membro já faz parte da equipe deste cliente."
      });
      return;
    }
    
    setClientTeamMemberIds(prev => [...prev, memberId]);
    toast({
      title: "Membro adicionado",
      description: "Membro adicionado à equipe com sucesso."
    });
  };

  const removeTeamMember = (memberId: string) => {
    setClientTeamMemberIds(prev => prev.filter(id => id !== memberId));
    toast({
      title: "Membro removido",
      description: "Membro removido da equipe com sucesso."
    });
  };

  return {
    clientTeamMembers,
    availableTeamMembers,
    addTeamMember,
    removeTeamMember
  };
};
