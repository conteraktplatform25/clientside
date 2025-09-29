export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: UserProfile[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface ChatState {
  currentUser: UserProfile | null;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  setCurrentUser: (user: UserProfile) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  updateConversation: (conversation: Conversation) => void;
}
