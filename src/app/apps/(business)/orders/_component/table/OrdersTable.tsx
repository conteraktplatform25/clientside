'use client';

import React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

//import StatusBadge from '../StatusBadge';
import { IOrderProps, OrderStatus } from '@/type/client/business/order.type';

interface OrdersTableProps {
  data: IOrderProps[];
  currentPage: number;
  rowsPerPage: number;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: IOrderProps) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ data, onStatusChange, onViewDetails }) => {
  console.log(onStatusChange);
  const columns: ColumnDef<IOrderProps>[] = [
    {
      accessorKey: 'orderId',
      header: 'Order ID',
      cell: ({ row }) => <div className='font-medium'>#{row.original.orderId}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>₦{row.original.amount.toLocaleString('en-NG')}</div>,
    },
    {
      accessorKey: 'dateTime',
      header: 'Date & time',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => <div>{row.original.quantity} items</div>,
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div>{row.original.id}</div>
        // <StatusBadge
        //   status={row.original.status}
        //   onStatusChange={(newStatus) => onStatusChange(row.original.id, newStatus)}
        // />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          className='font-medium text-sm leading-[150%] text-primary-base hover:text-primary-700 text-center'
          variant='link'
          onClick={() => onViewDetails(row.original)}
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
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
