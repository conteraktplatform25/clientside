import { create } from 'zustand';
// import { ChatState, Conversation, Message, User } from '@/types/chat';
import { UserProfile, ChatState, Conversation, Message } from '@/type/client/business/survey/inbox-survey.type';

export const useChatStore = create<ChatState>((set, get) => ({
  currentUser: null,
  conversations: [],
  activeConversation: null,
  messages: {},
  isLoading: false,

  setCurrentUser: (profile: UserProfile) => {
    set({ currentUser: profile });
  },

  setActiveConversation: (conversation: Conversation | null) => {
    set({ activeConversation: conversation });
  },

  addMessage: (message: Message) => {
    const { messages, conversations } = get();
    const conversationMessages = messages[message.conversationId] || [];

    set({
      messages: {
        ...messages,
        [message.conversationId]: [...conversationMessages, message],
      },
    });

    // Update conversation last message
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === message.conversationId) {
        return {
          ...conv,
          lastMessage: message,
          updatedAt: message.timestamp,
          unreadCount: message.senderId === get().currentUser?.id ? 0 : conv.unreadCount + 1,
        };
      }
      return conv;
    });

    set({ conversations: updatedConversations });
  },

  setMessages: (conversationId: string, messages: Message[]) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    }));
  },

  updateConversation: (conversation: Conversation) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => (conv.id === conversation.id ? conversation : conv)),
    }));
  },
}));
