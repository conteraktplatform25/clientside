'use client';

import React, { useState } from 'react';
import BusinessAccountFilter from './BusinessAccountFilter';
import { BusinessAccountStatus } from '@prisma/client';
import AccountSummaryCard, { IAccountSummaryCardProps } from './AccountSummaryCard';
import { motion, Variants } from 'framer-motion';
import TableBusinessAccount from './TableBusinessAccount';
import { MockBusinessAccounts as mock } from '@/lib/mock/business-account.mock';
import { TBusinessAccountResponse } from '@/lib/hooks/admin/registered-business.hook';
import PaginationControls from '@/components/custom/PaginationControls';

const acctSummaryStats: IAccountSummaryCardProps[] = [
  {
    title: 'Active businesses',
    value: '90',
    icon: 'active',
  },
  {
    title: 'Messages sent',
    value: '16,300',
    icon: 'messages',
  },
  {
    title: 'Total products shared',
    value: '1,700',
    icon: 'shared',
  },
];

const RegisteredBusiness = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All status' | BusinessAccountStatus>('All status');

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedAccountDetails, setSelectedAccountDetails] = useState<TBusinessAccountResponse | null>(null);
  const [isLoading] = useState<boolean>(false);

  console.log(isDetailsDialogOpen, selectedAccountDetails);

  const totalPages = 10;

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

  const handleViewDetails = (order: TBusinessAccountResponse) => {
    setSelectedAccountDetails(order);
    setIsDetailsDialogOpen(true);
  };
  return (
    <div className='w-full p-4'>
      <div className='flex justify-between items-start'>
        <h6 className='font-semibold text-xl leading-[150%] text-neutral-800'>Overview of business performance</h6>
        <div className='flex items-end justify-end gap-4'>
          <input
            placeholder='Search by name or OrderID'
            className='border px-3 py-2 rounded-md w-[200px] text-sm'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className='inline-flex space-x-2'>
            <BusinessAccountFilter selectedStatus={selectedStatusFilter} onStatusChange={setSelectedStatusFilter} />
          </div>
        </div>
      </div>
      <motion.div
        variants={container}
        initial='hidden'
        animate='visible'
        className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      >
        {acctSummaryStats.map((stat, _idx) => (
          <motion.div key={_idx} variants={item}>
            <AccountSummaryCard title={stat.title} value={stat.value} icon={stat.icon} />
          </motion.div>
        ))}
      </motion.div>
      <TableBusinessAccount
        data={mock}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onViewDetails={handleViewDetails}
        loading={isLoading}
      />
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

export default RegisteredBusiness;
