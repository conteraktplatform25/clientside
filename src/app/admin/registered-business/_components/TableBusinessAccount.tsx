import { formatDateField } from '@/lib/helpers/date-manipulator.helper';
import { TBusinessAccountResponse } from '@/lib/hooks/admin/registered-business.hook';
import { BusinessAccountStatus } from '@prisma/client';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import AccountStatusBadge from './AccountStatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import BusinessAccountDetailsDialog from './BusinessAccountDetailsDialog';

interface IOrdersTableProps {
  data: TBusinessAccountResponse[];
  currentPage: number;
  rowsPerPage: number;
  loading?: boolean;
  onStatusChange?: (accountId: string, newStatus: BusinessAccountStatus) => void;
  onViewDetails: (account: TBusinessAccountResponse) => void;
}

const TableBusinessAccount: React.FC<IOrdersTableProps> = ({ data, loading = false, onStatusChange }) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  const handleViewDetails = (accountId: string) => {
    setSelectedAccountId(accountId);
    setIsViewDetailsOpen(true);
  };

  const columns: ColumnDef<TBusinessAccountResponse>[] = [
    // {
    //   accessorKey: 'businessAccountId',
    //   header: 'Order ID',
    //   cell: ({ row }) => <div className='text-sm font-light'>{row.original.businessAccountId}</div>,
    // },
    {
      accessorKey: 'business_name',
      header: 'Business Name',
      cell: ({ row }) => <div className='text-sm font-light'>{row.original.business_name}</div>,
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => <div className='text-sm font-light'>{row.original.contact_phone_number}</div>,
    },
    {
      accessorKey: 'account_status',
      header: 'Status',
      cell: ({ row }) => (
        <AccountStatusBadge
          status={row.original.account_status}
          onStatusChange={(newStatus) => onStatusChange?.(row.original.id, newStatus)}
        />
      ),
    },
    {
      accessorKey: 'last_login',
      header: 'Last login',
      cell: ({ row }) => <div>{formatDateField(row.getValue('last_login'))}</div>,
    },
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
      <BusinessAccountDetailsDialog
        accountId={selectedAccountId}
        open={isViewDetailsOpen}
        onOpenChange={setIsViewDetailsOpen}
      />
    </div>
  );
};

export default TableBusinessAccount;
