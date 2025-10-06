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
    <div className='flex min-h-screen overflow-y-hidden'>
      <div className='w-full grid bg-white grid-cols-1 lg:grid-cols-2 gap-0 box-border'>
        <div className='w-full mx-auto py-4'>
          <VerificationSection email={decodedEmail} />
        </div>
        <ConcaktDescription />
      </div>
    </div>
  );
};

export default VerificationPage;
