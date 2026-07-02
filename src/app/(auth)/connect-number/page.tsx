import { Suspense } from 'react';
import { ConnectNumberSection } from './_component/ConnectNumberSection';

export default function ConnectNumberPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
      <ConnectNumberSection />
    </Suspense>
  );
}