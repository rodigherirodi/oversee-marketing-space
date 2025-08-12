
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseProjects, type SupabaseProject } from '@/hooks/useSupabaseProjects';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProjectHeaderProps {
  project: SupabaseProject;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate?: (updates: Partial<SupabaseProject>) => void;
}

const ProjectHeader = ({ project, isEditing, onToggleEdit, onUpdate }: ProjectHeaderProps) => {
  const navigate = useNavigate();
  const { deleteProject, clients } = useSupabaseProjects();

  const getStatusColor = (status: string) => {
    const colors = {
      planejamento: 'bg-blue-100 text-blue-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      em_revisao: 'bg-orange-100 text-orange-800',
      em_pausa: 'bg-gray-100 text-gray-800',
      concluido: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string | null) => {
    const colors = {
      Alta: 'bg-red-100 text-red-800',
      Média: 'bg-yellow-100 text-yellow-800',
      Baixa: 'bg-green-100 text-green-800'
    };
    return priority ? colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async () => {
    const success = await deleteProject(project.id);
    if (success) {
      navigate('/projects');
    }
  };

  const formatStatus = (status: string) => {
    const statusLabels = {
      planejamento: 'Planejamento',
      em_andamento: 'Em andamento',
      em_revisao: 'Em revisão',
      em_pausa: 'Em pausa',
      concluido: 'Concluído'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  return (
    <div className="border-b border-gray-200 pb-8 mb-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={project.titulo}
              onChange={(e) => onUpdate?.({ titulo: e.target.value })}
              className="text-3xl font-bold border-0 shadow-none focus:ring-0 p-0 h-auto"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{project.titulo}</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleEdit}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </>
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir projeto</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o projeto "{project.titulo}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          {isEditing ? (
            <Select 
              value={project.cliente_id || ''} 
              onValueChange={(value) => {
                const selectedClient = clients.find(client => client.id === value);
                onUpdate?.({ 
                  cliente_id: value || null,
                  cliente: selectedClient?.nome || null
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-gray-900">{project.cliente_nome || 'Não informado'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          {isEditing ? (
            <Select value={project.status} onValueChange={(value: any) => onUpdate?.({ status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planejamento">Planejamento</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="em_revisao">Em revisão</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="em_pausa">Em pausa</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge className={getStatusColor(project.status)}>
              {formatStatus(project.status)}
            </Badge>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
          {isEditing ? (
            <Select value={project.prioridade || ''} onValueChange={(value: any) => onUpdate?.({ prioridade: value || null })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge className={getPriorityColor(project.prioridade)}>
              {project.prioridade || 'Não definida'}
            </Badge>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Progresso</label>
          {isEditing ? (
            <Input
              type="number"
              min="0"
              max="100"
              value={project.progresso}
              onChange={(e) => onUpdate?.({ progresso: parseInt(e.target.value) || 0 })}
            />
          ) : (
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${project.progresso}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{project.progresso}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
