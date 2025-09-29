'use client';
import { MoveHorizontal as MoreHorizontal, Phone, Video, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from './UserAvarta';
import { useChatStore } from '@/lib/store/business/survey/inbox-survey.store';
import { formatDistanceToNow } from 'date-fns';

export function ChatHeader() {
  const { activeConversation, currentUser } = useChatStore();

  if (!activeConversation || !currentUser) {
    return (
      <div className='p-4 border-b border-gray-200 bg-white'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gray-200 rounded-full' />
            <div>
              <h3 className='font-semibold text-gray-400'>Select a conversation</h3>
              <p className='text-sm text-gray-400'>No active chat</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const otherParticipant = activeConversation.participants.find((p) => p.id !== currentUser.id);

  if (!otherParticipant) return null;

  const getLastSeenText = () => {
    if (otherParticipant.isOnline) return 'Active now';
    if (otherParticipant.lastSeen) {
      return `Last seen ${formatDistanceToNow(otherParticipant.lastSeen, { addSuffix: true })}`;
    }
    return 'Last seen recently';
  };

  return (
    <div className='p-4 border-b border-gray-200 bg-white'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <UserAvatar profile={otherParticipant} showOnlineStatus />
          <div>
            <h3 className='font-semibold text-gray-900'>{otherParticipant.name}</h3>
            <p className='text-sm text-gray-600'>{getLastSeenText()}</p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <Button variant='ghost' size='icon' className='text-gray-600'>
            <Phone className='w-5 h-5' />
          </Button>
          <Button variant='ghost' size='icon' className='text-gray-600'>
            <Video className='w-5 h-5' />
          </Button>
          <Button variant='ghost' size='icon' className='text-gray-600'>
            <Search className='w-5 h-5' />
          </Button>
          <Button variant='ghost' size='icon' className='text-gray-600'>
            <MoreHorizontal className='w-5 h-5' />
          </Button>
        </div>
      </div>
    </div>
  );
}
