'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { FaArrowRightLong, FaRegCircleCheck } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import SVGIcon from '@/components/custom/SVGIcons';

const ConnectNumberSection = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const decodedEmail = decodeURIComponent(email!);
  const full_name = searchParams.get('name');
  const router = useRouter();

  const constProfileList: string[] = [
    'Send bulk messages and automated notifications.',
    'Setup auto replies',
    'View and reply to chats from both Whatsapp Business app & Contakt ',
  ];

  return (
    <section className='w-full flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-0.5'>
          <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
          <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>
        </div>
      </div>
      <div className='flex flex-col items-start gap-4 min-h-[85vh]'>
        <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
          <div className='w-full flex items-start justify-between'>
            <div className='flex flex-col gap-1'>
              <h6 className='font-bold text-black'>{`Hi ${full_name}, Connect your number`}</h6>
              <p className=' text-neutral-base text-base max-w-[389px] leading-5'>
                To start using Contakt, connect a number for your Whatsapp business account.
              </p>
              <div className='mt-6 flex flex-col gap-3'>
                {constProfileList.map((profile) => (
                  <div key={profile} className='inline-flex space-x-2'>
                    <FaRegCircleCheck className='mt-1.5 text-primary-base' />
                    <p className='text-base leading-[150%] text-neutral-base'>{profile}</p>
                  </div>
                ))}
              </div>
              <div className='mt-4 w-full flex flex-col gap-2'>
                <Button
                  onClick={() => router.push(`/whatsapp-connect?email=${decodedEmail}&name=${full_name}`)}
                  variant={'default'}
                  className='bg-primary-base hover:bg-primary-700 text-white font-medium'
                >
                  Connect whatsapp business number
                </Button>
                <Button
                  onClick={() => alert('Review on the way')}
                  variant={'ghost'}
                  className='text-primary-base hover:text-primary-700 font-normal text-center leading-[150%] cursor-pointer hover:bg-transparent'
                  asChild
                >
                  <div className='inline-flex space-x-2'>
                    <span>Connect new number</span>
                    <FaArrowRightLong />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectNumberSection;
