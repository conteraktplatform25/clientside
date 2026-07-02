import { Suspense } from 'react';
import { RegistrationSection } from './_component/RegistrationSection';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
      <RegistrationSection />
    </Suspense>
  );
}
