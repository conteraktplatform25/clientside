// src/app/admin/system/user/_component/SystemAdmins.tsx
'use client';

import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import InviteAdminDrawer from './InviteAdminDrawer';
import AdminUserSummaryCard, { IAdminUserSummaryCardProps } from './AdminUserSummaryCard';
import { TInviteUserResponse } from '@/lib/hooks/admin/system-user.hook';
import { inviteUserListFactory } from '@/lib/mock/system-adminuser.mock';
import { TableInviteAdminUsers } from './TableInviteAdminUsers';

const adminUserSummaryStats: IAdminUserSummaryCardProps[] = [
  {
    title: 'Total Admin Users',
    value: '10',
    icon: 'total',
  },
  {
    title: 'Admins',
    value: '8',
    icon: 'admin',
  },
  {
    title: 'Super Admins',
    value: '2',
    icon: 'super_admin',
  },
] as const;

const SystemAdmins = () => {
  const [isInviteAdminDialogOpen, setIsInviteAdminDialogOpen] = useState<boolean>(false);
  //const [systemUserMock, setSystemUserMock] = useState<TInviteUserResponse[] | null>(null);
  const [systemUserMock, setSystemUserMock] = useState<TInviteUserResponse[]>([]);

  const [currentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [isLoading] = useState<boolean>(false);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTransactionDetails, setSelectedTransactionDetails] = useState<TInviteUserResponse | null>(null);

  console.log(isDetailsDialogOpen, selectedTransactionDetails);
  useEffect(() => {
    setSystemUserMock(inviteUserListFactory(10));
  }, []);

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

  const openInvitationDrawer = useCallback(() => setIsInviteAdminDialogOpen(true), []);

  const handleViewDetails = (user: TInviteUserResponse) => {
    setSelectedTransactionDetails(user);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex justify-between items-start'>
        <h6 className='font-semibold text-xl leading-[150%] text-neutral-800'>Admin Users</h6>
        <div className='flex items-end justify-end gap-4'>
          <Button
            variant={'default'}
            className='bg-primary-base hover:bg-primary-700 text-white rounded-[10px] px-4 py-3 cursor-pointer'
            onClick={openInvitationDrawer}
            asChild
          >
            <div className='inline-flex space-x-1'>
              <FaPlus />
              <span>Invite Admin User</span>
            </div>
          </Button>
        </div>
      </div>
      <motion.div
        variants={container}
        initial='hidden'
        animate='visible'
        className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'
      >
        {adminUserSummaryStats.map((stat, _idx) => (
          <motion.div key={_idx} variants={item}>
            <AdminUserSummaryCard title={stat.title} value={stat.value} icon={stat.icon} />
          </motion.div>
        ))}
      </motion.div>
      <div className='mt-2 mb-8'>
        <TableInviteAdminUsers
          data={systemUserMock}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onViewDetails={handleViewDetails}
          loading={isLoading}
        />
      </div>
      <InviteAdminDrawer open={isInviteAdminDialogOpen} onOpenChange={setIsInviteAdminDialogOpen} />
    </div>
  );
};

export default SystemAdmins;
