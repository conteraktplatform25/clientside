import SVGIcon from '@/components/custom/SVGIcons';
import Link from 'next/link';
import React from 'react';
import ProfileForm from './ProfileForm';

const ProfileSection = () => {
  return (
    <section className='w-full flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-0.5'>
          <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
          <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>
        </div>
        <div className='flex items-end mt-4 w-ful gap-1 text-sm md:text-base leading-4 md:leading-5'>
          <span className='font-normal text-neutral-base'>Already a user?</span>
          <Link href={'/login'}>
            <span className='font-semibold text-primary-base'>Login</span>
          </Link>
        </div>
      </div>
      <div className='flex flex-col items-start gap-8'>
        <div className='flex flex-col gap-1'>
          <h6 className='font-bold text-black'>Create your account</h6>
          <p className=' text-neutral-base text-base max-w-[389px] leading-5'>
            Sign up to Contakt universe and accelerate the speed in which you do business.
          </p>
        </div>
        <ProfileForm />
      </div>
    </section>
  );
};

export default ProfileSection;
