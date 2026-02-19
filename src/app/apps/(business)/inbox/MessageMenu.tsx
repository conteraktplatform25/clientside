import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConstMessageProfile as profiles } from '@/lib/constants/inbox.constant';
import { truncateText } from '@/lib/helpers/string-manipulator.helper';
import { Tag, UserRoundCheck } from 'lucide-react';
import React from 'react';

const MessageMenu = () => {
  return (
    <div className='flex-1 overflow-y-auto px-4'>
      <ScrollArea className='h-72 w-full'>
        <div className='flex flex-col gap-0'>
          {profiles.map((profile) => (
            <Button
              key={profile.userId}
              variant={'ghost'}
              className='bg-white hover:bg-[#F7FAFF] px-4 py-3 border-none border-b border-gray-50 flex item-center justify-baseline'
              asChild
            >
              <div className='flex items-center gap-2 py-12'>
                <div className='w-16 h-16 rounded-full bg-neutral-300 p-2 flex items-center justify-center'>
                  <span className='font-semibold text-2xl leading-[140%] text-white text-center'>
                    {profile.initials}
                  </span>
                </div>
                <div className='flex-1'>
                  <div className='flex items-start justify-between'>
                    <p className='font-semibold text-base leading-[150%] text-[#282B30]'>
                      {truncateText(profile.full_name, 20)}
                    </p>
                    <span className='text-xs leading-[155%] text-neutral-400'>{profile.time}</span>
                  </div>
                  <div className='text-sm text-gray-500 truncate'>{truncateText(profile.message, 25)}</div>
                  <div className='flex items-start justify-between'>
                    {profile.tag_title && (
                      <div className='mt-2 flex items-start gap-1'>
                        <Tag size={12} strokeWidth={1.2} color={profile.color ? profile.color : '#4D26C9'} />
                        <span className={`${profile.color_text} text-xs leading-[155%]`}>
                          {truncateText(profile.tag_title, 15)}
                        </span>
                      </div>
                    )}
                    {profile.agent && (
                      <div className='mt-2 flex gap-1'>
                        <UserRoundCheck color='#1A73E8' size={12} strokeWidth={1} />
                        <span className='text-sm leading-[155%] text-neutral-base'>{profile.agent}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageMenu;
