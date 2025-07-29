
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { transformTeamMemberData } from '@/utils/teamMemberUtils';
import PersonalInfoTab from '@/components/PersonalInfoTab';
import ProfessionalInfoTab from '@/components/ProfessionalInfoTab';
import ProductivityTab from '@/components/ProductivityTab';
import GamificationTab from '@/components/GamificationTab';

const TeamMemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { teamMembers, isLoading } = useTeamMembers();

  const member = teamMembers.find(m => m.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Membro não encontrado</h2>
          <p className="text-muted-foreground mb-4">O membro solicitado não foi encontrado.</p>
          <Button onClick={() => navigate('/team')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Time
          </Button>
        </div>
      </div>
    );
  }

  const transformedMember = transformTeamMemberData(member);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/team')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Time
        </Button>
        <div className="h-6 w-px bg-border" />
        <h1 className="text-3xl font-bold text-foreground">
          Perfil de {transformedMember.name}
        </h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="professional">Profissional</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
          <TabsTrigger value="gamification">Gamificação</TabsTrigger>
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
    </div>
  );
};

export default TeamMemberProfile;
