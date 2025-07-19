
import React, { useState } from 'react';
import { Hash, MessageCircle, Users, Star, Circle, Plus, Settings, Volume2, VolumeX } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';
import { ChatChannel, ChatUser } from '@/types/chat';
import ChannelManagement from './ChannelManagement';

const ChatSidebar = () => {
  const { channels, activeChannel, setActiveChannel, users, markAsRead, voiceStates } = useChat();
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ChatChannel | null>(null);

  const publicChannels = channels.filter(c => c.type === 'public');
  const privateChannels = channels.filter(c => c.type === 'private');
  const voiceChannels = channels.filter(c => c.type === 'voice');
  const directMessages = channels.filter(c => c.type === 'direct');
  const groups = channels.filter(c => c.type === 'group');

  const handleChannelClick = (channel: ChatChannel) => {
    setActiveChannel(channel);
    if (channel.unreadCount > 0) {
      markAsRead(channel.id);
    }
  };

  const getChannelIcon = (channel: ChatChannel) => {
    switch (channel.type) {
      case 'public':
        return <Hash className="w-4 h-4" />;
      case 'private':
        return <Hash className="w-4 h-4 text-yellow-600" />;
      case 'voice':
        const voiceState = voiceStates.find(vs => vs.channelId === channel.id);
        return voiceState?.isActive ? 
          <Volume2 className="w-4 h-4 text-green-600" /> : 
          <VolumeX className="w-4 h-4" />;
      case 'direct':
        return <MessageCircle className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const getUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.status || 'offline';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'dnd':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getVoiceChannelInfo = (channel: ChatChannel) => {
    const voiceState = voiceStates.find(vs => vs.channelId === channel.id);
    return voiceState?.connectedUsers.length || 0;
  };

  const renderChannel = (channel: ChatChannel) => (
    <div key={channel.id} className="flex items-center group">
      <button
        onClick={() => handleChannelClick(channel)}
        className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-accent transition-colors ${
          activeChannel?.id === channel.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getChannelIcon(channel)}
          <span className="truncate font-medium">
            {channel.type === 'direct' ? channel.name : channel.name}
          </span>
          {channel.type === 'voice' && getVoiceChannelInfo(channel) > 0 && (
            <Badge variant="secondary" className="text-xs">
              {getVoiceChannelInfo(channel)}
            </Badge>
          )}
          {channel.type === 'direct' && (
            <div className={`w-2 h-2 rounded-full ${getStatusColor(getUserStatus(channel.participants.find(p => p !== '1') || ''))}`} />
          )}
        </div>
        {channel.unreadCount > 0 && (
          <Badge variant="destructive" className="ml-2 h-5 min-w-[20px] text-xs">
            {channel.unreadCount}
          </Badge>
        )}
      </button>
      
      {(channel.type === 'public' || channel.type === 'private') && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setEditingChannel(channel)}
        >
          <Settings className="w-3 h-3" />
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div className="w-60 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Chat</h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Canais Públicos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Canais Públicos
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowChannelModal(true)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {publicChannels.map(renderChannel)}
              </div>
            </div>

            {/* Canais Privados */}
            {privateChannels.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-yellow-600" />
                  Canais Privados
                </h3>
                <div className="space-y-1">
                  {privateChannels.map(renderChannel)}
                </div>
              </div>
            )}

            {/* Canais de Voz */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Canais de Voz
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowChannelModal(true)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {voiceChannels.map(renderChannel)}
              </div>
            </div>

            {/* Mensagens Diretas */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Mensagens Diretas
              </h3>
              <div className="space-y-1">
                {directMessages.map(renderChannel)}
              </div>
            </div>

            {/* Grupos */}
            {groups.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Grupos
                </h3>
                <div className="space-y-1">
                  {groups.map(renderChannel)}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Modal de Gerenciamento de Canal */}
      {showChannelModal && (
        <ChannelManagement
          mode="create"
          onClose={() => setShowChannelModal(false)}
        />
      )}

      {editingChannel && (
        <ChannelManagement
          channel={editingChannel}
          mode="edit"
          onClose={() => setEditingChannel(null)}
        />
      )}
    </>
  );
};

export default ChatSidebar;
