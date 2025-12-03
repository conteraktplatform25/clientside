import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { RealtimeConversation } from '@/type/client/supabase-realtime.type';

interface Props {
  businessProfileId: string;
  onInsert?: (c: RealtimeConversation) => void;
  onUpdate?: (c: RealtimeConversation) => void;
}

export function useRealtimeConversations({ businessProfileId, onInsert, onUpdate }: Props): void {
  useEffect(() => {
    if (!businessProfileId) return;

    const channel = supabase
      .channel(`conversations:${businessProfileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Conversation',
          filter: `businessProfileId=eq.${businessProfileId}`,
        },
        (payload) => {
          if (!payload || !('new' in payload)) return;

          const data = payload.new as unknown;
          if (!data || typeof data !== 'object') return;

          const conv = data as RealtimeConversation;

          if (payload.eventType === 'INSERT' && onInsert) onInsert(conv);
          if (payload.eventType === 'UPDATE' && onUpdate) onUpdate(conv);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessProfileId, onInsert, onUpdate]);
}
