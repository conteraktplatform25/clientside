import React, { Suspense } from 'react';
import ConcaktDescription from '../custom/ConcaktDescription';
import ConnectNumberSection from './ConnectNumberSection';

const ProfilePage = () => {
  return (
    <Suspense>
      <div className='w-full'>
        <div className='w-full xl:max-w-[1440px] grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-[840px_1fr] gap-0 mx-auto box-border overflow-x-hidden'>
          <div className='pl-16 pr-12 py-4 w-full'>
            <ConnectNumberSection />
          </div>
          <div className='hidden lg:block p-0 bg-primary-900 w-full text-white'>
            <ConcaktDescription />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ProfilePage;
