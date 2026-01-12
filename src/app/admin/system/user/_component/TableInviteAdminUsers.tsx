// src/app/admin/system/user/_component/TableInviteAdminUsers.tsx
'use client';
import React, { useMemo, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TInviteUserResponse } from '@/lib/hooks/admin/system-user.hook';
import AdminUserStatusBadge from './AdminUserStatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ban, MoreHorizontal, PenLine } from 'lucide-react';
import { AdminOnboardingStatus } from '@/lib/enums/admin/admin-onboarding-status.enum';
import { formatEnumLabel } from '@/lib/helpers/string-manipulator.helper';

interface IInvitedAdminUserTableProps {
  data: TInviteUserResponse[];
  currentPage: number;
  rowsPerPage: number;
  loading?: boolean;
  onStatusChange?: (adminUserId: string, newStatus: AdminOnboardingStatus) => void;
  onViewDetails: (transaction: TInviteUserResponse) => void;
}

export const TableInviteAdminUsers: React.FC<IInvitedAdminUserTableProps> = ({ data, loading = false }) => {
  const [selectedAdminUserId, setSelectedAdminUserId] = useState<string | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  console.log(selectedAdminUserId, isViewDetailsOpen);
  const handleViewDetails = (adminUserId: string) => {
    console.log(adminUserId);
    setSelectedAdminUserId(adminUserId);
    setIsViewDetailsOpen(true);
  };

  const columns = useMemo<ColumnDef<TInviteUserResponse>[]>(
    () => [
      {
        accessorKey: 'first_name',
        header: 'First Name',
        cell: ({ row }) => <div className='text-sm font-light'>{row.original.first_name}</div>,
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        cell: ({ row }) => <div className='text-sm font-light'>{row.original.last_name}</div>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div className='text-sm font-light'>{row.original.email}</div>,
      },

      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminUserStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'role',
        header: 'System Role',
        cell: ({ row }) => <div className='text-sm font-light'>{formatEnumLabel(row.original.role)}</div>,
      },
      {
        id: 'actions',
        header: () => <div className='text-center'>Actions</div>,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='h-6 w-6' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='flex flex-col gap-2' align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='cursor-pointer hover:bg-[#EFF6FF]'
                  onClick={() => handleViewDetails(user.id)}
                  asChild
                >
                  <div className='inline-flex space-x-1.5'>
                    <PenLine className='w-[13.33px] h-[13.33px] text-primary-base' />
                    <span className='text-sm leading-[155%]'>Edit User</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => alert(user.id)} asChild>
                  <div className='inline-flex space-x-1.5'>
                    <Ban className='w-[13.33px] h-[13.33px]' />
                    <span className='text-sm leading-[155%]'>Deactivate user</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            // 🔥 Loading Skeleton Rows
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columns.length }).map((_, idx) => (
                  <TableCell key={idx}>
                    <Skeleton className='h-5 w-full rounded-sm' />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <TransactionDetailsDialog
              transactionId={selectedTransactionId}
              open={isViewDetailsOpen}
              onOpenChange={setIsViewDetailsOpen}
            /> */}
    </div>
  );
};
