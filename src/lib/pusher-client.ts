'use client';

import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

export function initPusherClient(authToken: string) {
  if (typeof window === 'undefined') return null;
  if (pusherClient) return pusherClient;

  pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher/auth',
    auth: {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    },
  });
  return pusherClient;
}

export function getPusherClient(): Pusher | null {
  return pusherClient;
}

export function subscribe(channelName: string) {
  const p = getPusherClient();
  if (!p) throw new Error('Pusher not initialized (call initPusherClient first)');
  return p.subscribe(channelName);
}

export function unsubscribe(channelName: string) {
  const p = getPusherClient();
  if (!p) return;
  p.unsubscribe(channelName);
}
