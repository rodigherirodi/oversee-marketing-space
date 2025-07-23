
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Edit, Trash2, ExternalLink, FileText } from 'lucide-react';
import { usePageLinks } from '@/hooks/usePageLinks';
import { PageLink } from '@/types/client-profile';
import { useToast } from '@/hooks/use-toast';

interface PageLinksTableProps {
  clientId: string;
}

const typeLabels = {
  landing: 'Landing Page',
  institutional: 'Institucional',
  other: 'Outro'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800'
};

export const PageLinksTable: React.FC<PageLinksTableProps> = ({ clientId }) => {
  const [deletingPage, setDeletingPage] = useState<PageLink | undefined>();
  const { getPagesByClient, deletePageLink } = usePageLinks();
  const { toast } = useToast();

  const pages = getPagesByClient(clientId);

  const handleDelete = () => {
    if (deletingPage) {
      deletePageLink(deletingPage.id);
      setDeletingPage(undefined);
      toast({
        title: "Página excluída",
        description: "A página foi removida com sucesso."
      });
    }
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return '-';
    if (startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`;
    }
    if (startDate) return `Desde ${new Date(startDate).toLocaleDateString('pt-BR')}`;
    if (endDate) return `Até ${new Date(endDate).toLocaleDateString('pt-BR')}`;
    return '-';
  };

  if (pages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma página registrada ainda.</p>
        <p className="text-sm">Clique em "Nova Página" para adicionar a primeira.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{page.name}</p>
                    <p className="text-sm text-muted-foreground">{page.url}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {typeLabels[page.type]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[page.status]}>
                    {page.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {formatDateRange(page.startDate, page.endDate)}
                  </span>
                </TableCell>
                <TableCell>
                  {page.link ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a href={page.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* Edit functionality would go here */}}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingPage(page)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingPage} onOpenChange={() => setDeletingPage(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir página</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta página? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
