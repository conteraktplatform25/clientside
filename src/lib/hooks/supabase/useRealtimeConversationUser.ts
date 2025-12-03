import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { RealtimeConversationUser } from '@/type/client/supabase-realtime.type';

interface Props {
  conversationId: string;
  onUpdate?: (cu: RealtimeConversationUser) => void;
}

export function useRealtimeConversationUser({ conversationId, onUpdate }: Props): void {
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conv-users:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ConversationUser',
          filter: `conversationId=eq.${conversationId}`,
        },
        (payload) => {
          if (!payload || !('new' in payload)) return;

          const data = payload.new as unknown;
          if (!data || typeof data !== 'object') return;

          const cu = data as RealtimeConversationUser;

          if (onUpdate) onUpdate(cu);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, onUpdate]);
}
