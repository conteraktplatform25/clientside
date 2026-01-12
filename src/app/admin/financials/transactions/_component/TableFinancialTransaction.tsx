'use client';
import React, { useState } from 'react';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';
import { PaymentStatus } from '@prisma/client';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TFinancialTransactionResponse } from '@/lib/hooks/admin/financial-transactions.hook';
//import TransactionStatusBadge from '@/app/admin/registered-business/_components/TransactionStatusBadge';
import TransactionDetailsDialog from './TransactionDetailsDialog';
import TransactionStatusBadge from './TransactionStatusBadge';

interface ITransactionsTableProps {
  data: TFinancialTransactionResponse[];
  currentPage: number;
  rowsPerPage: number;
  loading?: boolean;
  onStatusChange?: (transactionId: string, newStatus: PaymentStatus) => void;
  onViewDetails: (transaction: TFinancialTransactionResponse) => void;
}

const TableFinancialTransaction: React.FC<ITransactionsTableProps> = ({ data, loading = false, onStatusChange }) => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  const handleViewDetails = (transactionId: string) => {
    console.log(transactionId);
    setSelectedTransactionId(transactionId);
    setIsViewDetailsOpen(true);
  };

  const columns: ColumnDef<TFinancialTransactionResponse>[] = [
    {
      accessorKey: 'businessTransactionId',
      header: 'Transaction ID',
      cell: ({ row }) => <div className='text-sm font-light'>{row.original.businessTransactionId}</div>,
    },
    {
      accessorKey: 'transaction_type',
      header: 'Transaction Type',
      cell: ({ row }) => <div className='text-sm font-light'>{row.original.transaction_type}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div className='text-sm font-light'>{row.original.amount}</div>,
    },
    {
      accessorKey: 'paid_by',
      header: 'Paid By',
      cell: ({ row }) => <div className='text-sm font-light'>{row.original.paid_by}</div>,
    },
    {
      accessorKey: 'transaction_status',
      header: 'Status',
      cell: ({ row }) => (
        <TransactionStatusBadge
          status={row.original.transaction_status}
          onStatusChange={(newStatus) => onStatusChange?.(row.original.id, newStatus)}
        />
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => <div>{formatDateField(row.getValue('created_at'))}</div>,
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
          Transaction details
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
      <TransactionDetailsDialog
        transactionId={selectedTransactionId}
        open={isViewDetailsOpen}
        onOpenChange={setIsViewDetailsOpen}
      />
    </div>
  );
};

export default TableFinancialTransaction;
