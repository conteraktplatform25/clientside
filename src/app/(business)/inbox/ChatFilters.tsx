import React from 'react';
import CategoryFilters from './filters/CategoryFilter';
import SelectFilter from './filters/SelectFilter';
import { Button } from '@/components/ui/button';
import { ListCheck } from 'lucide-react';

const ChatFilters = () => {
  return (
    <div className='px-4 flex items-start justify-between gap-2'>
      <CategoryFilters />
      <div className='flex items-start gap-2'>
        <SelectFilter />
        <Button
          variant='ghost'
          className='rounded-full border border-[#DEE2E6] bg-white focus-visible:shadow-none focus-visible:border-none'
        >
          <ListCheck size={18} strokeWidth={1.51} color='#282B30' />
        </Button>
      </div>
    </div>
  );
};

export default ChatFilters;
