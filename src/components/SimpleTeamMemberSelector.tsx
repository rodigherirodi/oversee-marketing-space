
import React from 'react';
import { Input } from '@/components/ui/input';

interface SimpleTeamMemberSelectorProps {
  selectedMember: string;
  onSelectMember: (memberId: string) => void;
  disabled?: boolean;
}

const SimpleTeamMemberSelector: React.FC<SimpleTeamMemberSelectorProps> = ({
  selectedMember,
  onSelectMember,
  disabled = false
}) => {
  return (
    <Input
      value={selectedMember}
      onChange={(e) => onSelectMember(e.target.value)}
      placeholder="Digite o ID do responsável"
      disabled={disabled}
    />
  );
};

export default SimpleTeamMemberSelector;
