// app/(business)/inbox/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useInboxRealtime } from '@/lib/hooks/business/bridge/useInboxRealtime';
import InboxChatUI from './test_code/InboxChatUI';
import { useInboxStore } from '@/lib/store/business/inbox.store';
//import { useStartConversation } from '@/lib/hooks/business/inbox-conversation.hook';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';

export default function InboxPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const setSelectedConversation = useInboxStore((s) => s.setSelectedConversation);
  // const preloadConversation = useInboxStore((s) => s.setMessages); // optional helper
  // const startConversation = useStartConversation();

  const [initialized, setInitialized] = useState(false);

  const businessId = session?.user.businessProfileId ?? null;
  const token = session?.accessToken ?? null;

  // set business id in store once session loaded
  useEffect(() => {
    if (businessId) useInboxStore.getState().setBusinessProfileId(businessId);
  }, [businessId]);

  // start realtime (runs when businessId+token available)
  useInboxRealtime(businessId, token);

  // Page startup logic (same as your previous logic)
  useEffect(() => {
    if (initialized) return;
    const q = params;
    const conversationId = q.get('identity');
    const contactId = q.get('contact');
    const phone = q.get('phone');
    //const name = q.get('name');
    const filterParam = q.get('filter');

    if (filterParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(filterParam));
        useInboxStore.getState().setFilters(parsed);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }

    if (conversationId && contactId && phone) {
      useInboxStore.getState().setSelectedConversation(conversationId);
      useInboxStore.getState().setMessages(conversationId, []);
      setInitialized(true);
      return;
    }

    if (conversationId) {
      setSelectedConversation(conversationId);
      setInitialized(true);
      return;
    }

    setInitialized(true);
  }, [initialized, params, setSelectedConversation]);

  if (!initialized) {
    return (
      <div className='flex items-center justify-center flex-1 h-full'>
        <div className='flex flex-col items-center gap-3'>
          <div className='animate-spin h-10 w-10 border-2 border-slate-300 border-t-blue-500 rounded-full' />
          <p className='text-sm text-slate-400'>Loading inbox…</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col item-start gap-4 m-0 overflow-y-hidden'>
      <InboxChatUI />
    </div>
  );
}
