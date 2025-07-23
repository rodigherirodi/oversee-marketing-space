
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Check, Plus, UserPlus } from 'lucide-react';
import { mockTeamMembers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface TeamMemberSelectorProps {
  clientId: string;
}

export const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({ clientId }) => {
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { toast } = useToast();

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = () => {
    // In real app, this would save to backend
    toast({
      title: "Equipe atualizada",
      description: `${selectedMembers.length} membros selecionados para o cliente.`
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Gerenciar Equipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecionar Membros da Equipe</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Buscar membros..." />
          <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {mockTeamMembers.map((member) => (
              <CommandItem
                key={member.id}
                onSelect={() => handleMemberToggle(member.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                </div>
                {selectedMembers.includes(member.id) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
        <div className="flex justify-between items-center pt-4">
          <Badge variant="outline">
            {selectedMembers.length} selecionados
          </Badge>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
