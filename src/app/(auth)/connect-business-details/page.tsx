import { Suspense } from 'react';
import { BusinessDetailsSection } from './_component/ConnectNumberSection';

export default function ConnectBusinessDetailsPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
      <BusinessDetailsSection />
    </Suspense>
  );
}