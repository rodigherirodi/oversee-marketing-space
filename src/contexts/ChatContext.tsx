
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatChannel, ChatMessage, ChatUser, Mention, Reaction, Attachment, VoiceChannelState } from '@/types/chat';
import { mockTeamMembers } from '@/data/mockData';
import { mockClients, mockProjects, mockTasks } from '@/data/mockData';

interface ChatContextType {
  activeChannel: ChatChannel | null;
  setActiveChannel: (channel: ChatChannel) => void;
  channels: ChatChannel[];
  messages: ChatMessage[];
  users: ChatUser[];
  currentUser: ChatUser;
  voiceStates: VoiceChannelState[];
  sendMessage: (content: string, channelId: string, mentions?: Mention[], attachments?: Attachment[]) => void;
  markAsRead: (channelId: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  createChannel: (name: string, type: ChatChannel['type'], description?: string, participants?: string[]) => void;
  editChannel: (channelId: string, updates: Partial<ChatChannel>) => void;
  deleteChannel: (channelId: string) => void;
  joinVoiceChannel: (channelId: string, userId: string) => void;
  leaveVoiceChannel: (channelId: string, userId: string) => void;
  toggleMute: (channelId: string, userId: string) => void;
  uploadFile: (file: File, channelId: string) => Promise<Attachment>;
  searchMentions: (query: string, type: Mention['type']) => any[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Converter membros da equipe para usuários do chat
const convertTeamMembersToUsers = (): ChatUser[] => {
  return mockTeamMembers.map(member => ({
    id: member.id,
    name: member.name,
    avatar: member.avatar,
    status: member.status === 'active' ? 'online' : 
            member.status === 'vacation' ? 'away' : 'offline',
    position: member.position,
    department: member.department,
    customStatus: member.status === 'vacation' ? 'Em férias' : undefined
  }));
};

const mockChannels: ChatChannel[] = [
  {
    id: '1',
    name: 'geral',
    type: 'public',
    description: 'Canal geral da empresa',
    participants: mockTeamMembers.map(m => m.id),
    unreadCount: 3,
    createdBy: '1',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'projetos',
    type: 'public',
    description: 'Discussões sobre projetos',
    participants: mockTeamMembers.slice(0, 5).map(m => m.id),
    unreadCount: 1,
    createdBy: '1',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'design-review',
    type: 'private',
    description: 'Reviews de design e UX',
    participants: ['1', '3', '6'],
    unreadCount: 0,
    createdBy: '3',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: 'Sala Principal',
    type: 'voice',
    description: 'Canal de voz para reuniões',
    participants: mockTeamMembers.map(m => m.id),
    unreadCount: 0,
    connectedUsers: [],
    maxParticipants: 20,
    createdBy: '1',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Maria Santos',
    type: 'direct',
    participants: ['1', '2'],
    unreadCount: 2,
    createdAt: new Date('2024-03-01')
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    channelId: '1',
    authorId: '2',
    author: convertTeamMembersToUsers()[1],
    content: 'Bom dia pessoal! Como estão os projetos hoje? @Marina Costa',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'text',
    reactions: [
      { emoji: '👋', users: ['1', '3'], count: 2 },
      { emoji: '☀️', users: ['1'], count: 1 }
    ],
    attachments: [],
    mentions: [
      { type: 'user', id: '1', displayName: 'Marina Costa', startIndex: 45, endIndex: 57 }
    ]
  },
  {
    id: '2',
    channelId: '1',
    authorId: '3',
    author: convertTeamMembersToUsers()[2],
    content: 'Tudo certo por aqui! Acabei de finalizar a revisão do ^Campanha Black Friday',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    type: 'text',
    reactions: [
      { emoji: '🎉', users: ['1', '2'], count: 2 }
    ],
    attachments: [],
    mentions: [
      { type: 'project', id: '1', displayName: 'Campanha Black Friday', startIndex: 54, endIndex: 75 }
    ]
  },
  {
    id: '3',
    channelId: '1',
    authorId: '1',
    author: convertTeamMembersToUsers()[0],
    content: 'Excelente! Podemos agendar a reunião de review para hoje à tarde?',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: 'text',
    reactions: [],
    attachments: [],
    mentions: []
  }
];

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(mockChannels[0]);
  const [channels, setChannels] = useState<ChatChannel[]>(mockChannels);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [users] = useState<ChatUser[]>(convertTeamMembersToUsers());
  const [voiceStates, setVoiceStates] = useState<VoiceChannelState[]>([]);
  const currentUser = users[0];

  const sendMessage = (content: string, channelId: string, mentions: Mention[] = [], attachments: Attachment[] = []) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      channelId,
      authorId: currentUser.id,
      author: currentUser,
      content,
      timestamp: new Date(),
      type: 'text',
      reactions: [],
      attachments,
      mentions
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

  const addReaction = (messageId: string, emoji: string, userId: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (!existingReaction.users.includes(userId)) {
            existingReaction.users.push(userId);
            existingReaction.count++;
          }
        } else {
          message.reactions.push({ emoji, users: [userId], count: 1 });
        }
      }
      return message;
    }));
  };

  const removeReaction = (messageId: string, emoji: string, userId: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        message.reactions = message.reactions.map(reaction => {
          if (reaction.emoji === emoji) {
            reaction.users = reaction.users.filter(id => id !== userId);
            reaction.count = reaction.users.length;
          }
          return reaction;
        }).filter(reaction => reaction.count > 0);
      }
      return message;
    }));
  };

  const createChannel = (name: string, type: ChatChannel['type'], description?: string, participants?: string[]) => {
    const newChannel: ChatChannel = {
      id: Date.now().toString(),
      name,
      type,
      description,
      participants: participants || [currentUser.id],
      unreadCount: 0,
      createdBy: currentUser.id,
      createdAt: new Date(),
      connectedUsers: type === 'voice' ? [] : undefined
    };

    setChannels(prev => [...prev, newChannel]);
  };

  const editChannel = (channelId: string, updates: Partial<ChatChannel>) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId ? { ...channel, ...updates } : channel
    ));
  };

  const deleteChannel = (channelId: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== channelId));
    if (activeChannel?.id === channelId) {
      setActiveChannel(channels[0] || null);
    }
  };

  const joinVoiceChannel = (channelId: string, userId: string) => {
    setVoiceStates(prev => {
      const existing = prev.find(vs => vs.channelId === channelId);
      if (existing) {
        if (!existing.connectedUsers.find(u => u.userId === userId)) {
          existing.connectedUsers.push({
            userId,
            isMuted: false,
            isDeafened: false,
            joinedAt: new Date()
          });
          existing.isActive = true;
        }
        return prev;
      } else {
        return [...prev, {
          channelId,
          connectedUsers: [{
            userId,
            isMuted: false,
            isDeafened: false,
            joinedAt: new Date()
          }],
          isActive: true
        }];
      }
    });

    // Update channel connected users
    setChannels(prev => prev.map(channel => 
      channel.id === channelId && channel.type === 'voice'
        ? { ...channel, connectedUsers: [...(channel.connectedUsers || []), userId] }
        : channel
    ));
  };

  const leaveVoiceChannel = (channelId: string, userId: string) => {
    setVoiceStates(prev => prev.map(vs => {
      if (vs.channelId === channelId) {
        vs.connectedUsers = vs.connectedUsers.filter(u => u.userId !== userId);
        vs.isActive = vs.connectedUsers.length > 0;
      }
      return vs;
    }));

    setChannels(prev => prev.map(channel => 
      channel.id === channelId && channel.type === 'voice'
        ? { ...channel, connectedUsers: (channel.connectedUsers || []).filter(id => id !== userId) }
        : channel
    ));
  };

  const toggleMute = (channelId: string, userId: string) => {
    setVoiceStates(prev => prev.map(vs => {
      if (vs.channelId === channelId) {
        const user = vs.connectedUsers.find(u => u.userId === userId);
        if (user) {
          user.isMuted = !user.isMuted;
        }
      }
      return vs;
    }));
  };

  const uploadFile = async (file: File, channelId: string): Promise<Attachment> => {
    // Simular upload de arquivo
    return new Promise((resolve) => {
      setTimeout(() => {
        const attachment: Attachment = {
          id: Date.now().toString(),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          size: file.size,
          uploadedBy: currentUser.id,
          uploadedAt: new Date()
        };
        resolve(attachment);
      }, 1000);
    });
  };

  const searchMentions = (query: string, type: Mention['type']) => {
    switch (type) {
      case 'user':
        return users.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase())
        ).map(user => ({
          id: user.id,
          displayName: user.name,
          avatar: user.avatar,
          position: user.position
        }));
      
      case 'task':
        return mockTasks.filter(task => 
          task.title.toLowerCase().includes(query.toLowerCase())
        ).map(task => ({
          id: task.id,
          displayName: task.title,
          status: task.status,
          priority: task.priority
        }));
      
      case 'project':
        return mockProjects.filter(project => 
          project.name.toLowerCase().includes(query.toLowerCase())
        ).map(project => ({
          id: project.id,
          displayName: project.name,
          status: project.status,
          progress: project.progress
        }));
      
      default:
        return [];
    }
  };

  return (
    <ChatContext.Provider value={{
      activeChannel,
      setActiveChannel,
      channels,
      messages,
      users,
      currentUser,
      voiceStates,
      sendMessage,
      markAsRead,
      addReaction,
      removeReaction,
      createChannel,
      editChannel,
      deleteChannel,
      joinVoiceChannel,
      leaveVoiceChannel,
      toggleMute,
      uploadFile,
      searchMentions
    }}>
      {children}
    </ChatContext.Provider>
  );
};
