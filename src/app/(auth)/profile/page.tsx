import React from 'react';
import ConcaktDescription from '../custom/ConcaktDescription';
import ProfileSection from './ProfileSection';

const ProfilePage = () => {
  return (
    <div className='w-full'>
      <div className='w-full xl:max-w-[1440px] grid grid-cols-1 md:grid-cols-2  xl:grid-cols-[840px_1fr] gap-0 mx-auto box-border overflow-x-hidden'>
        <div className='pl-16 pr-12 py-4 w-full'>
          <ProfileSection />
        </div>
        <div className='hidden md:flex p-0 bg-primary-900 w-full text-white'>
          <ConcaktDescription />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
