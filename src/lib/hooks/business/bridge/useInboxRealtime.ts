'use client';

import { useEffect } from 'react';
import { initPusherClient } from '@/lib/pusher-client';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import type { TMessageDataResponse } from '@/lib/schemas/business/server/inbox.schema';

interface PusherStateChange {
  previous: string;
  current: string;
}

export function useInboxRealtime(businessId: string | null, authToken: string | null) {
  const onMessage = useInboxStore((s) => s.onMessage);
  const onStatus = useInboxStore((s) => s.onMessageStatusUpdate);

  useEffect(() => {
    if (!businessId) {
      console.log('[Realtime] no businessId — skipping');
      return;
    }
    if (!authToken) {
      console.log('[Realtime] no authToken — skipping (pusher private channels require auth)');
      return;
    }

    const pusher = initPusherClient(authToken);
    if (!pusher) {
      console.error('[Realtime] Failed to init pusher client');
      return;
    }

    const channelName = `private-business-${businessId}`;
    const channel = pusher.subscribe(channelName);

    // debug
    pusher.connection.bind('state_change', (s: PusherStateChange) => console.log('[Realtime] state_change', s));
    pusher.connection.bind('error', (err: unknown) => console.error('[Realtime] pusher err', err));
    channel.bind('pusher:subscription_succeeded', () => console.log('[Realtime] subscribed', channelName));
    channel.bind('pusher:subscription_error', (err: unknown) => console.error('[Realtime] subscription error', err));

    // inbound message (server uses 'message.created')
    // const onMessageCreated = (payload: {
    //   conversationId: string;
    //   message: TMessageDataResponse;
    //   contact?: unknown;
    // }) => {
    //   // Defensive: ensure payload.message has conversationId; server should include
    //   const message = payload.message;
    //   if (!message.conversationId && payload.conversationId) message.conversationId = payload.conversationId;
    //   if (!message.conversationId) {
    //     console.warn('[Realtime] incoming message missing conversationId', payload);
    //     return;
    //   }
    //   onMessage(message);
    // };

    // status
    // const onStatusUpdated = (payload: { messageSid: string; messageStatus: string; raw?: unknown }) => {
    //   onStatus({ messageSid: payload.messageSid, messageStatus: payload.messageStatus });
    // };

    // server event names: message.created and message.status.updated
    channel.bind(
      'message.created',
      (payload: { conversationId?: string; message?: TMessageDataResponse; contact?: unknown }) => {
        // normalize: server may send { conversationId, message } or message directly
        const message = (payload.message ?? payload) as Partial<TMessageDataResponse> & { conversationId?: string };
        if (payload.conversationId && !message.conversationId) message.conversationId = payload.conversationId;
        onMessage(message);
      }
    );
    channel.bind('message.status.updated', (payload: { messageSid: string; messageStatus: string }) => {
      onStatus({ messageSid: payload.messageSid, messageStatus: payload.messageStatus });
    });

    return () => {
      try {
        channel.unbind();
        pusher.unsubscribe(channelName);
      } catch {
        /* ignore */
      }
    };
  }, [businessId, authToken, onMessage, onStatus]);
}
