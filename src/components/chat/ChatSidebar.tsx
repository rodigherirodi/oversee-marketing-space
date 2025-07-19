
import React from 'react';
import { Hash, MessageCircle, Users, Star, Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChat } from '@/contexts/ChatContext';
import { ChatChannel, ChatUser } from '@/types/chat';

const ChatSidebar = () => {
  const { channels, activeChannel, setActiveChannel, users, markAsRead } = useChat();

  const publicChannels = channels.filter(c => c.type === 'public');
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
      default:
        return 'bg-gray-400';
    }
  };

  const renderChannel = (channel: ChatChannel) => (
    <button
      key={channel.id}
      onClick={() => handleChannelClick(channel)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-accent transition-colors ${
        activeChannel?.id === channel.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {getChannelIcon(channel)}
        <span className="truncate font-medium">
          {channel.type === 'direct' ? channel.name : `#${channel.name}`}
        </span>
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
  );

  return (
    <div className="w-60 border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Chat</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Public Channels */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Canais
            </h3>
            <div className="space-y-1">
              {publicChannels.map(renderChannel)}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Mensagens Diretas
            </h3>
            <div className="space-y-1">
              {directMessages.map(renderChannel)}
            </div>
          </div>

          {/* Groups */}
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
  );
};

export default ChatSidebar;
