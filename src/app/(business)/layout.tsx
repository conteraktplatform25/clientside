import React from 'react';
import { cookies } from 'next/headers';
import { ILayoutProps } from '@/type/client/default.type';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import TopNavigation from '@/components/layout-component/TopNavigation';
import SidebarComponent from '@/components/layout-component/SidebarComponent';
import { getServerSession } from 'next-auth';
import authOptions from '../api/auth/[...nextauth]/authOption';

const DashboardLayout = async ({ children }: ILayoutProps) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  const session = await getServerSession(authOptions);
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className='relative p-0 m-0 flex h-screen overflow-hidden w-full'>
        <SidebarComponent />
        <div className='flex flex-1 flex-col gap-0 overflow-hidden w-full p-0'>
          <div className='inline-flex space-x-1 bg-white'>
            <SidebarTrigger className='mt-4' />
            <TopNavigation session={session} />
          </div>

          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
