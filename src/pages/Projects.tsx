
import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ProjectFormDialog from '@/components/ProjectFormDialog';
import { useSupabaseProjects } from '@/hooks/useSupabaseProjects';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, loading } = useSupabaseProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejamento': return 'bg-gray-100 text-gray-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'em_revisao': return 'bg-purple-100 text-purple-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'em_pausa': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planejamento': return 'Planejamento';
      case 'em_andamento': return 'Em andamento';
      case 'em_revisao': return 'Em revisão';
      case 'em_pausa': return 'Em pausa';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  const getTeamInitials = (equipe: string | null) => {
    if (!equipe) return [];
    return equipe.split(',').map(name => 
      name.trim().split(' ').map(n => n[0]).join('').toUpperCase()
    ).slice(0, 3);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.cliente_nome && project.cliente_nome.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.prioridade === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Carregando projetos...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projetos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus projetos e acompanhe o progresso de cada um
          </p>
        </div>
        
        <ProjectFormDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </ProjectFormDialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar projetos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="planejamento">Planejamento</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="em_revisao">Em revisão</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="em_pausa">Em pausa</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/projects/${project.id}`)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{project.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">{project.cliente_nome || 'Cliente não informado'}</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
                {project.prioridade && (
                  <Badge variant="outline" className={getPriorityColor(project.prioridade)}>
                    {project.prioridade}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">{project.progresso}%</span>
                  </div>
                  <Progress value={project.progresso} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Prazo:</span>
                    <span className="text-sm">
                      {project.data_entrega ? new Date(project.data_entrega).toLocaleDateString('pt-BR') : 'Não definido'}
                    </span>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {getTeamInitials(project.equipe).map((initials, index) => (
                      <Avatar key={index} className="w-6 h-6 border-2 border-background">
                        <AvatarFallback className="text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.equipe && getTeamInitials(project.equipe).length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        +{getTeamInitials(project.equipe).length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Crie seu primeiro projeto para começar
          </p>
          <ProjectFormDialog>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Projeto
            </Button>
          </ProjectFormDialog>
        </div>
      )}
    </div>
  );
};

export default Projects;
