
import React, { useState } from 'react';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProjectFormDialog from '@/components/ProjectFormDialog';
import { useProjects } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
        
        <Button onClick={() => setIsProjectFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
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
              <SelectItem value="planning">Planejamento</SelectItem>
              <SelectItem value="in-progress">Em Progresso</SelectItem>
              <SelectItem value="review">Em Revisão</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="paused">Pausado</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
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
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">{project.client.name}</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusColor(project.status)}>
                  {project.status === 'planning' && 'Planejamento'}
                  {project.status === 'in-progress' && 'Em Progresso'}
                  {project.status === 'review' && 'Em Revisão'}
                  {project.status === 'completed' && 'Concluído'}
                  {project.status === 'paused' && 'Pausado'}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(project.priority)}>
                  {project.priority === 'high' && 'Alta'}
                  {project.priority === 'medium' && 'Média'}
                  {project.priority === 'low' && 'Baixa'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Prazo:</span>
                    <span className="text-sm">
                      {new Date(project.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((member, index) => (
                      <Avatar key={index} className="w-6 h-6 border-2 border-background">
                        <AvatarFallback className="text-xs">
                          {member.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        +{project.teamMembers.length - 3}
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
          <Button onClick={() => setIsProjectFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Projeto
          </Button>
        </div>
      )}

      {/* Project Form Dialog */}
      <ProjectFormDialog
        open={isProjectFormOpen}
        onOpenChange={setIsProjectFormOpen}
      />
    </div>
  );
};

export default Projects;
