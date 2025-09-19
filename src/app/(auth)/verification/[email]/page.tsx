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
      <div className='w-full grid bg-white grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 box-border'>
        <div className='w-full mx-auto px-4 sm:px-6 lg:px-8 py-4'>
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
