// /src/lib/pusher.client.ts
import Pusher from 'pusher-js';

if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('Missing Pusher client env vars');
}

export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: '/api/pusher/auth',
  auth: {
    // if you need headers, add them here (e.g., Authorization)
  },
});
