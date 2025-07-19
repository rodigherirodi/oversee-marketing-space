
import React, { useState } from 'react';
import { Plus, Settings, Hash, Users, Volume2, Lock, Globe, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/contexts/ChatContext';
import { ChatChannel } from '@/types/chat';

interface ChannelManagementProps {
  channel?: ChatChannel;
  mode: 'create' | 'edit';
  onClose: () => void;
}

const ChannelManagement: React.FC<ChannelManagementProps> = ({ 
  channel, 
  mode, 
  onClose 
}) => {
  const { createChannel, editChannel, deleteChannel, users } = useChat();
  
  const [formData, setFormData] = useState({
    name: channel?.name || '',
    type: channel?.type || 'public' as ChatChannel['type'],
    description: channel?.description || '',
    participants: channel?.participants || []
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      createChannel(
        formData.name,
        formData.type,
        formData.description,
        formData.participants
      );
    } else if (channel) {
      editChannel(channel.id, {
        name: formData.name,
        description: formData.description,
        participants: formData.participants
      });
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (channel) {
      deleteChannel(channel.id);
      onClose();
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      case 'voice': return <Volume2 className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  const toggleParticipant = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(id => id !== userId)
        : [...prev.participants, userId]
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type: value as ChatChannel['type']
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getChannelIcon(formData.type)}
            {mode === 'create' ? 'Criar Canal' : 'Editar Canal'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do Canal */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Canal</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do canal"
              required
            />
          </div>

          {/* Tipo do Canal */}
          {mode === 'create' && (
            <div className="space-y-2">
              <Label>Tipo do Canal</Label>
              <Select 
                value={formData.type} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Público - Visível para todos
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Privado - Apenas membros convidados
                    </div>
                  </SelectItem>
                  <SelectItem value="voice">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Canal de Voz - Para reuniões
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o propósito deste canal"
              rows={3}
            />
          </div>

          {/* Participantes */}
          <div className="space-y-3">
            <Label>Participantes</Label>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {user.avatar || user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.position}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={formData.participants.includes(user.id)}
                    onCheckedChange={() => toggleParticipant(user.id)}
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {formData.participants.length} participante(s) selecionado(s)
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between">
            <div>
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Canal
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Criar Canal' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </form>

        {/* Confirmação de Exclusão */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-2">Excluir Canal</h3>
              <p className="text-muted-foreground mb-4">
                Tem certeza que deseja excluir o canal "{channel?.name}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChannelManagement;
