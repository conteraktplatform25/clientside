'use client';
import { useAuthStore } from '@/lib/store/auth/auth.store';
import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import ErrorServerField from '@/components/custom/ErrorServerField';

const SecuritySetupManager = () => {
  const userProfile = useAuthStore((u) => u.user);

  if (!userProfile || !userProfile.email) {
    return (
      <ErrorServerField
        title='Failed to verify your details'
        description='We couldn’t verify your details. Clicking on the button below to refresh.'
        onRetry={() => window.location.reload()}
      />
    );
  }
  return (
    <div className='w-full px-4 flex flex-col gap-6 max-w-xl'>
      {/** Header Section */}
      <div className='block space-y-3'>
        <h4 className='text-xl font-semibold'>Team Security Password Change</h4>
        <p className='text-sm text-neutral-500'>You can change your password</p>
      </div>
      {/** Password Change form */}
      <ChangePasswordForm email={userProfile.email} />
    </div>
  );
};

export default SecuritySetupManager;
