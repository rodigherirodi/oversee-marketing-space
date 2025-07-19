
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatChannel, ChatMessage, ChatUser } from '@/types/chat';

interface ChatContextType {
  activeChannel: ChatChannel | null;
  setActiveChannel: (channel: ChatChannel) => void;
  channels: ChatChannel[];
  messages: ChatMessage[];
  users: ChatUser[];
  currentUser: ChatUser;
  sendMessage: (content: string, channelId: string) => void;
  markAsRead: (channelId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Mock data
const mockUsers: ChatUser[] = [
  {
    id: '1',
    name: 'João Silva',
    avatar: 'JS',
    status: 'online'
  },
  {
    id: '2',
    name: 'Maria Santos',
    avatar: 'MS',
    status: 'away'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    avatar: 'PC',
    status: 'online'
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    avatar: 'AO',
    status: 'offline'
  }
];

const mockChannels: ChatChannel[] = [
  {
    id: '1',
    name: 'geral',
    type: 'public',
    description: 'Canal geral da empresa',
    participants: ['1', '2', '3', '4'],
    unreadCount: 3
  },
  {
    id: '2',
    name: 'projetos',
    type: 'public',
    description: 'Discussões sobre projetos',
    participants: ['1', '2', '3'],
    unreadCount: 1
  },
  {
    id: '3',
    name: 'avisos',
    type: 'public',
    description: 'Avisos importantes',
    participants: ['1', '2', '3', '4'],
    unreadCount: 0
  },
  {
    id: '4',
    name: 'Maria Santos',
    type: 'direct',
    participants: ['1', '2'],
    unreadCount: 2
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    channelId: '1',
    authorId: '2',
    author: mockUsers[1],
    content: 'Bom dia pessoal! Como estão os projetos hoje?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'text'
  },
  {
    id: '2',
    channelId: '1',
    authorId: '3',
    author: mockUsers[2],
    content: 'Tudo certo por aqui! Acabei de finalizar a revisão do código.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    type: 'text'
  },
  {
    id: '3',
    channelId: '1',
    authorId: '1',
    author: mockUsers[0],
    content: 'Excelente! Podemos agendar a reunião de review para hoje à tarde?',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: 'text'
  }
];

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(mockChannels[0]);
  const [channels, setChannels] = useState<ChatChannel[]>(mockChannels);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [users] = useState<ChatUser[]>(mockUsers);
  const currentUser = mockUsers[0];

  const sendMessage = (content: string, channelId: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      channelId,
      authorId: currentUser.id,
      author: currentUser,
      content,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);

    // Update channel's last message
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, lastMessage: newMessage }
        : channel
    ));
  };

  const markAsRead = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, unreadCount: 0 }
        : channel
    ));
  };

  return (
    <ChatContext.Provider value={{
      activeChannel,
      setActiveChannel,
      channels,
      messages,
      users,
      currentUser,
      sendMessage,
      markAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};
