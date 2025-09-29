'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConversationItem } from './ConversationItem';
// import { useChatStore } from '@/lib/chat-store';
import { useChatStore } from '@/lib/store/business/survey/inbox-survey.store';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, currentUser, activeConversation, setActiveConversation } = useChatStore();

  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find((p) => p.id !== currentUser?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!currentUser) return null;

  return (
    <div className={cn('flex flex-col h-full bg-white border-r border-gray-200', className)}>
      {/* Header */}
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>Chats</h2>
          <Button size='sm' className='rounded-full'>
            <Plus className='w-4 h-4' />
          </Button>
        </div>

        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
          <Input
            placeholder='Search for your message or users'
            className='pl-10'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto'>
        {filteredConversations.length === 0 ? (
          <div className='flex items-center justify-center h-32'>
            <p className='text-gray-500'>No conversations found</p>
          </div>
        ) : (
          <div className='space-y-1 p-2'>
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                currentUser={currentUser}
                isActive={activeConversation?.id === conversation.id}
                onClick={() => setActiveConversation(conversation)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
