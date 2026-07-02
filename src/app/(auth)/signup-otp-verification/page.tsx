import { Suspense } from 'react';
import { SignupVerificationSection } from './_component/SignupVerificationSection';

export default function SignupOTPVerificationPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
      <SignupVerificationSection />
    </Suspense>
  );
}
