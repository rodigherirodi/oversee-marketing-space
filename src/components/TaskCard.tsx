
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    assignee: { name: string } | string;
    due_date?: string;
    tags?: string[];
    clientes?: { nome: string } | null;
    cliente_id?: string;
  };
  onUpdate: (taskId: string, updates: any) => void;
  onEdit: (task: any) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays < 0) return `${Math.abs(diffDays)}d atrasado`;
    if (diffDays <= 7) return `${diffDays}d`;

    return date.toLocaleDateString('pt-BR');
  };

  const getAssigneeName = (assignee: any): string => {
    if (!assignee) return 'Não atribuído';
    if (typeof assignee === 'string') return assignee;
    if (typeof assignee === 'object' && assignee.name) return assignee.name;
    return 'Não atribuído';
  };

  const getClientName = (): string => {
    if (!task.clientes && !task.cliente_id) return '';
    if (task.clientes?.nome) return task.clientes.nome;
    if (!task.clientes && task.cliente_id) return 'Cliente removido';
    return '';
  };

  const assigneeName = getAssigneeName(task.assignee);
  const clientName = getClientName();
  const formattedDate = formatDate(task.due_date);
  const isOverdue = task.due_date ? new Date(task.due_date) < new Date() : false;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger edit when clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    onEdit(task);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', task.id);

      if (error) throw error;

      // Call onDelete to update the UI immediately
      if (onDelete) {
        onDelete(task.id);
      }
      
      toast.success('Tarefa excluída com sucesso');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erro ao excluir tarefa');
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card 
        className="w-full hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm leading-tight mb-1">{task.title}</h4>
              {assigneeName !== 'Não atribuído' && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <User className="w-3 h-3" />
                  <span>{assigneeName}</span>
                </div>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  data-dropdown-trigger="true"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {task.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-col gap-2">
            {/* Priority Badge */}
            <Badge 
              variant="secondary"
              className={`text-xs w-fit ${getPriorityColor(task.priority)}`}
            >
              {getPriorityLabel(task.priority)}
            </Badge>
            
            {/* Due Date */}
            {formattedDate && (
              <div className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-red-600' : 'text-gray-600'
              }`}>
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            )}
            
            {/* Client */}
            {clientName && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <span className="font-medium">Cliente:</span>
                <span className={clientName === 'Cliente removido' ? 'text-red-500' : ''}>
                  {clientName}
                </span>
              </div>
            )}
            
            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{task.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a tarefa "{task.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
