
import React, { useState } from 'react';
import { Plus, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useChat } from '@/contexts/ChatContext';
import { Reaction } from '@/types/chat';

interface MessageReactionsProps {
  messageId: string;
  reactions: Reaction[];
}

const EMOJI_LIST = [
  '👍', '👎', '❤️', '😂', '😮', '😢', '😡', '👏',
  '🎉', '🔥', '💯', '⚡', '✨', '💎', '🚀', '👀'
];

const MessageReactions: React.FC<MessageReactionsProps> = ({ 
  messageId, 
  reactions 
}) => {
  const { addReaction, removeReaction, currentUser } = useChat();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    const userHasReacted = reaction?.users.includes(currentUser.id);

    if (userHasReacted) {
      removeReaction(messageId, emoji, currentUser.id);
    } else {
      addReaction(messageId, emoji, currentUser.id);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    addReaction(messageId, emoji, currentUser.id);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {/* Reações Existentes */}
      {reactions.map(reaction => (
        <Button
          key={reaction.emoji}
          variant={reaction.users.includes(currentUser.id) ? "secondary" : "outline"}
          size="sm"
          className="h-6 px-2 text-xs hover:bg-accent"
          onClick={() => handleReactionClick(reaction.emoji)}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}

      {/* Botão Adicionar Reação */}
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_LIST.map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-accent"
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MessageReactions;
