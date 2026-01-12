'use client';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import React, { useEffect } from 'react';
import FinancialTransaction from './_component/FinancialTransaction';

const TransactionPage = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Payments & Financials');
  }, [setTitle]);
  return (
    <div className='mt-8 flex flex-col gap-3 px-8'>
      <FinancialTransaction />
    </div>
  );
};

export default TransactionPage;
