
import React, { useEffect, useRef } from 'react';
import { Hash, Users, Phone, Video, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/contexts/ChatContext';
import MessageItem from './MessageItem';
import MentionInput from './MentionInput';
import VoiceChannel from './VoiceChannel';

const ChatArea = () => {
  const { activeChannel, messages, users } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channelMessages = messages.filter(m => m.channelId === activeChannel?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);

  if (!activeChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <Hash className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Bem-vindo ao Chat</h3>
          <p className="text-muted-foreground">
            Selecione um canal ou conversa para começar
          </p>
        </div>
      </div>
    );
  }

  // Renderizar canal de voz
  if (activeChannel.type === 'voice') {
    return (
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              <h2 className="font-semibold">{activeChannel.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Voice Channel Content */}
        <div className="flex-1 p-6">
          <VoiceChannel channel={activeChannel} />
        </div>
      </div>
    );
  }

  const getChannelIcon = () => {
    switch (activeChannel.type) {
      case 'public':
        return <Hash className="w-5 h-5" />;
      case 'private':
        return <Hash className="w-5 h-5 text-yellow-600" />;
      case 'direct':
        return <Users className="w-5 h-5" />;
      case 'group':
        return <Users className="w-5 h-5" />;
      default:
        return <Hash className="w-5 h-5" />;
    }
  };

  const getParticipantsCount = () => {
    return activeChannel.participants.length;
  };

  const shouldGroupMessage = (currentMessage: any, previousMessage: any) => {
    if (!previousMessage) return false;
    
    const timeDiff = new Date(currentMessage.timestamp).getTime() - new Date(previousMessage.timestamp).getTime();
    const isSameAuthor = currentMessage.authorId === previousMessage.authorId;
    const isWithinFiveMinutes = timeDiff < 5 * 60 * 1000; // 5 minutes
    
    return isSameAuthor && isWithinFiveMinutes;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Channel Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          {getChannelIcon()}
          <div>
            <h2 className="font-semibold">
              {activeChannel.type === 'direct' ? activeChannel.name : `${activeChannel.name}`}
            </h2>
            {activeChannel.description && (
              <p className="text-sm text-muted-foreground">{activeChannel.description}</p>
            )}
            {activeChannel.type !== 'direct' && (
              <p className="text-xs text-muted-foreground">
                {getParticipantsCount()} {getParticipantsCount() === 1 ? 'membro' : 'membros'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
          </Button>
          {activeChannel.type === 'direct' && (
            <>
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="pb-4">
          {channelMessages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                {getChannelIcon()}
                <h3 className="text-lg font-medium mt-4 mb-2">
                  {activeChannel.type === 'direct' 
                    ? `Esta é a sua conversa com ${activeChannel.name}`
                    : `Bem-vindo ao ${activeChannel.name}`
                  }
                </h3>
                <p className="text-muted-foreground">
                  {activeChannel.description || 'Inicie uma conversa enviando uma mensagem.'}
                </p>
              </div>
            </div>
          ) : (
            channelMessages.map((message, index) => {
              const previousMessage = index > 0 ? channelMessages[index - 1] : null;
              const isGrouped = shouldGroupMessage(message, previousMessage);
              
              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  showAvatar={!isGrouped}
                  isGrouped={isGrouped}
                />
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <MentionInput />
    </div>
  );
};

export default ChatArea;
