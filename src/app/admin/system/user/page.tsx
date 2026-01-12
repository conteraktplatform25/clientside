'use client';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import React, { useEffect } from 'react';
import SystemAdmins from './_component/SystemAdmins';

const SystemUserPage = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('System Administration');
  }, [setTitle]);
  return (
    <div className='mt-8 flex flex-col gap-3 px-8'>
      <SystemAdmins />
    </div>
  );
};

export default SystemUserPage;
