
import React from 'react';
import { ActivityFilters, Lead } from '@/types/crm';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityFiltersProps {
  filters: ActivityFilters;
  onFilterChange: (filters: ActivityFilters) => void;
  leads: Lead[];
  teamMembers: string[];
}

export const ActivityFiltersComponent: React.FC<ActivityFiltersProps> = ({
  filters,
  onFilterChange,
  leads,
  teamMembers,
}) => {
  const activityTypes = [
    { value: 'call', label: 'Ligação' },
    { value: 'email', label: 'E-mail' },
    { value: 'meeting', label: 'Reunião' },
    { value: 'note', label: 'Nota' },
    { value: 'task', label: 'Tarefa' },
    { value: 'stage_change', label: 'Mudança de Estágio' },
  ];

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const handleDateRangeChange = (date: Date | undefined) => {
    if (!date) return;

    if (!filters.dateRange) {
      onFilterChange({
        ...filters,
        dateRange: { start: date, end: date },
      });
    } else if (!filters.dateRange.start || (filters.dateRange.start && filters.dateRange.end)) {
      onFilterChange({
        ...filters,
        dateRange: { start: date, end: date },
      });
    } else {
      onFilterChange({
        ...filters,
        dateRange: {
          start: filters.dateRange.start,
          end: date >= filters.dateRange.start ? date : filters.dateRange.start,
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Buscar por título ou descrição..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pr-8"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => onFilterChange({ ...filters, search: undefined })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select
          value={filters.leadId}
          onValueChange={(value) => onFilterChange({ ...filters, leadId: value })}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filtrar por Lead" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Leads</SelectItem>
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>
                {lead.name} - {lead.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type}
          onValueChange={(value) => onFilterChange({ ...filters, type: value })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            {activityTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.responsiblePerson}
          onValueChange={(value) => onFilterChange({ ...filters, responsiblePerson: value })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member} value={member}>
                {member}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.completed !== undefined ? String(filters.completed) : 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              const newFilters = { ...filters };
              delete newFilters.completed;
              onFilterChange(newFilters);
            } else {
              onFilterChange({ ...filters, completed: value === 'true' });
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Concluídas</SelectItem>
            <SelectItem value="false">Pendentes</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange ? (
                <span>
                  {format(filters.dateRange.start, "dd/MM/yyyy", { locale: ptBR })}
                  {filters.dateRange.end && filters.dateRange.end.getTime() !== filters.dateRange.start.getTime() && 
                    ` - ${format(filters.dateRange.end, "dd/MM/yyyy", { locale: ptBR })}`}
                </span>
              ) : (
                "Data"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={filters.dateRange ? {
                from: filters.dateRange.start,
                to: filters.dateRange.end
              } : undefined}
              onSelect={(range) => {
                if (!range) {
                  const newFilters = { ...filters };
                  delete newFilters.dateRange;
                  onFilterChange(newFilters);
                } else {
                  onFilterChange({
                    ...filters,
                    dateRange: {
                      start: range.from!,
                      end: range.to || range.from!,
                    },
                  });
                }
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {Object.keys(filters).length > 0 && (
          <Button 
            variant="ghost" 
            onClick={handleClearFilters}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Filter summary badges can be added here if needed */}
    </div>
  );
};
