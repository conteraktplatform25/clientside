'use client';
import HorizontalLineWithText from '@/components/custom/HorizontalLineWithText';
import SVGIcon from '@/components/custom/SVGIcons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { Suspense } from 'react';
import ConcaktMainForm from './LoginForm';

const LoginSection = () => {
  return (
    <section className='w-full flex flex-col gap-16'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-0.5'>
          <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
          <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>
        </div>
        <div className='flex items-end mt-4 w-ful gap-1 text-sm md:text-base leading-4 md:leading-5'>
          <span className='font-normal text-neutral-base'>Not on Contakt?</span>
          <Link href={'/auth/register'}>
            <span className='font-semibold text-primary-base'>Sign up</span>
          </Link>
        </div>
      </div>
      <div className='flex flex-col items-start justify-center gap-6'>
        <div className='flex flex-col gap-2'>
          <h6 className='font-bold text-black'>Welcome Back</h6>
          <p className=' text-neutral-base text-base max-w-[296px] leading-5'>
            Enter your email address and password to log in to your account
          </p>
        </div>
        <div className='w-full'>
          <Button variant={'outline'} className='w-full cursor-pointer hover:bg-neutral-700 hover:text-white' asChild>
            <div className='flex gap-4'>
              <SVGIcon fileName='icon-google.svg' alt='Google Icon' height={25} />
              <span className='font-semibold text-base md:text-[18px]'>Sign in with Google</span>
            </div>
          </Button>
        </div>
        <HorizontalLineWithText text='Or continue with' />
        <Suspense fallback={<div>Loading...</div>}>
          <ConcaktMainForm />
        </Suspense>
      </div>
    </section>
  );
};

export default LoginSection;
