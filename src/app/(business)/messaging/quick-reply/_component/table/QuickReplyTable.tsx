'use client';

import React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IQuickReplyTableProps } from '@/type/client/business/quickreply.type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LucidePencil, MoreHorizontal } from 'lucide-react';
import { FaRegTrashAlt } from 'react-icons/fa';

interface QuickReplyTableProps {
  data: IQuickReplyTableProps[];
  currentPage: number;
  rowsPerPage: number;
  onViewDetails: (reply: IQuickReplyTableProps) => void;
  onDeleteReply: (reply: IQuickReplyTableProps) => void;
}

const QuickReplyTable: React.FC<QuickReplyTableProps> = ({ data, onViewDetails, onDeleteReply }) => {
  const columns: ColumnDef<IQuickReplyTableProps>[] = [
    {
      accessorKey: 'title',
      header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Title</div>,
    },
    {
      accessorKey: 'created_by',
      header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Created By</div>,
    },
    {
      accessorKey: 'created_on',
      header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Created on</div>,
    },
    {
      accessorKey: 'quick_reply',
      header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Quick reply</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open reply menu</span>
                <MoreHorizontal className='h-6 w-6' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewDetails(row.original)} asChild>
                <div className='inline-flex space-x-3'>
                  <LucidePencil className='mt-0.5' color='#1A73E8' />
                  <span className='text-sm leading-[155%] text-[#373D4A]'>Edit</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteReply(row.original)}>
                <div className='inline-flex space-x-3'>
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

export default QuickReplyTable;
