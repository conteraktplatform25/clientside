'use client';

import AdminSidebarComponent from '@/components/layout-component/admin/AdminSidebarComponent';
import AdminTopNavigation from '@/components/layout-component/admin/AdminTopNavigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Session } from 'next-auth';
import { ReactNode } from 'react';

interface IClientAdminLayoutProps {
  children: ReactNode;
  defaultOpen: boolean;
  session: Session | null;
}

export default function ClientAdminLayout({ children, defaultOpen, session }: IClientAdminLayoutProps) {
  // const [hasError, setHasError] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // if (isLoading) {
  //   //return
  //   return (
  //     <div className='flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700'>
  //       <UILoaderIndicator label='Fetching your dashboard profile...' />
  //     </div>
  //   );
  // }

  // if (hasError) {
  //   return (
  //     <div className='flex flex-1 flex-col gap-0 w-full p-0'>
  //       <div className='flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700'>
  //         <h1 className='text-2xl font-semibold mb-4'>Something went wrong</h1>
  //         <p className='text-sm text-gray-500 mb-6'>
  //           We couldn’t load your onboarding data. Please refresh the page or try again later.
  //         </p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className='px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700'
  //         >
  //           Reload Page
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <SidebarProvider className='has-data-[variant=inset]:bg-white' defaultOpen={defaultOpen}>
      <div className='relative p-0 m-0 flex h-screen w-full'>
        <AdminSidebarComponent />
        <div className='flex flex-1 flex-col gap-0 w-full p-0'>
          <div className='inline-flex space-x-1 bg-white'>
            <SidebarTrigger className='mt-4' />
            <AdminTopNavigation session={session} />
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
