import React from 'react';
import ConcaktDescription from '../../custom/ConcaktDescription';
import VerificationSection from '../VerificationSection';

interface IVerificationProps {
  params: Promise<{
    email: string;
  }>;
}

const VerificationPage = async ({ params }: IVerificationProps) => {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);
  return (
    <div className='w-full min-h-screen'>
      <div className='w-full xl:max-w-[1440px] grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-[840px_1fr] gap-0 mx-auto box-border overflow-x-hidden'>
        <div className='pr-12 pl-16 py-4 w-full'>
          <VerificationSection email={decodedEmail} />
        </div>
        <div className='hidden lg:block p-0 bg-primary-900 w-full text-white'>
          <ConcaktDescription />
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
