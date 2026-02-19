'use client';
import React from 'react';
import SVGIcon from '@/components/custom/SVGIcons';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ResetPasswordForm from './ResetPasswordForm';
import { useMediaQuery } from '@reactuses/core';

const ResetPasswordSection = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const otpcode = searchParams.get('otpcode');
  const decodedEmail = decodeURIComponent(email!);
  const isMobile = useMediaQuery('(max-width: 768px)', false);

  return (
    <section className='w-full flex flex-col gap-8'>
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
      <div className='flex flex-col items-start gap-4 min-h-[85vh] px-4 sm:px-6 lg:px-8 max-w-3xl'>
        <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
          <div className='flex flex-col gap-1'>
            <h6 className='font-bold text-black'>{`Password Reset for ${decodedEmail}`}</h6>
            <p className=' text-neutral-base text-base max-w-[389px] leading-5'>
              Enter your New password to begin process to reclaim your account.
            </p>
          </div>
          <ResetPasswordForm email={decodedEmail} otpcode={otpcode!} />
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordSection;
