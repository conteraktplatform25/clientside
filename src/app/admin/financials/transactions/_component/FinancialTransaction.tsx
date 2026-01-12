'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import BusinessCustomerFilter, { BusinessNamesFilter } from './BusinessCustomerFilter';
import PaymentTransactionFilter from './PaymentTransactionFilter';
import { PaymentStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { DateRangePickerPremium } from '@/components/custom/DateRangePickerPremium';
import TransactionSummaryCard, { ITransactionSummaryCardProps } from './TransactionSummaryCard';
import TableFinancialTransaction from './TableFinancialTransaction';
import { TFinancialTransactionResponse } from '@/lib/hooks/admin/financial-transactions.hook';
import { MockFinancialTransactions as mock } from '@/lib/mock/financial-transaction.mock';
import PaginationControls from '@/components/custom/PaginationControls';

const transactionSummaryStats: ITransactionSummaryCardProps[] = [
  {
    title: 'Total Transactions',
    value: '300',
    icon: 'transaction',
  },
  {
    title: 'Successful',
    value: '220',
    icon: 'success',
  },
  {
    title: 'Pending',
    value: '40',
    icon: 'pending',
  },
  {
    title: 'Failed',
    value: '40',
    icon: 'failed',
  },
] as const;

const FinancialTransaction = () => {
  const [selectedBusinessNameFilter, setSelectedBusinessNameFilter] = useState<
    'All business customer' | BusinessNamesFilter
  >('All business customer');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<'All' | PaymentStatus>('All');
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState<TFinancialTransactionResponse | null>(
    null
  );
  console.log(isDetailsDialogOpen, selectedTransactionDetails);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isLoading] = useState<boolean>(false);

  const totalPages = 2;

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring', // ✅ now correctly typed
      },
    },
  };

  const handleViewDetails = (order: TFinancialTransactionResponse) => {
    setSelectedTransactionDetails(order);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex justify-between items-start'>
        <h6 className='font-semibold text-xl leading-[150%] text-neutral-800'>Transactions</h6>
        <div className='flex items-end justify-end gap-4'>
          <BusinessCustomerFilter
            selectedStatus={selectedBusinessNameFilter}
            onStatusChange={setSelectedBusinessNameFilter}
          />
          <PaymentTransactionFilter selectedStatus={selectedPaymentFilter} onStatusChange={setSelectedPaymentFilter} />
          <Button variant='default' className='bg-white border hover:bg-gray-100 rounded-md'>
            <FileUp size={12} color='#1A73E8' />
            <span className='ml-2 text-sm text-neutral-800'>Export</span>
          </Button>
          <DateRangePickerPremium value={dateRange} onChange={setDateRange} />
        </div>
      </div>
      <motion.div
        variants={container}
        initial='hidden'
        animate='visible'
        className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
      >
        {transactionSummaryStats.map((stat, _idx) => (
          <motion.div key={_idx} variants={item}>
            <TransactionSummaryCard title={stat.title} value={stat.value} icon={stat.icon} />
          </motion.div>
        ))}
      </motion.div>
      <div className='mt-2 mb-8'>
        <TableFinancialTransaction
          data={mock}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onViewDetails={handleViewDetails}
          loading={isLoading}
        />
      </div>
      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </div>
  );
};

export default FinancialTransaction;
