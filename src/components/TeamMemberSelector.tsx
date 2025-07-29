
import React, { useState } from 'react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useClientTeamMembers } from '@/hooks/useClientTeamMembers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, Plus, Search, X } from 'lucide-react';
import { TeamMember } from '@/types/entities';
import { transformTeamMemberData } from '@/utils/teamMemberUtils';

interface TeamMemberSelectorProps {
  clientId: string;
}

const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({ clientId }) => {
  const { clientTeamMembers, availableTeamMembers, addTeamMember, removeTeamMember } = useClientTeamMembers(clientId);
  const { searchMembers } = useTeamMembers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTeamMembers = searchQuery 
    ? searchMembers(searchQuery).filter(member => !clientTeamMembers.some(cm => cm.id === member.id))
    : availableTeamMembers;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Membros da Equipe</h3>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Membro
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {clientTeamMembers.map((member) => {
          const transformedMember = transformTeamMemberData(member);
          return (
            <div
              key={member.id}
              className="border rounded-lg p-4 flex items-start justify-between space-x-4 hover:border-primary transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={transformedMember.avatar} alt={transformedMember.name} />
                  <AvatarFallback>{transformedMember.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{transformedMember.name}</h4>
                  <p className="text-sm text-gray-500">{transformedMember.position}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTeamMember(member.id)}
              >
                <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
              </Button>
            </div>
          );
        })}
        
        {clientTeamMembers.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              Nenhum membro adicionado à equipe. Clique em "Adicionar Membro" para selecionar membros da sua equipe.
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Selecionar Membros da Equipe</DialogTitle>
          </DialogHeader>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, posição ou departamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {filteredTeamMembers.length > 0 ? (
              filteredTeamMembers.map((member) => (
                <TeamMemberItem 
                  key={member.id} 
                  member={transformTeamMemberData(member)} 
                  onAdd={() => {
                    addTeamMember(member.id);
                    setSearchQuery('');
                  }} 
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Nenhum membro encontrado para esta busca.' 
                    : 'Todos os membros já foram adicionados à equipe.'}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface TeamMemberItemProps {
  member: TeamMember;
  onAdd: () => void;
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({ member, onAdd }) => {
  return (
    <div className="border rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{member.name}</h4>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500">{member.position}</p>
            <Badge variant="outline" className="text-xs">
              {member.department}
            </Badge>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        <span className="ml-1">Adicionar</span>
      </Button>
    </div>
  );
};

export default TeamMemberSelector;
