// /inbox/test_code/InboxChatUI.tsx
import React, { useState, useEffect } from 'react';
import InboxFilters from './InboxFilters';
import MessagesPanel from './MessagesPanel';
import ConversationsList from './ConversationsList';
import { pusherClient } from '@/lib/pusher.client';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import { useInboxConversations } from '@/lib/hooks/business/inbox-conversation.hook';
import { TMessageDataResponse } from '@/lib/schemas/business/server/inbox.schema';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';

export default function InboxChatUI() {
  const [selected, setSelected] = useState<string | null>(null);
  const convsQuery = useInboxConversations({ page: 1, limit: 25, search: '' });
  const setFilters = useInboxStore((s) => s.setFilters);
  const onMessage = useInboxStore((s) => s.onMessage);

  useEffect(() => {
    // prefill conversations cache for client-side filtering
    if (convsQuery.data?.conversations) {
      useInboxStore.getState().setConversationsCache(convsQuery.data.conversations);
      if (!selected && convsQuery.data.conversations.length) setSelected(convsQuery.data.conversations[0].id);
    }
  }, [convsQuery.data, selected]);

  useEffect(() => {
    const channelName = 'messages';
    pusherClient.subscribe(channelName);
    const handler = (payload: TMessageDataResponse) => onMessage(payload);
    pusherClient.bind('message:new', handler);
    return () => {
      pusherClient.unbind('message:new', handler);
      try {
        pusherClient.unsubscribe(channelName);
      } catch (err) {
        toast.error(getErrorMessage(err));
        // noop
      }
    };
  }, [onMessage]);

  return (
    <div className='w-full h-[700px] shadow rounded-lg overflow-hidden grid grid-cols-12'>
      <div className='col-span-4 border-r h-full flex flex-col'>
        <InboxFilters onChange={(f) => setFilters(f)} />
        <div className='flex-1 overflow-auto'>
          <ConversationsList onSelect={setSelected} selectedId={selected} />
        </div>
      </div>
      <div className='col-span-8 h-full'>
        <MessagesPanel conversationId={selected} />
      </div>
    </div>
  );
}
