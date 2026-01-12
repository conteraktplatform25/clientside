'use client';
import React, { useEffect } from 'react';
import RevenueDashboard from './_component/RevenueDashboard';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';

const FinancialRevenuePage = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Payments & Financials');
  }, [setTitle]);
  return (
    <div className='mt-8 flex flex-col gap-3 px-8'>
      <RevenueDashboard />
    </div>
  );
};

export default FinancialRevenuePage;
