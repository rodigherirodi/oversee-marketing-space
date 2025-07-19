
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy' | 'dnd';
  lastSeen?: Date;
  customStatus?: string;
  position?: string;
  department?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct' | 'group' | 'voice';
  description?: string;
  participants: string[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  isStarred?: boolean;
  createdBy?: string;
  createdAt?: Date;
  connectedUsers?: string[]; // Para canais de voz
  maxParticipants?: number;
  isArchived?: boolean;
}

export interface Mention {
  type: 'user' | 'task' | 'project';
  id: string;
  displayName: string;
  startIndex: number;
  endIndex: number;
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  thumbnail?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  author: ChatUser;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'system';
  threadId?: string;
  parentMessageId?: string;
  reactions: Reaction[];
  attachments: Attachment[];
  mentions: Mention[];
  isEdited?: boolean;
  editedAt?: Date;
  isDeleted?: boolean;
}

export interface ChatThread {
  id: string;
  messageId: string;
  messages: ChatMessage[];
  participantCount: number;
  lastActivity: Date;
}

export interface VoiceChannelState {
  channelId: string;
  connectedUsers: {
    userId: string;
    isMuted: boolean;
    isDeafened: boolean;
    joinedAt: Date;
  }[];
  isActive: boolean;
}

export interface ChannelSettings {
  notifications: boolean;
  mentionAlerts: boolean;
  autoArchive: boolean;
  allowFileUploads: boolean;
  allowVoice: boolean;
}
