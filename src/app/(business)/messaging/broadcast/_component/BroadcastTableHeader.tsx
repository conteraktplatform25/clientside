'use client';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { IBroadcastMessageTableHeaderProps } from '@/type/client/business/broadcast.type';
import BroadcastDetails from './BroadcastDetails';

export const BroadcastTableHeaders: ColumnDef<IBroadcastMessageTableHeaderProps>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Title</div>,
  },
  {
    accessorKey: 'created_by',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Created By</div>,
  },
  {
    accessorKey: 'state',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>State</div>,
  },
  {
    accessorKey: 'recipients',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Recipient</div>,
  },
  {
    id: 'actions',
    header: () => <div className='text-center'>Action</div>,
    cell: ({ row }) => {
      return <BroadcastDetails broadcast={row.original} />;
    },
  },
];
