'use client';

import { useSession } from 'next-auth/react';
import TopNotification from './custom/TopNotification';
import ContaktGetStarted from '../component/ContaktGetStarted';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Access Denied</p>;
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
