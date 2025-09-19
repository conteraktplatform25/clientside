'use client';
import SVGIcon from '@/components/custom/SVGIcons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ProfileForm from './ProfileForm';
import { useSearchParams } from 'next/navigation';
import AlertDisplayField from '@/components/custom/AlertMessageField';

const ProfileSection = () => {
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const email = searchParams.get('email');
  const decodedEmail = decodeURIComponent(email!);
  const full_name = searchParams.get('name');

  useEffect(() => {
    if (verified === 'true') setIsEmailVerified(true);
  }, [verified]);
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
      <div className='flex flex-col items-start gap-4 min-h-[85vh] max-w-3xl'>
        <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
          <div className='w-full flex flex-col items-start gap-3'>
            <div className='w-full flex items-start justify-end'>
              {isEmailVerified && (
                <div className='w-[65%]'>
                  <AlertDisplayField
                    type={'success'}
                    title='Success!'
                    description='Email address verified successfully.'
                    onClose={() => setIsEmailVerified(false)}
                  />
                </div>
              )}
            </div>
            <div className='w-full flex items-start justify-between'>
              <div className='flex flex-col gap-1'>
                <h6 className='font-bold text-black'>Create your account</h6>
                <p className=' text-neutral-base text-base max-w-[389px] leading-5'>
                  Sign up to Contakt universe and accelerate the speed in which you do business.
                </p>
              </div>
            </div>

            <ProfileForm email={decodedEmail!} full_name={full_name!} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
