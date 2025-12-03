export interface RealtimeMessage {
  id: string;
  conversationId: string;
  businessProfileId: string;
  content: string | null;
  mediaUrl: string | null;
  type: string;
  direction: string;
  created_at: string;
}

export interface RealtimeConversation {
  id: string;
  businessProfileId: string;
  contactId: string;
  status: string;
  lastMessagePreview: string | null;
  lastMessageAt: string;
}

export interface RealtimeConversationUser {
  id: string;
  conversationId: string;
  userId: string;
  unreadCount: number;
}
