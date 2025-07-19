
import React, { useState, KeyboardEvent } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { activeChannel, sendMessage } = useChat();

  const handleSend = () => {
    if (message.trim() && activeChannel) {
      sendMessage(message.trim(), activeChannel.id);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChannel) return null;

  return (
    <div className="p-4 border-t bg-background">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Mensagem para ${activeChannel.type === 'direct' ? activeChannel.name : `#${activeChannel.name}`}`}
            className="pr-20"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button 
          onClick={handleSend} 
          disabled={!message.trim()}
          size="sm"
          className="px-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
