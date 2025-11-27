import {
  TMessageDataResponse,
  TConversationResponse,
  TCreateMessageResponse,
} from '@/lib/schemas/business/server/inbox.schema';
import { create } from 'zustand';
import { InboxFilterState } from '@/lib/schemas/business/server/inbox.schema';

// const EMPTY_MESSAGES: TMessageDataResponse[] = [];

export type TInboxState = {
  selectedConversationId: string | null;
  businessProfileId: string | null;

  // store messages per conversation
  messagesByConversation: Record<string, TCreateMessageResponse[]>;
  contactsById: Record<string, { id: string; name: string | null; phone_number: string }>;
  conversations: TConversationResponse[];

  // cached conversation list (client-side) — optional
  conversationsCache?: TConversationResponse[];

  // unread map
  unreadMap: Record<string, number>;

  // filters
  filters: InboxFilterState;

  // actions
  setSelectedConversation: (id: string | null) => void;
  setBusinessProfileId: (id: string | null) => void;
  setMessages: (conversationId: string, messages: TMessageDataResponse[]) => void;
  addMessage: (conversationId: string, message: TCreateMessageResponse) => void;
  setConversationsCache: (convs: TConversationResponse[]) => void;

  // unread
  setUnread: (conversationId: string, count: number) => void;
  incrementUnread: (conversationId: string, by?: number) => void;
  resetUnread: (conversationId: string) => void;

  // filters
  setFilters: (filters: InboxFilterState) => void;
  setConversations: (convs: TConversationResponse[]) => void;

  // real-time handler
  preloadConversation: (
    conversationId: string,
    contactInfo: { id: string; name: string | null; phone_number: string }
  ) => void;
  onMessage: (payload: TMessageDataResponse) => void;
};

export const useInboxStore = create<TInboxState>((set, get) => ({
  selectedConversationId: null,
  businessProfileId: null,

  messagesByConversation: {},
  contactsById: {},
  conversations: [],

  conversationsCache: [],
  unreadMap: {},

  // default filters
  filters: { status: 'ALL', channel: 'ALL', assigned: 'ALL', search: '' },

  setSelectedConversation: (id) => {
    set({ selectedConversationId: id });
    if (id) {
      get().resetUnread(id);
    }
  },
  setBusinessProfileId: (id) => set({ businessProfileId: id }),

  setMessages: (conversationId, messages) =>
    set((s) => ({ messagesByConversation: { ...s.messagesByConversation, [conversationId]: messages } })),
  addMessage: (conversationId, message) =>
    set((s) => {
      const existing = s.messagesByConversation[conversationId] ?? [];
      if (existing.find((m) => m.id === message.id)) return { messagesByConversation: s.messagesByConversation };
      return { messagesByConversation: { ...s.messagesByConversation, [conversationId]: [...existing, message] } };
    }),

  setConversationsCache: (convs) => set({ conversationsCache: convs }),
  setConversations: (convs: TConversationResponse[]) => set({ conversations: convs }),

  setUnread: (conversationId, count) => set((s) => ({ unreadMap: { ...s.unreadMap, [conversationId]: count } })),
  incrementUnread: (conversationId, by = 1) =>
    set((s) => ({ unreadMap: { ...s.unreadMap, [conversationId]: (s.unreadMap[conversationId] || 0) + by } })),
  resetUnread: (conversationId) => set((s) => ({ unreadMap: { ...s.unreadMap, [conversationId]: 0 } })),

  setFilters: (filters) => set({ filters }),

  preloadConversation: (conversationId, contactInfo) =>
    set((s) => ({
      selectedConversationId: conversationId,
      contactsById: {
        ...s.contactsById,
        [contactInfo.id]: contactInfo,
      },
      messagesByConversation: {
        ...s.messagesByConversation,
        [conversationId]: s.messagesByConversation[conversationId] ?? [],
      },
    })),

  onMessage: (message) => {
    const state = get();
    const convoId = message.businessProfile?.id || message.senderContact?.id || 'unknown-convo';

    // Append message to correct conversation
    const existing = state.messagesByConversation[convoId] || [];

    set({
      messagesByConversation: {
        ...state.messagesByConversation,
        [convoId]: [...existing, message],
      },
    });
  },
}));
