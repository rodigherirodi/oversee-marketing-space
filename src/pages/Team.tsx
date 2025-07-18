import React, { useState } from 'react';
import { Search, Plus, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import TeamMemberCard from '@/components/TeamMemberCard';
import { useTeamMembers } from '@/hooks/useTeamMembers';

const Team = () => {
  const { teamMembers, searchMembers } = useTeamMembers();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
  const departments = Array.from(new Set(teamMembers.map(member => member.department)));
  
  // Stats
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const totalActiveProjects = teamMembers.reduce((sum, member) => sum + member.activeProjectsCount, 0);
  const totalCompletedProjects = teamMembers.reduce((sum, member) => sum + member.completedProjectsCount, 0);
  const averageLevel = Math.round(teamMembers.reduce((sum, member) => sum + member.level, 0) / teamMembers.length);

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
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Membro
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total de Membros</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {teamMembers.length}
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Membros Ativos</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {activeMembers}
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span className="text-sm text-muted-foreground">Projetos Ativos</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {totalActiveProjects}
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="text-sm text-muted-foreground">Nível Médio</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {averageLevel}
            </div>
          </div>
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
              member={member}
              onClick={() => console.log('Edit member:', member.id)}
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
            {(!searchQuery && departmentFilter === 'all' && statusFilter === 'all') && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Membro
              </Button>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Team;
