import React from 'react';
import ConcaktDescription from '../custom/ConcaktDescription';
import ForgotPasswordSection from './ForgotPasswordSection';

const ForgotPasswordPage = () => {
  return (
    <div className='flex min-h-screen overflow-y-hidden'>
      <div className='flex-1 grid bg-white grid-cols-1 lg:grid-cols-2 gap-0 box-border'>
        <div className='w-full mx-auto py-4'>
          <ForgotPasswordSection />
        </div>
        <ConcaktDescription />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
