import React from 'react';
import ConcaktDescription from '../custom/ConcaktDescription';
import ProfileSection from './ProfileSection';

const ProfilePage = () => {
  return (
    <div className='w-full'>
      <div className='w-full grid bg-white grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 box-border'>
        <div className='w-full mx-auto px-4 sm:px-6 lg:px-8 py-4'>
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
