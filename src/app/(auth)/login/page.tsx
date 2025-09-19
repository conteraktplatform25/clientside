import React, { Suspense } from 'react';
import ConcaktDescription from '../custom/ConcaktDescription';
import LoginSection from './LoginSection';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
      <div className='w-full min-h-screen'>
        <div className='w-full grid bg-white grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 box-border'>
          <div className='w-full mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            <LoginSection />
          </div>
          <div className='hidden lg:block bg-primary-900 text-white'>
            <ConcaktDescription />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
