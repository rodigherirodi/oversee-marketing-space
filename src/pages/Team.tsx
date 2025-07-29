
import React, { useState } from 'react';
import { Search, Plus, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import TeamMemberCard from '@/components/TeamMemberCard';
import TeamMemberDialog from '@/components/TeamMemberDialog';
import TeamMemberForm from '@/components/TeamMemberForm';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useAuth } from '@/contexts/AuthContext';

const Team = () => {
  const { teamMembers, searchMembers, isLoading } = useTeamMembers();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  // Get filtered members
  const getFilteredMembers = () => {
    let filtered = searchMembers(searchQuery);
    
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(member => member.department === departmentFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }
    
    return filtered;
  };

  const filteredMembers = getFilteredMembers();
  
  // Get unique departments for filter
  const departments = Array.from(new Set(teamMembers.map(member => member.department).filter(Boolean)));

  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    setIsProfileOpen(true);
  };

  const handleNewMember = () => {
    if (!isAdmin) {
      return;
    }
    setIsCreateFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Time</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os membros da sua equipe e acompanhe o desempenho de cada um
            </p>
          </div>
          
          {isAdmin && (
            <Button onClick={handleNewMember}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Membro
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="vacation">Férias</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={{
                id: member.id,
                name: member.name,
                email: member.email,
                position: member.position || 'Sem cargo',
                department: member.department || 'Sem departamento',
                avatar: member.avatar || '/placeholder.svg',
                status: member.status || 'active',
                level: member.level || 1,
                points: member.points || 0,
                taskCompletionRate: member.task_completion_rate || 0,
                activeProjectsCount: member.active_projects_count || 0,
                completedProjectsCount: member.completed_projects_count || 0,
                hoursWorkedWeek: member.hours_worked_week || 0,
                createdAt: member.created_at,
                phone: member.phone || '',
                birthDate: member.birth_date || '',
                hireDate: member.hire_date || '',
                address: member.address || '',
                borderPattern: member.border_pattern || 'solid',
                borderColor: member.border_color || '#3B82F6',
              }}
              onClick={() => handleMemberClick(member)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum membro encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || departmentFilter !== 'all' || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros para encontrar o que procura.'
                : 'Adicione o primeiro membro da sua equipe para começar.'
              }
            </p>
            {(!searchQuery && departmentFilter === 'all' && statusFilter === 'all' && isAdmin) && (
              <Button onClick={handleNewMember}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Membro
              </Button>
            )}
          </div>
        )}

        {/* Team Member Profile Dialog */}
        {selectedMember && (
          <TeamMemberDialog
            member={{
              id: selectedMember.id,
              name: selectedMember.name,
              email: selectedMember.email,
              position: selectedMember.position || 'Sem cargo',
              department: selectedMember.department || 'Sem departamento',
              avatar: selectedMember.avatar || '/placeholder.svg',
              status: selectedMember.status || 'active',
              level: selectedMember.level || 1,
              points: selectedMember.points || 0,
              taskCompletionRate: selectedMember.task_completion_rate || 0,
              activeProjectsCount: selectedMember.active_projects_count || 0,
              completedProjectsCount: selectedMember.completed_projects_count || 0,
              hoursWorkedWeek: selectedMember.hours_worked_week || 0,
              createdAt: selectedMember.created_at,
              phone: selectedMember.phone || '',
              birthDate: selectedMember.birth_date || '',
              hireDate: selectedMember.hire_date || '',
              address: selectedMember.address || '',
              borderPattern: selectedMember.border_pattern || 'solid',
              borderColor: selectedMember.border_color || '#3B82F6',
            }}
            open={isProfileOpen}
            onOpenChange={setIsProfileOpen}
          />
        )}

        {/* Team Member Creation Form */}
        {isAdmin && (
          <TeamMemberForm
            open={isCreateFormOpen}
            onOpenChange={setIsCreateFormOpen}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default Team;
