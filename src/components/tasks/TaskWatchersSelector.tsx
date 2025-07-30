
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Search, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position?: string;
}

interface TaskWatchersSelectorProps {
  taskId?: string;
  selectedWatchers: string[];
  onChange: (watchers: string[]) => void;
  maxDisplay?: number;
}

export const TaskWatchersSelector: React.FC<TaskWatchersSelectorProps> = ({
  taskId,
  selectedWatchers,
  onChange,
  maxDisplay = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedWatchers.includes(member.id)
  );

  const selectedMembersData = teamMembers.filter(member => 
    selectedWatchers.includes(member.id)
  );

  const handleWatcherToggle = async (memberId: string) => {
    const newWatchers = selectedWatchers.includes(memberId)
      ? selectedWatchers.filter(id => id !== memberId)
      : [...selectedWatchers, memberId];
    
    onChange(newWatchers);

    // If we have a taskId, update the database
    if (taskId) {
      try {
        if (selectedWatchers.includes(memberId)) {
          // Remove watcher
          await supabase
            .from('task_watchers')
            .delete()
            .eq('task_id', taskId)
            .eq('user_id', memberId);
        } else {
          // Add watcher
          await supabase
            .from('task_watchers')
            .insert([{ task_id: taskId, user_id: memberId }]);
        }
      } catch (err) {
        console.error('Error updating watchers:', err);
      }
    }
  };

  const removeWatcher = (memberId: string) => {
    handleWatcherToggle(memberId);
  };

  const getMemberInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Observadores
      </Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-auto min-h-[2.5rem] px-3 py-2"
          >
            {selectedWatchers.length === 0 ? (
              <span className="text-muted-foreground">Selecionar observadores...</span>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedMembersData.slice(0, maxDisplay).map((member) => (
                  <Badge
                    key={member.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      {getMemberInitials(member.name)}
                    </div>
                    <span className="text-xs">{member.name.split(' ')[0]}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWatcher(member.id);
                      }}
                    />
                  </Badge>
                ))}
                {selectedWatchers.length > maxDisplay && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedWatchers.length - maxDisplay}
                  </Badge>
                )}
              </div>
            )}
            <Plus className="w-4 h-4 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar membros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                Carregando...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                Nenhum membro encontrado
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleWatcherToggle(member.id)}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {getMemberInitials(member.name)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.position || member.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected watchers display */}
      {selectedWatchers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMembersData.map((member) => (
            <Badge
              key={member.id}
              variant="outline"
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {getMemberInitials(member.name)}
              </div>
              <span>{member.name}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => removeWatcher(member.id)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
