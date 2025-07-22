
import React from 'react';
import { RelatedContact } from '@/types/crm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  Star,
  Edit,
  Trash2
} from 'lucide-react';

interface ContactListProps {
  contacts: RelatedContact[];
  onContactsChange: (contacts: RelatedContact[]) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onContactsChange
}) => {
  const handleEdit = (contactId: string) => {
    console.log('Edit contact:', contactId);
    // TODO: Implementar edição de contato
  };

  const handleDelete = (contactId: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    onContactsChange(updatedContacts);
  };

  const handleSetPrimary = (contactId: string) => {
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === contactId
    }));
    onContactsChange(updatedContacts);
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Nenhum contato relacionado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <Card key={contact.id} className="relative">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{contact.name}</h4>
                  {contact.isPrimary && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Principal
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{contact.position}</p>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                {!contact.isPrimary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => handleSetPrimary(contact.id)}
                  >
                    <Star className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => handleEdit(contact.id)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(contact.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
