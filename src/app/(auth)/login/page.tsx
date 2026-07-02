import { Suspense } from 'react';
import LoginSection from './_component/LoginSection';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
      <LoginSection />
    </Suspense>
  )
}
