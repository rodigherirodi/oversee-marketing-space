
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Mail, Phone, User } from 'lucide-react';
import { useSupabaseClientContacts } from '@/hooks/useSupabaseClientContacts';
import { ContactFormDialog } from '@/components/ContactFormDialog';

interface ClientContactsSectionProps {
  clientId: string;
}

const getContactTypeLabel = (type: string) => {
  switch (type) {
    case 'principal':
      return 'Principal';
    case 'financeiro':
      return 'Financeiro';
    case 'operacional':
      return 'Operacional';
    case 'outro':
      return 'Outro';
    default:
      return type;
  }
};

const getContactTypeColor = (type: string) => {
  switch (type) {
    case 'principal':
      return 'bg-blue-100 text-blue-800';
    case 'financeiro':
      return 'bg-green-100 text-green-800';
    case 'operacional':
      return 'bg-purple-100 text-purple-800';
    case 'outro':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ClientContactsSection: React.FC<ClientContactsSectionProps> = ({ clientId }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any | undefined>();
  const { contacts, addContact, updateContact, deleteContact } = useSupabaseClientContacts(clientId);

  const handleSaveContact = async (data: any) => {
    if (editingContact) {
      await updateContact(editingContact.id, data);
      setEditingContact(undefined);
    } else {
      await addContact(data);
    }
    setIsFormOpen(false);
  };

  const handleEditContact = (contact: any) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = async (contactId: string) => {
    await deleteContact(contactId);
  };

  const primaryContact = contacts.find(c => c.is_primary);
  const otherContacts = contacts.filter(c => !c.is_primary);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Contatos
          </CardTitle>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Contato
          </Button>
        </CardHeader>
        <CardContent>
          {primaryContact && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-900">Contato Principal</h3>
                <Badge className="bg-blue-100 text-blue-800">Principal</Badge>
              </div>
              <div className="space-y-2">
                <p className="font-medium">{primaryContact.nome}</p>
                {primaryContact.cargo && (
                  <p className="text-sm text-muted-foreground">{primaryContact.cargo}</p>
                )}
                <div className="flex flex-col gap-1">
                  {primaryContact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{primaryContact.email}</span>
                    </div>
                  )}
                  {primaryContact.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{primaryContact.telefone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {otherContacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.nome}</TableCell>
                    <TableCell>{contact.cargo || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getContactTypeColor(contact.tipo)}>
                        {getContactTypeLabel(contact.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell>{contact.email || '-'}</TableCell>
                    <TableCell>{contact.telefone || '-'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            !primaryContact && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum contato registrado ainda.</p>
                <p className="text-sm">Clique em "Novo Contato" para adicionar o primeiro.</p>
              </div>
            )
          )}
        </CardContent>
      </Card>

      <ContactFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingContact(undefined);
        }}
        onSubmit={handleSaveContact}
        contact={editingContact}
      />
    </>
  );
};
