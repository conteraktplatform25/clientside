import Pusher from 'pusher';

const appId = process.env.PUSHER_APP_ID!;
const key = process.env.PUSHER_KEY!;
const secret = process.env.PUSHER_SECRET!;
const cluster = process.env.PUSHER_CLUSTER!;

if (!appId || !key || !secret || !cluster) {
  throw new Error('Missing Pusher environment variables');
}

export const pusherServer = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

/**
 * Trigger an event on a business-scoped private channel
 * Example channel: `private-business-<businessProfileId>`
 */
export function triggerMessageCreated(businessProfileId: string, payload: unknown) {
  const channel = `private-business-${businessProfileId}`;
  return pusherServer.trigger(channel, 'message.created', payload);
}
