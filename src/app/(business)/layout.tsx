import React from 'react';
import { cookies } from 'next/headers';
import { ILayoutProps } from '@/type/client/default.type';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import TopNavigation from '@/components/layout-component/TopNavigation';
import SidebarComponent from '@/components/layout-component/SidebarComponent';

const DashboardLayout = async ({ children }: ILayoutProps) => {
  const cookieStore = await cookies();

  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className='relative p-0 m-0 flex h-screen overflow-hidden w-full'>
        <SidebarComponent />
        <div className='flex flex-1 flex-col gap-0 overflow-hidden w-full p-0'>
          <div className='inline-flex space-x-1 bg-white'>
            <SidebarTrigger className='mt-4' />
            <TopNavigation />
          </div>

          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
