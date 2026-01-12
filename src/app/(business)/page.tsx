'use client';

import { signIn, useSession } from 'next-auth/react';
import TopNotification from './custom/TopNotification';
import ContaktGetStarted from '../component/ContaktGetStarted';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { status } = useSession();
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Get Started');
  }, [setTitle]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className='p-8 text-center'>
        <p className='text-red-500 mb-4 text-base leading-[155%]'>Access Denied – Please log in first.</p>
        <button onClick={() => signIn()} className='px-4 py-2 bg-primary-base hover:bg-primary-700 text-white rounded'>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col item-start gap-4 m-0'>
      <TopNotification />
      <div className='mt-8 flex flex-col gap-3'>
        <ContaktGetStarted />
        {/* <GetStarted /> */}
      </div>
    </div>
  );
}
