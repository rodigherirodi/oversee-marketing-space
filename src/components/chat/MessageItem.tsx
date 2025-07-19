
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/types/chat';
import MessageReactions from './MessageReactions';

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
  // Função para renderizar conteúdo com menções destacadas
  const renderContentWithMentions = (content: string) => {
    if (message.mentions.length === 0) {
      return content;
    }

    const parts = [];
    let lastIndex = 0;

    // Ordenar menções por posição
    const sortedMentions = [...message.mentions].sort((a, b) => a.startIndex - b.startIndex);

    sortedMentions.forEach(mention => {
      // Adicionar texto antes da menção
      if (mention.startIndex > lastIndex) {
        parts.push(content.slice(lastIndex, mention.startIndex));
      }

      // Adicionar menção estilizada
      const mentionText = content.slice(mention.startIndex, mention.endIndex);
      const mentionColor = mention.type === 'user' ? 'bg-blue-100 text-blue-700' :
                          mention.type === 'task' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700';

      parts.push(
        <Badge 
          key={`mention-${mention.id}-${mention.startIndex}`}
          variant="secondary" 
          className={`${mentionColor} mx-1 text-xs`}
        >
          {mentionText}
        </Badge>
      );

      lastIndex = mention.endIndex;
    });

    // Adicionar texto restante
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

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
              {message.author.position && (
                <Badge variant="outline" className="text-xs">
                  {message.author.position}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(message.timestamp, { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
              {message.isEdited && (
                <span className="text-xs text-muted-foreground">(editado)</span>
              )}
            </div>
          )}
          
          <div className="text-sm">
            {renderContentWithMentions(message.content)}
          </div>
          
          {/* Anexos */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {attachment.type.startsWith('image/') ? (
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {attachment.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {attachment.type.split('/')[0]}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Reações */}
          {message.reactions.length > 0 && (
            <MessageReactions 
              messageId={message.id} 
              reactions={message.reactions} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
