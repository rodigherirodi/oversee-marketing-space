
import React from 'react';
import { TeamMember } from '@/types/entities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalInfoTab from './PersonalInfoTab';
import ProfessionalInfoTab from './ProfessionalInfoTab';
import ProductivityTab from './ProductivityTab';
import GamificationTab from './GamificationTab';
import { transformTeamMemberData } from '@/utils/teamMemberUtils';

interface TeamMemberDialogProps {
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamMemberDialog: React.FC<TeamMemberDialogProps> = ({
  member,
  open,
  onOpenChange,
}) => {
  // Transformar os dados para garantir compatibilidade
  const transformedMember = transformTeamMemberData(member);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Perfil de {transformedMember.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Pessoal</TabsTrigger>
            <TabsTrigger value="professional">Profissional</TabsTrigger>
            <TabsTrigger value="productivity">Produtividade</TabsTrigger>
            <TabsTrigger value="gamification">Cargo & Gamificação</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <PersonalInfoTab member={transformedMember} />
          </TabsContent>

          <TabsContent value="professional" className="mt-6">
            <ProfessionalInfoTab member={transformedMember} />
          </TabsContent>

          <TabsContent value="productivity" className="mt-6">
            <ProductivityTab member={transformedMember} />
          </TabsContent>

          <TabsContent value="gamification" className="mt-6">
            <GamificationTab member={transformedMember} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDialog;
