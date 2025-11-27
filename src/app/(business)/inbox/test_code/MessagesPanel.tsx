import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import type { TMessageDataResponse } from '@/lib/schemas/business/server/inbox.schema';
import { MessageInputBar } from './MessageInputBar';
import { useInboxMessages, useSendMessage } from '@/lib/hooks/business/inbox-conversation.hook';

export default function MessagesPanel({ conversationId }: { conversationId: string | null }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const EMPTY: TMessageDataResponse[] = [];

  const inboxQuery = useInboxMessages(conversationId, 25);
  const sendMessageMutation = useSendMessage(conversationId);

  const messages = useInboxStore((s) => (conversationId ? (s.messagesByConversation[conversationId] ?? EMPTY) : EMPTY));

  //console.log('Message Profile: ', inboxQuery);

  const isLoading = conversationId ? inboxQuery.isLoading || inboxQuery.isFetching : false;

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  if (!conversationId)
    return (
      <div className='flex items-center justify-center h-full text-slate-400'>
        Select a conversation to start messaging
      </div>
    );

  if (isLoading && messages.length === 0) {
    return (
      <div className='h-full w-full flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <div className='animate-spin h-10 w-10 border-2 border-slate-300 border-t-blue-500 rounded-full' />
          <div className='text-sm text-slate-500'>Loading messages…</div>
        </div>
      </div>
    );
  }
  // Empty state (no previous messages)
  const noMessages = messages.length === 0;

  const handleSend = async (text: string) => {
    if (!conversationId) return;

    await sendMessageMutation.mutateAsync({
      content: text,
      mediaUrl: null,
    });
  };
  const handleSendMedia = async (url: string) => {
    if (!conversationId) return;

    sendMessageMutation.mutate({
      content: undefined,
      mediaUrl: url,
    });
  };

  return (
    <div className='flex flex-col h-[520px] w-full relative'>
      {/* Scrollable message container */}
      <div ref={scrollRef} className='flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-slate-50'>
        {noMessages && <div className='text-center text-slate-400 mt-10'>No messages yet. Say hello 👋</div>}

        {!noMessages && messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}

        {/* Loading more older messages (pagination) */}
        {inboxQuery.isFetchingNextPage && (
          <div className='w-full flex justify-center py-3'>
            <div className='animate-spin h-6 w-6 border-2 border-slate-300 border-t-blue-500 rounded-full' />
          </div>
        )}
      </div>

      {/* Message input bar */}
      <div className='border-t bg-white px-4 py-3'>
        <MessageInputBar
          conversationId={conversationId}
          onSendText={handleSend}
          onSendMedia={handleSendMedia}
          isSending={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
}
