import React, { Suspense } from 'react';
import ConcaktDescription from '../custom/ConcaktDescription';
import LoginSection from './LoginSection';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
      <div className='flex min-h-screen overflow-y-hidden'>
        <div className='w-full grid bg-white grid-cols-1 lg:grid-cols-2 gap-0 box-border'>
          <div className='w-full mx-auto py-4'>
            <LoginSection />
          </div>
          {/* Right Section */}
          <ConcaktDescription />
        </div>
      </div>
    </Suspense>
  );
}
