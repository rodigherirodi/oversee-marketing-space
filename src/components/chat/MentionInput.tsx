
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, AtSign, Hash, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';
import { Mention } from '@/types/chat';

interface MentionSuggestion {
  id: string;
  displayName: string;
  type: Mention['type'];
  avatar?: string;
  subtitle?: string;
}

const MentionInput = () => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionType, setMentionType] = useState<Mention['type'] | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { activeChannel, sendMessage, searchMentions } = useChat();

  useEffect(() => {
    if (mentionQuery && mentionType) {
      const results = searchMentions(mentionQuery, mentionType);
      const formatted = results.map(result => ({
        ...result,
        type: mentionType,
        subtitle: mentionType === 'user' ? result.position :
                 mentionType === 'task' ? result.status :
                 mentionType === 'project' ? `${result.progress}% concluído` : ''
      }));
      setSuggestions(formatted);
      setShowSuggestions(formatted.length > 0);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  }, [mentionQuery, mentionType, searchMentions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;
    
    setMessage(value);
    setCursorPosition(cursor);

    // Detectar menções
    const beforeCursor = value.slice(0, cursor);
    const mentionMatch = beforeCursor.match(/[@#^](\w*)$/);
    
    if (mentionMatch) {
      const [fullMatch, query] = mentionMatch;
      const symbol = fullMatch[0];
      
      let type: Mention['type'];
      switch (symbol) {
        case '@': type = 'user'; break;
        case '#': type = 'task'; break;
        case '^': type = 'project'; break;
        default: return;
      }
      
      setMentionType(type);
      setMentionQuery(query);
    } else {
      setMentionType(null);
      setMentionQuery('');
      setShowSuggestions(false);
    }
  };

  const insertMention = (suggestion: MentionSuggestion) => {
    const beforeCursor = message.slice(0, cursorPosition);
    const afterCursor = message.slice(cursorPosition);
    
    // Encontrar o início da menção
    const mentionStart = beforeCursor.lastIndexOf(
      mentionType === 'user' ? '@' : 
      mentionType === 'task' ? '#' : '^'
    );
    
    const beforeMention = message.slice(0, mentionStart);
    const mentionText = `${mentionType === 'user' ? '@' : 
                        mentionType === 'task' ? '#' : '^'}${suggestion.displayName}`;
    
    const newMessage = beforeMention + mentionText + ' ' + afterCursor;
    setMessage(newMessage);
    setShowSuggestions(false);
    
    // Focar no input e posicionar cursor
    if (inputRef.current) {
      inputRef.current.focus();
      const newCursorPos = mentionStart + mentionText.length + 1;
      setTimeout(() => {
        inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (suggestions[selectedSuggestion]) {
            insertMention(suggestions[selectedSuggestion]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          break;
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim() && activeChannel) {
      // Extrair menções do texto
      const mentions: Mention[] = [];
      const mentionRegex = /[@#^](\w+)/g;
      let match;
      
      while ((match = mentionRegex.exec(message)) !== null) {
        const [fullMatch, name] = match;
        const symbol = fullMatch[0];
        const type = symbol === '@' ? 'user' : symbol === '#' ? 'task' : 'project';
        
        mentions.push({
          type,
          id: name, // Em um caso real, seria necessário resolver o ID
          displayName: name,
          startIndex: match.index,
          endIndex: match.index + fullMatch.length
        });
      }
      
      sendMessage(message.trim(), activeChannel.id, mentions);
      setMessage('');
    }
  };

  const getMentionIcon = (type: Mention['type']) => {
    switch (type) {
      case 'user': return <AtSign className="w-4 h-4" />;
      case 'task': return <Hash className="w-4 h-4" />;
      case 'project': return <Zap className="w-4 h-4" />;
    }
  };

  if (!activeChannel) return null;

  return (
    <div className="relative p-4 border-t bg-background">
      {/* Sugestões de Menção */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-popover border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent ${
                index === selectedSuggestion ? 'bg-accent' : ''
              }`}
              onClick={() => insertMention(suggestion)}
            >
              <div className="flex items-center gap-2">
                {getMentionIcon(suggestion.type)}
                {suggestion.avatar ? (
                  <img 
                    src={suggestion.avatar} 
                    alt={suggestion.displayName}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    {suggestion.displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{suggestion.displayName}</p>
                {suggestion.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{suggestion.subtitle}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Input de Mensagem */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Mensagem para ${activeChannel.type === 'direct' ? activeChannel.name : `#${activeChannel.name}`}`}
            className="w-full min-h-[44px] max-h-32 px-3 py-2 pr-20 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            rows={1}
          />
          
          {/* Botões de Ação no Input */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
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
          className="px-3 py-2 h-11"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Dicas de Menção */}
      <div className="mt-2 text-xs text-muted-foreground">
        <span className="font-medium">Dica:</span> Use @ para mencionar pessoas, # para tarefas e ^ para projetos
      </div>
    </div>
  );
};

export default MentionInput;
