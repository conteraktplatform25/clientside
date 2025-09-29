'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '@/lib/store/business/survey/inbox-survey.store';
// import { useChatStore } from '@/lib/chat-store';
// import { Message } from '@/types/chat';

interface ChatMessagesProps {
  conversationId: string;
}

export function ChatMessages({ conversationId }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, currentUser, activeConversation } = useChatStore();

  const conversationMessages = messages[conversationId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  if (!currentUser || !activeConversation) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-gray-500'>Select a conversation to start chatting</p>
      </div>
    );
  }

  const otherParticipant = activeConversation.participants.find((p) => p.id !== currentUser.id);

  if (conversationMessages.length === 0) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <p className='text-gray-500 mb-2'>No messages yet</p>
          <p className='text-sm text-gray-400'>Start a conversation with {otherParticipant?.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      <AnimatePresence>
        {conversationMessages.map((message, index) => {
          const sender = activeConversation.participants.find((p) => p.id === message.senderId);
          const isCurrentUser = message.senderId === currentUser.id;

          if (!sender) return null;

          const showAvatar = index === 0 || conversationMessages[index - 1]?.senderId !== message.senderId;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              sender={sender}
              isCurrentUser={isCurrentUser}
              showAvatar={showAvatar}
            />
          );
        })}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}
