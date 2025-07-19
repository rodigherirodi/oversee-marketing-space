
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct' | 'group';
  description?: string;
  participants: string[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  isStarred?: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  author: ChatUser;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  threadId?: string;
  reactions?: { emoji: string; users: string[] }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface ChatThread {
  id: string;
  messageId: string;
  messages: ChatMessage[];
  participantCount: number;
}
