'use client';
import HorizontalLineWithText from '@/components/custom/HorizontalLineWithText';
import SVGIcon from '@/components/custom/SVGIcons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { Suspense } from 'react';
import ConcaktMainForm from './LoginForm';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

const LoginSection = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  return (
    <section className='w-full flex flex-col'>
      <div className='flex items-start justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex gap-0.5'>
          <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
          <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>
        </div>
        <div className='flex items-end mt-4 w-ful gap-1 text-sm md:text-base leading-4 md:leading-5'>
          <span className='font-normal text-neutral-base'>Not on Contakt?</span>
          <Link href={'/register'}>
            <span className='font-semibold text-primary-base hover:text-primary-700 focus-visible:border-none'>
              Sign up
            </span>
          </Link>
        </div>
      </div>
      <ScrollArea className='h-[87vh]'>
        <div className='flex flex-col items-start gap-4 min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8 max-w-3xl'>
          <div className=' flex-1 flex flex-col items-start justify-center gap-6 w-full'>
            <div className='flex flex-col gap-2'>
              <h6 className='font-bold text-black'>Welcome Back</h6>
              <p className=' text-neutral-base text-base max-w-[296px] leading-5'>
                Enter your email address and password to log in to your account
              </p>
            </div>
            <div className='w-full'>
              <Button
                onClick={() => signIn('google', { callbackUrl: callbackUrl })}
                variant={'outline'}
                className='w-full cursor-pointer hover:bg-gray-100'
                asChild
              >
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
        </div>
      </ScrollArea>
    </section>
  );
};

export default LoginSection;
