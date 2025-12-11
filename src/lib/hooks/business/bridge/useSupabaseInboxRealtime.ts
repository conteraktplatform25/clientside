import { useEffect } from 'react';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import { createClient } from '@supabase/supabase-js';
import { TConversationResponse } from '@/lib/schemas/business/server/inbox.schema';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

export function useSupabaseInboxRealtime(businessProfileId: string | null) {
  // const onMessage = useInboxStore((s) => s.onMessage);
  // const onMessageStatusUpdate = useInboxStore((s) => s.onMessageStatusUpdate);
  // const setConversations = useInboxStore((s) => s.setConversations);
  // const conversations = useInboxStore((s) => s.conversations);
  const { onMessage, onMessageStatusUpdate, setConversations } = useInboxStore.getState();

  useEffect(() => {
    if (!businessProfileId) return;

    console.log('⚡ Starting Supabase Realtime for inbox — businessProfileId:', businessProfileId);

    // ----------------------------------------------------------
    // 📩 1. Listen for NEW MESSAGES (INSERT)
    // ----------------------------------------------------------
    const messageInsertChannel = supabase
      .channel(`realtime:messages:${businessProfileId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `businessProfileId=eq.${businessProfileId}`,
        },
        (payload) => {
          console.log('🟢 REALTIME NEW MESSAGE', payload.new);

          onMessage(payload.new);
        }
      )
      .subscribe((status) => console.log('messageInsertChannel status:', status));

    // ----------------------------------------------------------
    // 🟡 2. Listen for MESSAGE STATUS UPDATES (UPDATE)
    // ----------------------------------------------------------
    const messageUpdateChannel = supabase
      .channel(`realtime:message_status:${businessProfileId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Message',
          filter: `businessProfileId=eq.${businessProfileId}`,
        },
        (payload) => {
          const updated = payload.new;

          console.log('🟡 REALTIME MESSAGE STATUS UPDATE', updated);

          onMessageStatusUpdate({
            messageSid: updated.whatsappMessageId ?? updated.id,
            messageStatus: updated.deliveryStatus,
          });
        }
      )
      .subscribe((status) => console.log('messageUpdateChannel status:', status));

    // -------------------------
    // INSERT → new conversations
    // -------------------------
    const conversationInsertChannel = supabase
      .channel(`rt:conversations:${businessProfileId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Conversation',
          filter: `businessProfileId=eq.${businessProfileId}`,
        },
        (payload) => {
          console.log('🟣 NEW CONVERSATION', payload.new);
          const st = useInboxStore.getState();
          setConversations([payload.new as TConversationResponse, ...st.conversations]);
        }
      )
      .subscribe();

    // Clean up
    return () => {
      console.log('🧹 Cleaning up realtime channels...');
      supabase.removeChannel(messageInsertChannel);
      supabase.removeChannel(messageUpdateChannel);
      supabase.removeChannel(conversationInsertChannel);
    };
  }, [businessProfileId]);
}
