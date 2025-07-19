
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage } from '@/types/chat';

interface MessageItemProps {
  message: ChatMessage;
  showAvatar?: boolean;
  isGrouped?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  showAvatar = true, 
  isGrouped = false 
}) => {
  return (
    <div className={`group px-4 py-2 hover:bg-accent/50 ${isGrouped ? 'py-1' : 'py-3'}`}>
      <div className="flex gap-3">
        {showAvatar && !isGrouped ? (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {message.author.avatar || message.author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8 flex justify-center">
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
              {formatDistanceToNow(message.timestamp, { 
                addSuffix: false, 
                locale: ptBR 
              }).slice(0, 5)}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {!isGrouped && (
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-medium text-sm">{message.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(message.timestamp, { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            </div>
          )}
          
          <div className="text-sm">
            {message.content}
          </div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50"
                >
                  <span className="text-sm font-medium">{attachment.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
