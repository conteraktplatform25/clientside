'use client';
import { useStartConversation } from '@/lib/hooks/business/inbox-conversation.hook';
import { InboxFilterState } from '@/lib/schemas/business/server/inbox.schema';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import { getErrorMessage } from '@/utils/errors';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InboxChatUI from './test_code/InboxChatUI';

export default function InboxPage() {
  const params = useSearchParams();
  const router = useRouter();

  const { setSelectedConversation, setFilters, preloadConversation, conversations } = useInboxStore();

  const startConversation = useStartConversation();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    const q = params;

    const conversationId = q.get('identity');
    const contactId = q.get('contact');
    const phone = q.get('phone');
    const name = q.get('name');
    const filterParam = q.get('filter');

    // -------------------------------------------------------------------
    // 1. APPLY FILTERS FROM QUERY
    // -------------------------------------------------------------------
    if (filterParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(filterParam)) as InboxFilterState;
        if (parsed && typeof parsed === 'object') {
          setFilters(parsed);
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }

    // -------------------------------------------------------------------
    // 2. CASE: PRELOAD CONVERSATION FROM CONTACT (via Contact table link)
    // -------------------------------------------------------------------
    if (conversationId && contactId && phone) {
      preloadConversation(conversationId, {
        id: contactId,
        name: name ?? null,
        phone_number: phone,
      });
      setSelectedConversation(conversationId);
      setInitialized(true);
      return;
    }
    // -------------------------------------------------------------------
    // 3. CASE: USER OPENED /inbox?identity=ABC
    // -------------------------------------------------------------------
    if (conversationId) {
      setSelectedConversation(conversationId);
      setInitialized(true);
      return;
    }

    // -------------------------------------------------------------------
    // 4. CASE: USER OPENED /inbox?contact=XYZ → Start a new conversation
    // -------------------------------------------------------------------
    if (contactId) {
      (async () => {
        try {
          const result = await startConversation.mutateAsync({ contactId });
          const newId = result.id;

          setSelectedConversation(newId);

          // update URL
          const newParams = new URLSearchParams(q.toString());
          newParams.set('identity', newId);
          router.replace(`/inbox?${newParams.toString()}`);
        } catch (err) {
          toast.error(getErrorMessage(err) || 'Unable to start conversation');
        } finally {
          setInitialized(true);
        }
      })();
      return;
    }
    // -------------------------------------------------------------------
    // 5. DEFAULT: USER CLICKED "Inbox" DIRECTLY
    //     → Load recent conversations and auto-select the first one
    // -------------------------------------------------------------------
    if (!conversationId && conversations.length > 0) {
      const first = conversations[0];
      if (first?.id) {
        setSelectedConversation(first.id);

        // update URL to reflect selected conversation
        const newParams = new URLSearchParams(q.toString());
        newParams.set('identity', first.id);
        router.replace(`/inbox?${newParams.toString()}`);
      }
    }

    setInitialized(true);
  }, [
    initialized,
    params,
    conversations,
    router,
    preloadConversation,
    setFilters,
    setSelectedConversation,
    startConversation,
  ]);
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
