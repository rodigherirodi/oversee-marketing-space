import React, { useState } from 'react';
import { mockProjects } from '@/data/mockData';
import { Project } from '@/types/entities';
import { Search, Grid, List, Plus, Calendar, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const Projects = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const filterProjects = () => {
    let filtered = mockProjects.filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedClient) {
      filtered = filtered.filter(project => project.clientId === selectedClient);
    }
    if (selectedStatus) {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }
    setFilteredProjects(filtered);
  };
  React.useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedClient, selectedStatus]);
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">Gerencie todos os seus projetos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-r-none">
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-l-none">
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
          <input type="text" placeholder="Buscar projetos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos os clientes</option>
          <option value="1">TechCorp Solutions</option>
          <option value="2">E-commerce Plus</option>
        </select>

        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos os status</option>
          <option value="planning">Planejamento</option>
          <option value="in-progress">Em Progresso</option>
          <option value="review">Em Revisão</option>
          <option value="completed">Concluído</option>
          <option value="paused">Em Pausa</option>
        </select>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => <div key={project.id} className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleProjectClick(project.id)}>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    
                    <span className="font-medium">{project.client.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Não definida'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{project.responsibleManager}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{project.teamMembers.length} membros</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'in-progress' ? 'bg-green-100 text-green-700' : project.status === 'planning' ? 'bg-blue-100 text-blue-700' : project.status === 'review' ? 'bg-yellow-100 text-yellow-700' : project.status === 'paused' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {project.status === 'in-progress' ? 'Em Progresso' : project.status === 'planning' ? 'Planejamento' : project.status === 'review' ? 'Em Revisão' : project.status === 'paused' ? 'Em Pausa' : 'Concluído'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{
                width: `${project.progress}%`
              }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                </div>
              </div>
            </div>)}
        </div> : <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrega</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map(project => <tr key={project.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'in-progress' ? 'bg-green-100 text-green-700' : project.status === 'planning' ? 'bg-blue-100 text-blue-700' : project.status === 'review' ? 'bg-yellow-100 text-yellow-700' : project.status === 'paused' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {project.status === 'in-progress' ? 'Em Progresso' : project.status === 'planning' ? 'Planejamento' : project.status === 'review' ? 'Em Revisão' : project.status === 'paused' ? 'Em Pausa' : 'Concluído'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{
                      width: `${project.progress}%`
                    }}></div>
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Não definida'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.responsibleManager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.teamMembers.length} membros
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
};
export default Projects;