import { ReactNode } from 'react';
import ContaktDescription from './_component/ContaktDescription';

export default function AuthenticationLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className='flex min-h-screen overflow-y-hidden'>
      <div className='w-full grid bg-white grid-cols-1 lg:grid-cols-2 gap-0 box-border'>
        {/* Left Section */}
        <div className='w-full mx-auto py-4'>{children}</div>
        {/* Right Section */}
        <ContaktDescription />
      </div>
    </main>
  );
}
