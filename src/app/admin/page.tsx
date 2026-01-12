'use client';

import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import ContaktAdminDashboard from './_component/ContaktAdminDashboard';

const AdminDashboardPage = () => {
  const { status } = useSession();
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);

  if (status === 'loading') {
    return (
      <div className='p-8 text-center w-full h-[90vh] flex items-center justify-center'>
        <p className='font-bold text-lg leading-[150%] text-primary-700'>Loading Contakt Resources...</p>
      </div>
    );
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
    <div className='mt-8 flex flex-col gap-3 px-8'>
      <ContaktAdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
