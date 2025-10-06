'use client';
import React, { useMemo, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IManageTagTableModelProps {
  id?: string;
  tag_name: string;
  tag_type: string;
  created_on: string;
  created_by: string;
}

const data: IManageTagTableModelProps[] = [
  { id: '25', tag_name: 'Monday Order', tag_type: 'Order', created_on: '15/09/2025', created_by: 'Developer' },
  { id: '34', tag_name: 'Will look into it', tag_type: 'Delivery', created_on: '01/10/2025', created_by: 'Developer' },
  { id: '42', tag_name: 'Wednesday Order', tag_type: 'Order', created_on: '10/08/2025', created_by: 'Developer' },
  { id: '61', tag_name: 'First time buyer', tag_type: 'Purchase', created_on: '07/06/2025', created_by: 'Developer' },
  { id: '62', tag_name: 'Pending Payment', tag_type: 'Payment', created_on: '02/10/2025', created_by: 'Developer' },
];

export default function ManageTagsTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = useMemo<ColumnDef<IManageTagTableModelProps>[]>(
    () => [
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
        accessorKey: 'tag_name',
        header: () => <div className='font-semibold text-sm text-left'>Tag Name</div>,
      },
      {
        accessorKey: 'tag_type',
        header: () => <div className='font-semibold text-sm text-left'>Tag Type</div>,
      },
      {
        accessorKey: 'created_on',
        header: () => <div className='font-semibold text-sm text-left'>Created On</div>,
      },
      {
        accessorKey: 'created_by',
        header: () => <div className='font-semibold text-sm text-left'>Created By</div>,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      return (
        row.original.tag_name.toLowerCase().includes(search) || row.original.tag_type.toLowerCase().includes(search)
      );
    },
  });

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className='px-4 flex flex-col gap-2'>
      <div className='flex justify-between items-center py-4 px-2'>
        <h3 className='font-semibold text-xl text-neutral-800'>Manage Tags</h3>
        <div className='flex items-center gap-4'>
          <div className='mb-1 inline-flex space-x-0.5 font-semibold text-primary-base'>
            <p className='text-base'>Total Tags:</p>
            <span className='text-base'>{data.length}</span>
          </div>

          {/* ✅ Delete button reacts to selection */}
          <Button
            variant={'outline'}
            disabled={selectedCount === 0}
            className={`rounded-[8px] border font-medium text-base cursor-pointer
              ${
                selectedCount > 0
                  ? 'text-[#0953b5] border-[#1A73E8] hover:text-[#0953b5] cursor-pointer'
                  : 'text-[#C4C6CA] border-[#C4C6CA] hover:text-[#9a9b9d] cursor-not-allowed'
              }`}
          >
            <div className='inline-flex space-x-1 items-center'>
              <FaRegTrashAlt />
              <span>Delete tag(s)</span>
            </div>
          </Button>

          {/* ✅ Search input filters by tag_name */}
          <div className='relative'>
            <Search className='absolute left-2 top-2 w-4 h-4 text-gray-400' />
            <Input
              placeholder='Search by tag name or type'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='max-w-sm pl-8 pr-2 py-2 w-full rounded-md border text-sm focus-visible:border-none focus-visible:ring-ring/50 focus-visible:ring-[1px]'
            />
          </div>
        </div>
      </div>

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
            {table.getRowModel().rows.length ? (
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
      {data && data.length > 2 && (
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm text-neutral-600'>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className='w-[100px]'>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
