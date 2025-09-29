'use client';

import { motion } from 'framer-motion';
//import { formatDistanceToNow } from 'date-fns';
import { UserAvatar } from './UserAvarta';
import { UserProfile, Message } from '@/type/client/business/survey/inbox-survey.type';
// import { Message, User } from '@/types/chat';
// import { UserAvatar } from './UserAvatar';
import { cn } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  sender: UserProfile;
  isCurrentUser: boolean;
  showAvatar?: boolean;
}

export function MessageBubble({ message, sender, isCurrentUser, showAvatar = true }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex items-end space-x-2 mb-4', isCurrentUser && 'flex-row-reverse space-x-reverse')}
    >
      {showAvatar && !isCurrentUser && <UserAvatar profile={sender} size='sm' />}

      <div
        className={cn(
          'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl',
          isCurrentUser ? 'bg-[#E9F3FF] text-neutral-700 rounded-br-md' : 'bg-[#F3F4F6] text-neutral-700 rounded-bl-md'
        )}
      >
        <p className='text-sm'>{message.content}</p>

        <div
          className={cn(
            'flex items-center justify-between mt-1 space-x-2',
            isCurrentUser ? 'text-blue-500' : 'text-gray-500'
          )}
        >
          <span className='text-xs'>{formatTime(message.timestamp)}</span>

          {isCurrentUser && (
            <div className='flex items-center'>
              {message.isRead ? <CheckCheck className='w-3 h-3' /> : <Check className='w-3 h-3' />}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
