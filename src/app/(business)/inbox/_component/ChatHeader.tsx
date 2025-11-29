'use client';
import { MoveHorizontal as MoreHorizontal, Phone, Video, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
//import { UserAvatar } from './UserAvarta';
// import { formatDistanceToNow } from 'date-fns';
//import { TInboxState, useInboxStore } from '@/lib/store/business/inbox.store';
//import { useInboxStore, TInboxState } from '@/lib/store/business/inbox.store';
//import { useMemo } from 'react';

interface ChatHeaderProps {
  conversationId: string | null;
}

export function ChatHeader({ conversationId }: ChatHeaderProps) {
  // const conversation = useInboxStore((s: TInboxState) =>
  //   conversationId ? (s.conversations?.find((c) => c.id === conversationId) ?? null) : null
  // );
  // Memoize the other participant info
  // const otherParticipant = useMemo(() => {
  //   if (!conversation) return null;
  //   return conversation.contact ?? null;
  // }, [conversation]);

  //if (!conversationId || !conversation) return null;
  console.log(conversationId);
  return (
    <div className='p-4 border-b border-gray-200 bg-white'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          {/* <UserAvatar profile={otherParticipant} showOnlineStatus /> */}
          <div>
            <h3 className='font-semibold text-gray-900'>Justine</h3>
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
