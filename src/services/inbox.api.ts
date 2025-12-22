import {
  TConversationListResponse,
  TConversationQuery,
  TConversationResponse,
  TCreateConversation,
  TCreateConversationResponse,
  TCreateMessageResponse,
  TMessageDetailsResponse,
  TStartConversation,
} from '@/lib/schemas/business/server/inbox.schema';
import { fetchJSON } from '@/utils/response';

export async function apiFetchConversations(params: TConversationQuery) {
  const url = new URL('/api/inbox/conversations', window.location.origin);
  if (params.page) url.searchParams.set('page', String(params.page));
  if (params.limit) url.searchParams.set('limit', String(params.limit));
  if (params.search) url.searchParams.set('search', params.search);
  return fetchJSON<TConversationListResponse>(url.toString());
}

export async function apiCreateConversation(data: TCreateConversation) {
  return fetchJSON<TCreateConversationResponse>('/api/inbox/conversations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiFetchConversation(conversationId: string) {
  return fetchJSON<TMessageDetailsResponse>(`/api/inbox/conversations/${conversationId}`);
}

// message list with cursor
export async function apiFetchMessages(
  conversationId: string,
  params: { limit?: number; cursor?: string }
): Promise<TMessageDetailsResponse> {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.cursor) query.set('cursor', params.cursor);

  return fetchJSON<TMessageDetailsResponse>(`/api/inbox/conversations/${conversationId}/messages?${query.toString()}`);
}

/**
 * Send message (outbound)
 */
export async function apiSendMessage(
  conversationId: string,
  payload: { content?: string; mediaUrl?: string | null }
): Promise<TCreateMessageResponse> {
  return fetchJSON<TCreateMessageResponse>(`/api/inbox/conversations/${conversationId}/messages/meta-ai`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Mark conversation read
 */
export async function apiMarkConversationRead(conversationId: string): Promise<{ ok: boolean }> {
  return fetchJSON<{ ok: boolean }>(`/api/inbox/conversations/${conversationId}/read`, { method: 'POST' });
}

export async function apiStartConversation(payload: TStartConversation) {
  const res = await fetchJSON<TConversationResponse>('/api/inbox/conversations/start', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return res;
}
