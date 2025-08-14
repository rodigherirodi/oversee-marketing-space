
import React, { useState, useEffect } from 'react';
import { SelectItem } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position?: string;
}

interface ResponsibleSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const ResponsibleSelector: React.FC<ResponsibleSelectorProps> = ({
  value,
  onChange,
  required = false
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar, position')
        .order('name');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return <SelectItem value="" disabled>Carregando...</SelectItem>;
  }

  if (teamMembers.length === 0) {
    return <SelectItem value="" disabled>Nenhum membro encontrado</SelectItem>;
  }

  return (
    <>
      {teamMembers
        .filter(member => member.id && String(member.id).trim() !== '')
        .map(member => (
          <SelectItem key={member.id} value={String(member.id)}>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-xs text-gray-500">{member.position || member.email}</div>
              </div>
            </div>
          </SelectItem>
        ))
      }
    </>
  );
};
