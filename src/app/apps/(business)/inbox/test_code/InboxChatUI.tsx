// /src/components/inbox/InboxChatUI.tsx
import React from 'react';
import { useInboxConversations } from '@/lib/hooks/business/inbox-conversation.hook';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import InboxFilters from './InboxFilters';
import MessagesPanel from './MessagesPanel';
import ConversationsList from './ConversationsList';

export default function InboxChatUI() {
  const selected = useInboxStore((s) => s.selectedConversationId);
  const setFilters = useInboxStore((s) => s.setFilters);
  const convsQuery = useInboxConversations({ page: 1, limit: 25, search: '' });

  React.useEffect(() => {
    if (convsQuery.data?.conversations) {
      useInboxStore.getState().setConversationsCache(convsQuery.data.conversations);
      if (!selected && convsQuery.data.conversations.length) {
        useInboxStore.getState().setSelectedConversation(convsQuery.data.conversations[0].id);
      }
    }
  }, [convsQuery.data, selected]);

  return (
    <div className='w-full h-[700px] shadow rounded-lg overflow-hidden grid grid-cols-12'>
      <div className='col-span-4 border-r h-full flex flex-col'>
        <InboxFilters onChange={(f) => setFilters(f)} />
        <div className='flex-1 overflow-auto'>
          <ConversationsList
            onSelect={(id) => useInboxStore.getState().setSelectedConversation(id)}
            selectedId={selected}
          />
        </div>
      </div>

      <div className='col-span-8 h-full'>
        <MessagesPanel conversationId={selected} />
      </div>
    </div>
  );
}
