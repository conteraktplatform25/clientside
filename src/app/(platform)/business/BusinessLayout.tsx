"use client";

import { useSessionStore } from '@/lib/store/auth/auth-session.store';
import { ReactNode } from 'react';
import DashboardSkeleton from '../_compnent/DashboardSkeleton';
import { SidebarProvider } from '@/components/ui/sidebar';
import TopNavigationBusiness from './_component/TopNavigationBusiness';

interface IClientDashboardLayoutProps {
  children: ReactNode;
  defaultOpen: boolean;
}

export default function BusinessLayout ({ children, defaultOpen }: Readonly<IClientDashboardLayoutProps>) {
  const { loading } = useSessionStore();
  if (loading) {
    return <DashboardSkeleton />;
  }
  return (
    <SidebarProvider className='has-data-[variant=inset]:bg-white' defaultOpen={defaultOpen}>
      <div className='relative p-0 m-0 flex h-screen w-full'>
        <div className='flex flex-1 flex-col gap-0 w-full p-0'>
          <div className='inline-flex space-x-1 bg-white'>
            <TopNavigationBusiness />
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

// export default BusinessLayout;
