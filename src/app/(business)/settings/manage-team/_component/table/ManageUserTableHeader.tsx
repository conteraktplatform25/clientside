'use client';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { IUserProfileTableHeaderProps } from '@/type/client/business/settings.type';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LucidePencil, MoreHorizontal } from 'lucide-react';

export const ManageUserTableHeader: ColumnDef<IUserProfileTableHeaderProps>[] = [
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
    accessorKey: 'full_name',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Full Name</div>,
  },
  {
    accessorKey: 'phone_number',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Phone Number</div>,
  },
  {
    accessorKey: 'email',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Email</div>,
  },
  {
    accessorKey: 'created_by',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Created By</div>,
  },
  {
    accessorKey: 'email_verified_date',
    header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Last logged in</div>,
  },
  {
    id: 'actions',
    header: () => <div className='text-left'>Action</div>,
    cell: ({ row }) => {
      const reply = row.original;
      const handleEditReply = () => {
        console.log(reply);
      };
      const handleDeleteReply = () => {
        console.log(reply);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-6 w-6' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEditReply} asChild>
              <div className='inline-flex space-x-3 w-full'>
                <LucidePencil className='mt-0.5' color='#1A73E8' />
                <span className='text-sm leading-[155%] text-[#373D4A]'>Edit</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteReply}>
              <div className='inline-flex space-x-3 w-full'>
                <FaRegTrashAlt className='mt-0.5' color='#b33605' />
                <span className='text-sm leading-[155%] text-[#373D4A]'>Delete</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
