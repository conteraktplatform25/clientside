'use client';

import React, { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// import StatusBadge from '../StatusBadge';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';
import { TBusinessTeamSettingResponse } from '@/lib/hooks/business/userprofile-settings.hook';
// import OrderDetailsTestDialog from '../OrderDetailsTestDialog';
//import { IOrderProps, OrderStatus } from "@/type/client/business/order.type";

interface ITeamMemberTableProps {
  data: TBusinessTeamSettingResponse[];
  currentPage: number;
  rowsPerPage: number;
  loading?: boolean;
  //onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: TBusinessTeamSettingResponse) => void;
}

export const TeamMemberTable: React.FC<ITeamMemberTableProps> = ({ data, loading = false, onViewDetails }) => {
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  console.log('Team Member table:', selectedTeamMemberId, isViewDetailsOpen);

  console.log('Team Member table:', onViewDetails);

  const columns: ColumnDef<TBusinessTeamSettingResponse>[] = [
    {
      accessorKey: 'first_name',
      header: 'First Name',
      cell: ({ row }) => <div className='text-sm font-medium leading-[150%]'>{row.original.user.first_name}</div>,
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      cell: ({ row }) => <div className='font-medium text-sm leading-[150%]'>{row.original.user.last_name}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className='font-light text-sm leading-[150%]'>{row.original.user.email}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div className='font-light text-sm leading-[150%]'>{row.original.user.phone}</div>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <div className='text-primary-700 font-bold text-sm leading-[150%]'>{row.original.role.name}</div>
      ),
    },
    {
      accessorKey: 'joined_at',
      header: 'Date Joined',
      cell: ({ row }) => (
        <div className='font-light text-sm leading-[150%]'>{formatDateField(row.getValue('joined_at'))}</div>
      ),
    },
    // {
    //   accessorKey: 'status',
    //   header: 'Status',
    //   cell: ({ row }) => (
    //     <StatusBadge
    //       status={row.original.status}
    //       onStatusChange={(newStatus) => onStatusChange?.(row.original.id, newStatus)}
    //     />
    //   ),
    // },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          className='font-medium text-sm text-primary-base hover:text-primary-700'
          variant='link'
          onClick={() => handleViewDetails(row.original.id)}
        >
          View details
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleViewDetails = (memberId: string) => {
    console.log(memberId);
    setSelectedTeamMemberId(memberId);
    setIsViewDetailsOpen(true);
  };

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

      {/* <OrderDetailsTestDialog orderId={selectedOrderId} open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen} /> */}
    </div>
  );
};
