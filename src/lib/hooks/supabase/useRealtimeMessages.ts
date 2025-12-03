import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { RealtimeMessage } from '@/type/client/supabase-realtime.type';

interface RealTimeMessageProps {
  businessProfileId: string;
  onInsert?: (msg: RealtimeMessage) => void;
  onUpdate?: (msg: RealtimeMessage) => void;
}

export function useRealtimeMessages({ businessProfileId, onInsert, onUpdate }: RealTimeMessageProps) {
  useEffect(() => {
    if (!businessProfileId) return;

    const channel = supabase
      .channel(`messages:${businessProfileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Message',
          filter: `businessProfileId=eq.${businessProfileId}`,
        },
        (payload) => {
          if (!payload || !('new' in payload)) return;

          const data = payload.new as unknown;
          if (!data || typeof data !== 'object') return;

          const msg = data as RealtimeMessage;

          if (payload.eventType === 'INSERT' && onInsert) {
            onInsert(msg);
          }

          if (payload.eventType === 'UPDATE' && onUpdate) {
            onUpdate(msg);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessProfileId, onInsert, onUpdate]);
}

// export function useRealtimeMessages(conversationId: string | null, onNewMessage: string | null) {
//   useEffect(() => {
//     if (!conversationId) return;

//     const channel = supabase
//       .channel(`conversation:${conversationId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "Message",
//           filter: `conversationId=eq.${conversationId}`,
//         },
//         (payload) => {
//           onNewMessage(payload.new);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [conversationId]);
// }
