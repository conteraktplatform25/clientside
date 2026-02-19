'use client';
import SVGIcon from '@/components/custom/SVGIcons';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@reactuses/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const VerificationSection = ({ email }: { email: string }) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const handleBackToApp = () => {
    router.push('/');
  };
  return (
    <section className='w-full flex flex-col'>
      <div className='flex items-start justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex gap-0.5'>
          <Link href={'/'}>
            <div className='flex gap-2'>
              <SVGIcon
                className=' mt-1.5'
                fileName='icon-logo.svg'
                alt='Concakt Logo'
                width={isMobile ? 29.39 : 45.89}
                height={32.58}
              />
              <div className='mt-1 text-neutral-800 text-3xl font-semibold tracking-tight'>contakt</div>
            </div>
          </Link>
        </div>
        <div className='flex items-end mt-4 w-ful gap-1 text-sm md:text-base leading-4 md:leading-5'>
          <span className='font-normal text-neutral-base'>Already a user?</span>
          <Link href={'/login'}>
            <span className='font-semibold text-primary-base hover:text-primary-700'>Login</span>
          </Link>
        </div>
      </div>
      <div className='h-full flex items-center w-full min-h-[85vh] max-w-3xl'>
        <div className='flex flex-col gap-3 text-base px-4 sm:px-6 lg:px-8'>
          <h6 className='font-bold text-black text-2xl'>Verify Your Email Address</h6>
          <p className=' text-neutral-base max-w-[420px] leading-5'>
            {`We sent a link to ${email}. Click on the link to verify your email`}
          </p>
          <Button
            onClick={handleBackToApp}
            variant={'default'}
            className='mt-3 bg-primary-base text-white hover:bg-primary-700 py-3 px-4 w-full'
          >
            Go to main app
          </Button>
          <div className='flex w-full items-center justify-center gap-0'>
            <p className=' text-neutral-base leading-[150%]'>Didn’t get the email? </p>
            <Button variant={'link'} className='text-primary-base hover:text-primary-700 underline'>
              Click to resend
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationSection;
