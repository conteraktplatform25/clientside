// /src/hooks/useInbox.ts
import { useQuery, useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
//import { pusherClient } from '@/lib/pusher.client';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import {
  apiFetchConversations,
  apiCreateConversation,
  apiFetchConversation,
  apiFetchMessages,
  apiSendMessage,
  apiMarkConversationRead,
  apiStartConversation,
} from '@/services/inbox.api';
import {
  TConversationListResponse,
  TMessageDetailsResponse,
  TCreateConversationResponse,
  TCreateMessageResponse,
  TConversationQuery,
  TCreateConversation,
  TMessageDataResponse,
  TStartConversation,
  TConversationResponse,
} from '@/lib/schemas/business/server/inbox.schema';
import { useEffect } from 'react';

type TMessagesInfinite = InfiniteData<TMessageDetailsResponse>;

/* ------------------------------
  useInboxConversations
--------------------------------*/
export function useInboxConversations({ page = 1, limit = 25, search = '' }: TConversationQuery) {
  const key = ['inbox:conversations', page, limit, search] as const;
  const setConversationsCache = useInboxStore((s) => s.setConversationsCache);

  const query = useQuery<TConversationListResponse>({
    queryKey: key,
    queryFn: () => apiFetchConversations({ page, limit, search }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (query.data?.conversations) setConversationsCache(query.data.conversations);
  }, [query.data?.conversations, setConversationsCache]);

  return query;
}

/* ------------------------------
  useInboxConversation (meta)
--------------------------------*/
export function useInboxConversation(conversationId: string | null) {
  return useQuery<TMessageDetailsResponse | null>({
    queryKey: ['inbox:conversation', conversationId],
    queryFn: () => (conversationId ? apiFetchConversation(conversationId) : Promise.resolve(null)),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5,
  });
}

/* ------------------------------
  useInboxMessages (infinite)
--------------------------------*/
export function useInboxMessages(conversationId: string | null, pageSize = 25) {
  const setMessages = useInboxStore((s) => s.setMessages);

  const query = useInfiniteQuery<
    // one page type
    TMessageDetailsResponse,
    // error
    Error,
    // data returned by hook (infinite form)
    InfiniteData<TMessageDetailsResponse>,
    // query key
    ['inbox:messages', string | null],
    // page param type
    string | undefined
  >({
    queryKey: ['inbox:messages', conversationId],
    // explicitly type pageParam
    queryFn: async ({ pageParam }: { pageParam?: string | undefined }) => {
      if (!conversationId) throw new Error('conversationId is required');
      return apiFetchMessages(conversationId, { limit: pageSize, cursor: pageParam });
    },
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5,
    initialPageParam: undefined,
    //cacheTime: 1000 * 60 * 30,
  });

  // sync fetched pages → zustand (flatten pages into an array)
  useEffect(() => {
    // if conversationId cleared, don't write anything
    if (!conversationId) return;

    if (!query.data) {
      // ensure store has at least an empty array while loading
      setMessages(conversationId, []);
      return;
    }

    const all = query.data.pages.flatMap((p) => p.messages ?? []);
    setMessages(conversationId, all);
  }, [query.data, conversationId, setMessages]);

  return query; // let TS infer the exact UseInfiniteQueryResult type
}
// export function useInboxMessages(conversationId: string | null, pageSize = 25): UseInfiniteQueryResult {
//   const setMessages = useInboxStore((s) => s.setMessages);

//   const query = useInfiniteQuery<
//     TMessageDetailsResponse,
//     Error,
//     InfiniteData<TMessageDetailsResponse>,
//     ['inbox:messages', string | null],
//     string | undefined
//   >({
//     queryKey: ['inbox:messages', conversationId],
//     queryFn: async ({ pageParam }) =>
//       apiFetchMessages(String(conversationId), {
//         limit: pageSize,
//         cursor: pageParam,
//       }),
//     getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
//     initialPageParam: undefined,
//     enabled: !!conversationId,
//     staleTime: 1000 * 60 * 5,
//   });

//   // sync query -> zustand
//   useEffect(() => {
//     if (!conversationId) return;
//     if (!query.data) return;

//     const all = query.data.pages.flatMap((p) => p.messages ?? []);
//     setMessages(conversationId, all);
//   }, [query.data, conversationId, setMessages]);

//   return query;
// }

/* ------------------------------
  useSendMessage
--------------------------------*/
export function useSendMessage(conversationId: string | null) {
  const queryClient = useQueryClient();
  const addMessage = useInboxStore((s) => s.addMessage);

  return useMutation<
    TCreateMessageResponse,
    Error,
    { content?: string; mediaUrl?: string | null },
    { previous?: TMessagesInfinite; tempId?: string }
  >({
    mutationKey: ['inbox:send', conversationId],
    mutationFn: (payload) => apiSendMessage(String(conversationId), payload),

    onMutate: async (newMsg) => {
      if (!conversationId) return { previous: undefined };

      await queryClient.cancelQueries({ queryKey: ['inbox:messages', conversationId] });
      const previous = queryClient.getQueryData<TMessagesInfinite>(['inbox:messages', conversationId]);

      // optimistic message (try to align shape with TMessageDataResponse)
      const tempId = `temp-${Date.now()}`;
      const optimistic: TMessageDataResponse = {
        id: tempId,
        senderContact: {
          id: 'me',
          name: null,
          phone_number: '',
          status: 'ACTIVE',
        },
        senderUser: {
          first_name: null,
          last_name: null,
        },
        businessProfile: {
          id: 'temp',
          company_name: '',
          business_number: null,
        },
        channel: 'WHATSAPP',
        direction: 'OUTBOUND',
        deliveryStatus: 'SENT',
        type: newMsg.mediaUrl ? 'IMAGE' : 'TEXT',
        content: newMsg.content ?? null,
        mediaUrl: newMsg.mediaUrl ?? null,
        mediaType: null,
        rawPayload: null,
        whatsappMessageId: null,
        created_at: new Date(),
      };
      addMessage(conversationId, optimistic);

      // update messages cache
      queryClient.setQueryData<TMessagesInfinite>(['inbox:messages', conversationId], (old) => {
        if (!old) return old;
        const newPages = old.pages.map((page, index) =>
          index === 0
            ? {
                ...page,
                messages: [optimistic, ...(page.messages ?? [])],
              }
            : page
        );
        return { ...old, pages: newPages };
      });

      // update conversation preview in list (guard old)
      queryClient.setQueryData<TConversationListResponse | undefined>(['inbox:conversations', 1, 25, ''], (old) => {
        if (!old) return old;
        const convs = (old.conversations || []).map((c) =>
          c.id === conversationId ? { ...c, lastMessagePreview: newMsg.content ?? null, lastMessageAt: new Date() } : c
        );
        return { ...old, conversations: convs };
      });

      return { previous, tempId };
    },

    // ---------- ROLLBACK ----------
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['inbox:messages', conversationId], context.previous);
      }
    },

    onSuccess: (data) => {
      // server will likely send pusher event; still invalidate to be safe
      queryClient.invalidateQueries({ queryKey: ['inbox:messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['inbox:conversations'] });
      addMessage(conversationId!, data);
    },
  });
}

/* ------------------------------
  useCreateConversation
--------------------------------*/
export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation<
    TCreateConversationResponse,
    Error,
    TCreateConversation,
    { previous?: TConversationListResponse; tempId?: string }
  >({
    mutationKey: ['inbox:createConversation'],
    mutationFn: (payload) => apiCreateConversation(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['inbox:conversations', 1, 25, ''] });
      const previous: TConversationListResponse | undefined = queryClient.getQueryData([
        'inbox:conversations',
        1,
        25,
        '',
      ]);
      const tempId = `temp-c-${Date.now()}`;
      if (previous) {
        queryClient.setQueryData(['inbox:conversations', 1, 25, ''], {
          ...previous,
          conversations: [
            {
              id: tempId,
              contact: { id: payload.contactId, name: null, phone_number: null, status: 'ACTIVE' },
              channel: payload.channel ?? 'WHATSAPP',
              created_at: new Date(),
              lastMessageAt: new Date(),
              lastMessagePreview: null,
              status: 'OPEN',
              assignee: null,
              businessProfile: { id: 'unknown', company_name: '', business_number: null },
            },
            ...(previous.conversations || []),
          ],
          pagination: { ...(previous.pagination || {}), total: (previous.pagination?.total || 0) + 1 },
        });
      }
      return { previous, tempId };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['inbox:conversations', 1, 25, ''], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox:conversations'] });
    },
  });
}

/* ------------------------------
  useMarkConversationRead
--------------------------------*/
export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['inbox:markRead'],
    mutationFn: (conversationId: string) => apiMarkConversationRead(conversationId),
    onSuccess: (_res, conversationId) => {
      // reset unread in store
      useInboxStore.getState().resetUnread(conversationId as string);
      queryClient.invalidateQueries({ queryKey: ['inbox:conversations'] });
    },
  });
}

/**
 * React hook to start (or reopen) a conversation.
 * Automatically updates:
 *   - conversation list (inbox)
 *   - returns the created conversation response
 */
export function useStartConversation() {
  const queryClient = useQueryClient();

  return useMutation<
    TConversationResponse,
    Error,
    TStartConversation,
    { previous?: TConversationListResponse; tempId?: string }
  >({
    mutationKey: ['conversation:start'],
    mutationFn: (payload) => apiStartConversation(payload),

    /*******************************
     * OPTIMISTIC UPDATE
     *******************************/
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['inbox:conversations', 1, 25, ''] });
      const previous: TConversationListResponse | undefined = queryClient.getQueryData([
        'inbox:conversations',
        1,
        25,
        '',
      ]);
      const tempId = `temp-c-${Date.now()}`;
      if (previous) {
        queryClient.setQueryData(['inbox:conversations', 1, 25, ''], {
          ...previous,
          conversations: [
            {
              id: tempId,
              contact: { id: payload.contactId, name: null, phone_number: null, status: 'ACTIVE' },
              channel: 'WHATSAPP',
              created_at: new Date(),
              lastMessageAt: new Date(),
              lastMessagePreview: null,
              status: 'OPEN',
              assignee: null,
              businessProfile: { id: 'unknown', company_name: '', business_number: null },
            },
            ...(previous.conversations || []),
          ],
          pagination: { ...(previous.pagination || {}), total: (previous.pagination?.total || 0) + 1 },
        });
      }
      return { previous, tempId };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['inbox:conversations', 1, 25, ''], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox:conversations'] });
    },
  });
}
