
import React from 'react';
import { Lead } from '@/types/crm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building2,
  DollarSign,
  User,
  Calendar
} from 'lucide-react';

interface CRMListViewProps {
  leads: Lead[];
  onLeadEdit: (lead: Lead) => void;
  onLeadView: (lead: Lead) => void;
  onLeadDelete: (leadId: string) => void;
}

export const CRMListView: React.FC<CRMListViewProps> = ({
  leads,
  onLeadEdit,
  onLeadView,
  onLeadDelete
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-700';
      case 'linkedin': return 'bg-indigo-100 text-indigo-700';
      case 'indicacao': return 'bg-green-100 text-green-700';
      case 'evento': return 'bg-purple-100 text-purple-700';
      case 'cold-call': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 font-semibold';
    if (score >= 60) return 'text-yellow-600 font-semibold';
    if (score >= 40) return 'text-orange-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'novo-lead': return 'bg-gray-100 text-gray-700';
      case 'em-contato': return 'bg-blue-100 text-blue-700';
      case 'reuniao-1': return 'bg-indigo-100 text-indigo-700';
      case 'reuniao-2': return 'bg-purple-100 text-purple-700';
      case 'proposta': return 'bg-orange-100 text-orange-700';
      case 'resgate': return 'bg-yellow-100 text-yellow-700';
      case 'venda': return 'bg-green-100 text-green-700';
      case 'perdido': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'novo-lead': return 'Novo Lead';
      case 'em-contato': return 'Em Contato';
      case 'reuniao-1': return 'Reunião 1';
      case 'reuniao-2': return 'Reunião 2';
      case 'proposta': return 'Proposta Enviada';
      case 'resgate': return 'Resgate';
      case 'venda': return 'Venda';
      case 'perdido': return 'Perdido';
      default: return stage;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estágio</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="w-[50px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-sm text-muted-foreground">{lead.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{lead.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-semibold text-green-600">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(lead.value)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStageColor(lead.stage)}`}>
                      {getStageName(lead.stage)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getSourceBadgeColor(lead.source)}`}>
                      {lead.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{lead.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(lead.updatedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onLeadView(lead)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onLeadEdit(lead)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onLeadDelete(lead.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
