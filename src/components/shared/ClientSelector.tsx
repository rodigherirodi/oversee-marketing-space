
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClientOptions } from '@/hooks/useClientsOptimized';
import { Loader2 } from 'lucide-react';

interface ClientSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Selecione um cliente",
  disabled = false,
}) => {
  const { data: clients, isLoading } = useClientOptions();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2 border rounded-md">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando clientes...</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clients?.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            {client.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
