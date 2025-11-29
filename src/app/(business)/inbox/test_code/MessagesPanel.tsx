import React, { useEffect, useRef } from 'react';
import { useInboxStore } from '@/lib/store/business/inbox.store';
import MessageBubble from './MessageBubble';
import { MessageInputBar } from './MessageInputBar';
import { useInboxMessages, useSendMessage } from '@/lib/hooks/business/inbox-conversation.hook';

export default function MessagesPanel({ conversationId }: { conversationId: string | null }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // seed messages from server -> Zustand
  useInboxMessages(conversationId);

  // read messages from Zustand (single source of truth)
  const messagesFromStore = useInboxStore((s) => s.messagesByConversation[conversationId || '']);
  const messages = React.useMemo(() => messagesFromStore ?? [], [messagesFromStore]);

  const sendMessage = useSendMessage(conversationId);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  if (!conversationId) {
    return (
      <div className='flex items-center justify-center h-full text-slate-400'>
        Select a conversation to start messaging
      </div>
    );
  }

  const handleSend = async (text: string) => {
    if (!conversationId) return;
    await sendMessage.mutateAsync({ content: text, mediaUrl: null });
  };

  const handleSendMedia = async (url: string) => {
    if (!conversationId) return;
    sendMessage.mutate({ content: undefined, mediaUrl: url });
  };

  return (
    <div className='flex flex-col h-[520px] w-full relative'>
      <div ref={scrollRef} className='flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-slate-50'>
        {messages.length === 0 && <div className='text-center text-slate-400 mt-10'>No messages yet.</div>}
        {messages.map((m) => (
          <MessageBubble key={m.id ?? m.whatsappMessageId ?? `${m.created_at}-${m.id}`} message={m} />
        ))}
      </div>

      <div className='border-t bg-white px-4 py-3'>
        <MessageInputBar
          onSendText={handleSend}
          onSendMedia={handleSendMedia}
          isSending={sendMessage.isPending}
          conversationId={conversationId}
        />
      </div>
    </div>
  );
}
