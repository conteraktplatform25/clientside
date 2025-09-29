import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';
import { FaPlus } from 'react-icons/fa6';
// import ReplyEditor from './ReplyEditor';

const AddBroadcast = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant={'default'}
            className='bg-primary-base hover:bg-primary-700 text-white rounded-[10px] px-4 py-3 cursor-pointer'
            asChild
          >
            <div className='inline-flex space-x-1'>
              <FaPlus />
              <span>New broadcast</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[558px]'>
          <DialogHeader>
            <DialogTitle>
              <div className='flex justify-between items-start'>
                <p className='font-semibold text-sm leading-[155%] text-neutral-700'>Add a Reply</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {/* <ReplyEditor /> */}
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddBroadcast;
