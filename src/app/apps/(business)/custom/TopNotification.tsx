import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import React from 'react';

const TopNotification = () => {
  return (
    <div className='flex flex-col py-4 px-10 border bg-[#F7FAFF] text-neutral-base text-base font-semibold'>
      <div className='flex items-start justify-between '>
        <div className='flex flex-col gap-4'>
          <h6 className=' leading-5 text-primary-900'>🔔 5 days to go before your trial ends!</h6>
          <span className='font-normal text-sm leading-4'>
            You are missing out on exciting features that can help you supercharge your sales, support, and marketing
          </span>
        </div>
        <div className='flex items-end justify-end'>
          <Button variant={'ghost'} className='text-primary-base flex gap-4' asChild>
            <div className='flex gap-2'>
              <span>Connect your number</span>
              <ArrowRight className='mt-1' size={18} />
            </div>
          </Button>
          <Button className='mt-1' variant={'ghost'}>
            <X />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopNotification;
