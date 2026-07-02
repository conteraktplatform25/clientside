import { Suspense } from 'react';
import { BusinessProfileSection } from './_component/BusinessProfileSection';

export default function BusinessProfilePage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
      <BusinessProfileSection />
    </Suspense>
  );
}
