'use client';

import React, { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import StatusBadge from '../StatusBadge';
import { TOrderResponse } from '@/lib/hooks/business/order-product.hook';
import { OrderStatus } from '@prisma/client';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';
import OrderDetailsTestDialog from '../OrderDetailsTestDialog';
//import { IOrderProps, OrderStatus } from "@/type/client/business/order.type";

interface IOrdersTableProps {
  data: TOrderResponse[];
  currentPage: number;
  rowsPerPage: number;
  loading?: boolean;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: TOrderResponse) => void;
}

export const OrderTestTable: React.FC<IOrdersTableProps> = ({
  data,
  loading = false,
  onStatusChange,
  onViewDetails,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  console.log(onViewDetails);

  const columns: ColumnDef<TOrderResponse>[] = [
    {
      accessorKey: 'order_number',
      header: 'Order ID',
      cell: ({ row }) => <div className='text-sm font-light'>{row.original.order_number}</div>,
    },
    {
      accessorKey: 'customer_name',
      header: 'Customer Name',
      cell: ({ row }) => <div className='font-medium'>{row.original.contact_name}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>₦{row.original.total_amount.toLocaleString('en-NG')}</div>,
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => <div className='text-error-700'>{row.original.payment_status}</div>,
    },
    {
      accessorKey: 'created_at',
      header: 'Date of Order',
      cell: ({ row }) => <div>{formatDateField(row.getValue('created_at'))}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          onStatusChange={(newStatus) => onStatusChange?.(row.original.id, newStatus)}
        />
      ),
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

  const handleViewDetails = (orderId: string) => {
    console.log(orderId);
    setSelectedOrderId(orderId);
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

      <OrderDetailsTestDialog orderId={selectedOrderId} open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen} />
    </div>
  );
};
