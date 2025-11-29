import { create } from 'zustand';
import {
  TMessageDataResponse,
  TConversationResponse,
  InboxFilterState,
} from '@/lib/schemas/business/server/inbox.schema';
import { MessageDeliveryStatus, MessageType } from '@prisma/client';

export type TInboxMessage = TMessageDataResponse;

export type InboxState = {
  selectedConversationId: string | null;
  businessProfileId: string | null;

  messagesByConversation: Record<string, TInboxMessage[]>;
  conversations: TConversationResponse[];
  conversationsCache: TConversationResponse[]; // optional cache for client filtering
  unreadMap: Record<string, number>;
  filters: InboxFilterState;

  // actions
  setSelectedConversation: (id: string | null) => void;
  setBusinessProfileId: (id: string | null) => void;

  // replace entire list for a conversation (seeded from server)
  setMessages: (conversationId: string, messages: TInboxMessage[]) => void;

  // append single message (deduped)
  addMessage: (conversationId: string, message: TInboxMessage) => void;

  setConversations: (convs: TConversationResponse[]) => void;
  setConversationsCache: (convs: TConversationResponse[]) => void;

  setUnread: (conversationId: string, count: number) => void;
  incrementUnread: (conversationId: string, by?: number) => void;
  resetUnread: (conversationId: string) => void;

  setFilters: (f: InboxFilterState) => void;

  // realtime handlers
  onMessage: (raw: Partial<TMessageDataResponse> & { conversationId?: string }) => void;
  onMessageStatusUpdate: (payload: { messageSid: string; messageStatus: string }) => void;
};

export const useInboxStore = create<InboxState>((set, get) => ({
  selectedConversationId: null,
  businessProfileId: null,

  messagesByConversation: {},
  conversations: [],
  conversationsCache: [],
  unreadMap: {},
  filters: { status: 'ALL', channel: 'ALL', assigned: 'ALL', search: '' },

  setSelectedConversation: (id) => {
    set({ selectedConversationId: id });
    if (id) get().resetUnread(id);
  },

  setBusinessProfileId: (id) => set({ businessProfileId: id }),

  setMessages: (conversationId, messages) =>
    set((s) => ({
      messagesByConversation: {
        ...s.messagesByConversation,
        [conversationId]: [...messages].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      },
    })),

  addMessage: (conversationId, message) =>
    set((s) => {
      const existing = s.messagesByConversation[conversationId] ?? [];

      // dedupe by whatsappMessageId or id
      const already = message.whatsappMessageId
        ? existing.some((m) => m.whatsappMessageId === message.whatsappMessageId)
        : existing.some((m) => m.id === message.id);

      if (already) return {};

      const merged = [...existing, message].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      return {
        messagesByConversation: {
          ...s.messagesByConversation,
          [conversationId]: merged,
        },
      };
    }),

  setConversations: (convs) => set({ conversations: convs }),
  setConversationsCache: (convs) => set({ conversationsCache: convs }),

  setUnread: (conversationId, count) => set((s) => ({ unreadMap: { ...s.unreadMap, [conversationId]: count } })),

  incrementUnread: (conversationId, by = 1) =>
    set((s) => ({
      unreadMap: { ...s.unreadMap, [conversationId]: (s.unreadMap[conversationId] || 0) + by },
    })),

  resetUnread: (conversationId) => set((s) => ({ unreadMap: { ...s.unreadMap, [conversationId]: 0 } })),

  setFilters: (f) => set({ filters: f }),

  onMessage: (raw) => {
    // Normalize timestamp and conversation id
    const message: TMessageDataResponse = {
      id: raw.id ?? `temp-${Date.now()}`,
      conversationId: raw.conversationId ?? raw.whatsappMessageId ?? 'unknown-convo',
      businessProfile: raw.businessProfile!,
      senderContact: raw.senderContact ?? null,
      senderUser: raw.senderUser ?? null,
      channel: raw.channel ?? 'WHATSAPP',
      direction: raw.direction ?? 'INBOUND',
      deliveryStatus: (raw.deliveryStatus as MessageDeliveryStatus) ?? 'SENT',
      type: (raw.type as MessageType) ?? (raw.mediaUrl ? 'IMAGE' : 'TEXT'),
      content: raw.content ?? null,
      mediaUrl: raw.mediaUrl ?? null,
      mediaType: raw.mediaType ?? null,
      rawPayload: raw.rawPayload ?? null,
      whatsappMessageId: raw.whatsappMessageId ?? null,
      created_at: raw.created_at ?? new Date().toISOString(),
    };

    const convoId = message.conversationId;
    if (!convoId) {
      console.error('[inbox.store] missing conversationId for incoming message', raw);
      return;
    }

    get().addMessage(convoId, message);

    const selected = get().selectedConversationId;
    if (selected !== convoId) get().incrementUnread(convoId);
  },

  onMessageStatusUpdate: ({ messageSid, messageStatus }) => {
    const all = get().messagesByConversation;
    // search for message by whatsappMessageId
    for (const convoId of Object.keys(all)) {
      const msgs = all[convoId];
      const idx = msgs.findIndex((m) => m.whatsappMessageId === messageSid || m.id === messageSid);
      if (idx >= 0) {
        const updated = [...msgs];
        updated[idx] = { ...updated[idx], deliveryStatus: messageStatus as MessageDeliveryStatus };
        set({
          messagesByConversation: { ...all, [convoId]: updated },
        });
        break;
      }
    }
  },
}));
