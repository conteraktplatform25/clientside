import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

export const getPusherClient = () => {
  if (!pusherClient) {
    pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    });
  }
  return pusherClient;
};

export const subscribeToChannel = (channelName: string) => {
  const pusher = getPusherClient();
  return pusher.subscribe(channelName);
};

export const unsubscribeFromChannel = (channelName: string) => {
  const pusher = getPusherClient();
  pusher.unsubscribe(channelName);
};
