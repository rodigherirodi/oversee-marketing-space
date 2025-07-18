
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockProjects } from '@/data/mockData';
import { Project } from '@/types/entities';
import { Search, Grid, List, Plus, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Projects = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState('');

  const [filteredProjects, setFilteredProjects] = useState(mockProjects);

  // Função para extrair responsáveis únicos
  const getUniqueResponsibles = () => {
    const responsibles = mockProjects.map(project => project.client.responsibleManager);
    return [...new Set(responsibles)];
  };

  // Função para gerar iniciais dos nomes
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Componente para avatares da equipe
  const TeamAvatars = ({ teamMembers }: { teamMembers: string[] }) => {
    const displayMembers = teamMembers.slice(0, 3);
    const extraCount = teamMembers.length - 3;

    return (
      <div className="flex -space-x-2">
        {displayMembers.map((member, index) => (
          <Avatar key={index} className="w-6 h-6 border-2 border-white">
            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
              {getInitials(member)}
            </AvatarFallback>
          </Avatar>
        ))}
        {extraCount > 0 && (
          <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
            +{extraCount}
          </div>
        )}
      </div>
    );
  };

  const filterProjects = () => {
    let filtered = mockProjects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedClient) {
      filtered = filtered.filter(project => project.clientId === selectedClient);
    }

    if (selectedStatus) {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    if (selectedResponsible) {
      filtered = filtered.filter(project => project.client.responsibleManager === selectedResponsible);
    }

    setFilteredProjects(filtered);
  };

  React.useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedClient, selectedStatus, selectedResponsible]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">Gerencie todos os seus projetos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os clientes</option>
          <option value="1">TechCorp Solutions</option>
          <option value="2">E-commerce Plus</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="planning">Planejamento</option>
          <option value="in-progress">Em Progresso</option>
          <option value="review">Em Revisão</option>
          <option value="completed">Concluído</option>
          <option value="paused">Em Pausa</option>
        </select>

        <select
          value={selectedResponsible}
          onChange={(e) => setSelectedResponsible(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os responsáveis</option>
          {getUniqueResponsibles().map(responsible => (
            <option key={responsible} value={responsible}>
              {responsible}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow block"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-sm text-blue-600 font-medium mb-3">{project.client.name}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(project.startDate).toLocaleDateString('pt-BR')} - {new Date(project.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <TeamAvatars teamMembers={project.teamMembers} />
                    <span className="ml-1">{project.teamMembers.length}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'in-progress' ? 'bg-green-100 text-green-700' :
                    project.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                    project.status === 'paused' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status === 'in-progress' ? 'Em Progresso' :
                     project.status === 'planning' ? 'Planejamento' :
                     project.status === 'review' ? 'Em Revisão' :
                     project.status === 'paused' ? 'Em Pausa' : 'Concluído'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 min-w-[30px]">{project.progress}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/projects/${project.id}`} className="block hover:text-blue-600">
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.client.responsibleManager}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'in-progress' ? 'bg-green-100 text-green-700' :
                        project.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                        project.status === 'paused' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status === 'in-progress' ? 'Em Progresso' :
                         project.status === 'planning' ? 'Planejamento' :
                         project.status === 'review' ? 'Em Revisão' :
                         project.status === 'paused' ? 'Em Pausa' : 'Concluído'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(project.startDate).toLocaleDateString('pt-BR')} - {new Date(project.endDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TeamAvatars teamMembers={project.teamMembers} />
                        <span className="text-sm text-gray-600">{project.teamMembers.length}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
