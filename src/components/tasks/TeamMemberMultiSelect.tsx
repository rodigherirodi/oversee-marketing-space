
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Search } from 'lucide-react';
import { mockTeamMembers } from '@/data/mockData';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TeamMemberMultiSelectProps {
  selectedMembers: string[];
  onChange: (members: string[]) => void;
  placeholder?: string;
  maxDisplay?: number;
}

export const TeamMemberMultiSelect: React.FC<TeamMemberMultiSelectProps> = ({
  selectedMembers,
  onChange,
  placeholder = "Selecionar membros...",
  maxDisplay = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = mockTeamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedMembers.includes(member.name)
  );

  const handleMemberToggle = (memberName: string) => {
    if (selectedMembers.includes(memberName)) {
      onChange(selectedMembers.filter(m => m !== memberName));
    } else {
      onChange([...selectedMembers, memberName]);
    }
  };

  const removeMember = (memberName: string) => {
    onChange(selectedMembers.filter(m => m !== memberName));
  };

  const getMemberInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-auto min-h-[2.5rem] px-3 py-2"
          >
            {selectedMembers.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedMembers.slice(0, maxDisplay).map((memberName) => (
                  <Badge
                    key={memberName}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      {getMemberInitials(memberName)}
                    </div>
                    <span className="text-xs">{memberName.split(' ')[0]}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMember(memberName);
                      }}
                    />
                  </Badge>
                ))}
                {selectedMembers.length > maxDisplay && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedMembers.length - maxDisplay}
                  </Badge>
                )}
              </div>
            )}
            <Plus className="w-4 h-4 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar membros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMemberToggle(member.name)}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getMemberInitials(member.name)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-gray-500">{member.position}</div>
                </div>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="p-3 text-center text-gray-500 text-sm">
                Nenhum membro encontrado
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected members display */}
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMembers.map((memberName) => (
            <Badge
              key={memberName}
              variant="outline"
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {getMemberInitials(memberName)}
              </div>
              <span>{memberName}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => removeMember(memberName)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
