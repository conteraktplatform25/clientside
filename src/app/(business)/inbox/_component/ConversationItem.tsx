'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
// import { Conversation, User } from '@/types/chat';
import { UserProfile, Conversation } from '@/type/client/business/survey/inbox-survey.type';
import { UserAvatar } from './UserAvarta';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationItemProps {
  conversation: Conversation;
  currentUser: UserProfile;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, currentUser, isActive, onClick }: ConversationItemProps) {
  const otherParticipant = conversation.participants.find((p) => p.id !== currentUser.id);

  if (!otherParticipant) return null;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <ScrollArea className='h-[21rem] w-full flex flex-col gap-12'>
      <motion.div
        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center space-x-3 p-3 cursor-pointer rounded-lg transition-colors',
          isActive && 'bg-blue-50 border-r-2 border-blue-500'
        )}
        onClick={onClick}
      >
        {/* <UserAvatar profile={otherParticipant} showOnlineStatus /> */}

        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-[18px] leading-[155%] text-neutral-base truncate'>
              {otherParticipant.name}
            </h3>
            {conversation.lastMessage && (
              <span className='text-xs text-gray-500'>{formatTime(conversation.lastMessage.timestamp)}</span>
            )}
          </div>

          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-600 truncate'>{conversation.lastMessage?.content || 'No messages yet'}</p>
            {conversation.unreadCount > 0 && (
              <span className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full'>
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </ScrollArea>
  );
}
