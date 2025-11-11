'use client';

import React, { useEffect, ReactNode, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import TopNavigation from '@/components/layout-component/TopNavigation';
import SidebarComponent from '@/components/layout-component/SidebarComponent';
import { useGettingStartedStore } from '@/lib/store/business/index.store';
import { useCategoryCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { Session } from 'next-auth';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';

interface IClientDashboardLayoutProps {
  children: ReactNode;
  defaultOpen: boolean;
  session: Session | null;
}

export default function ClientDashboardLayout({ children, defaultOpen, session }: IClientDashboardLayoutProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setOnboardingStatus = useGettingStartedStore((state) => state.setOnboardingStatus);
  const setProgressBar = useGettingStartedStore((state) => state.setProgressBar);
  const setAllCategories = useCategoryCatalogueStore((state) => state.setAllCategories);

  useEffect(() => {
    async function fetchOnboarding() {
      try {
        const res = await fetch('/api/user/onboarding-status');
        if (!res.ok) {
          //console.error('Failed to fetch onboarding status', res.status);
          setHasError(true);
          return;
        }
        const data = await res.json();

        // ✅ Safe optional chaining to prevent "Cannot read property"
        const profile = data?.profile;
        if (!profile) {
          console.warn('No profile data found in onboarding response');
          setHasError(true);
          return;
        }

        const onboardingStatusData = profile.onboardingStatus;
        const progressBarData = profile.progress;
        setOnboardingStatus(onboardingStatusData);
        setProgressBar(progressBarData);
        setAllCategories(profile.dependentField.productCategoryList);
      } catch (err) {
        console.error('Error fetching onboarding status:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOnboarding();
  }, [setOnboardingStatus, setProgressBar, setAllCategories]);

  if (isLoading) {
    //return
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700'>
        <UILoaderIndicator label='Fetching your dashboard profile...' />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className='flex flex-1 flex-col gap-0 w-full p-0'>
        <div className='inline-flex space-x-1 bg-white'>
          <SidebarTrigger className='mt-4' />
          <TopNavigation session={session} />
        </div>
        <div className='flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700'>
          <h1 className='text-2xl font-semibold mb-4'>Something went wrong</h1>
          <p className='text-sm text-gray-500 mb-6'>
            We couldn’t load your onboarding data. Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className='has-data-[variant=inset]:bg-white' defaultOpen={defaultOpen}>
      <div className='relative p-0 m-0 flex h-screen w-full'>
        <SidebarComponent />
        <div className='flex flex-1 flex-col gap-0 w-full p-0'>
          <div className='inline-flex space-x-1 bg-white'>
            <SidebarTrigger className='mt-4' />
            <TopNavigation session={session} />
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
