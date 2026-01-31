'use client';
import SVGIcon from '@/components/custom/SVGIcons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AlertDisplayField from '@/components/custom/AlertMessageField';
import { ScrollArea } from '@/components/ui/scroll-area';
import MemberProfileForm from './MemberProfileForm';

const MemberProfileSection = () => {
  const [isMemberAccepted, setIsMemberAccepted] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const accepted = Boolean(searchParams.get('accepted')) ?? false;
  const roleId = Number(searchParams.get('function'));
  const email = searchParams.get('email') ?? '';
  const company_name = searchParams.get('company') ?? '';
  const business_id = searchParams.get('business') ?? '';
  const invited_by = searchParams.get('invitedby') ?? '';
  const decodedEmail = decodeURIComponent(email);

  useEffect(() => {
    if (accepted) setIsMemberAccepted(true);
  }, [accepted]);
  return (
    <section className='w-full flex flex-col gap-4'>
      <div className='flex items-start justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex gap-0.5'>
          <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
          <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>
        </div>
        <div className='flex items-end mt-4 w-ful gap-1 text-sm md:text-base leading-4 md:leading-5'>
          <span className='font-normal text-neutral-base'>Already a member?</span>
          <Link href={'/login'}>
            <span className='font-semibold text-primary-base'>Login</span>
          </Link>
        </div>
      </div>
      <ScrollArea className='h-[84vh]'>
        <div className='flex flex-col items-start gap-4 min-h-[82vh] px-4 sm:px-6 lg:px-8 max-w-3xl'>
          <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
            <div className='w-full flex flex-col items-start gap-3'>
              <div className='w-full flex items-start justify-end'>
                {isMemberAccepted && (
                  <div className='w-[65%]'>
                    <AlertDisplayField
                      type={'success'}
                      title='Success!'
                      description={`You have accepted to be part of the ${company_name} team. Please fill your details to gain access.`}
                      onClose={() => setIsMemberAccepted(false)}
                    />
                  </div>
                )}
              </div>

              <MemberProfileForm
                email={decodedEmail}
                businessId={business_id}
                businessName={company_name}
                roleId={roleId}
                invitedBy={invited_by}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
};

export default MemberProfileSection;
