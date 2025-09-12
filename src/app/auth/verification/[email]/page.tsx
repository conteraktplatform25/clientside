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
    <div className='w-full'>
      <div className=' grid grid-cols-1 md:grid-cols-2 gap-0'>
        <div className='px-12 py-4 w-full'>
          <VerificationSection email={decodedEmail} />
        </div>
        <div className='p-0 bg-primary-900 w-full text-white'>
          <ConcaktDescription />
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
