import HorizontalLineWithText from '@/components/custom/HorizontalLineWithText';
import SVGIcon from '@/components/custom/SVGIcons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import SignupForm from './SignupForm';

const SignupSection = () => {
  return (
    <section className='w-full flex flex-col gap-8'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-0.5'>
          <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
          <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>
        </div>
        <div className='flex items-end mt-4 w-ful gap-1 text-sm md:text-base leading-4 md:leading-5'>
          <span className='font-normal text-neutral-base'>Already a user?</span>
          <Link href={'/login'}>
            <span className='font-semibold text-primary-base hover:text-primary-700'>Login</span>
          </Link>
        </div>
      </div>
      <div className='flex flex-col items-start gap-4 min-h-[85vh] max-w-3xl'>
        <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
          <div className='flex flex-col gap-1'>
            <h6 className='font-bold text-black'>Create your account</h6>
            <p className=' text-neutral-base text-base max-w-[389px] leading-5'>
              Sign up to Contakt universe and accelerate the speed in which you do business.
            </p>
          </div>
          <div className='w-full'>
            <Button variant={'outline'} className='w-full cursor-pointer hover:bg-gray-100' asChild>
              <div className='flex gap-4'>
                <SVGIcon fileName='icon-google.svg' alt='Google Icon' height={25} />
                <span className='font-semibold text-base md:text-[18px]'>Sign up with Google</span>
              </div>
            </Button>
          </div>
          <HorizontalLineWithText text='Or continue with' />
          <SignupForm />
        </div>
      </div>
    </section>
  );
};

export default SignupSection;
