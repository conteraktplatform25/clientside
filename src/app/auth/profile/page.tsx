import React from 'react';
import ConcaktDescription from '../custom/ConcaktDescription';
import ProfileSection from './ProfileSection';

const page = () => {
  return (
    <div className='w-full'>
      <div className=' grid grid-cols-1 md:grid-cols-2 gap-0'>
        <div className='px-12 py-4 w-full'>
          <ProfileSection />
        </div>
        <div className='p-0 bg-primary-900 w-full text-white'>
          <ConcaktDescription />
        </div>
      </div>
    </div>
  );
};

export default page;
