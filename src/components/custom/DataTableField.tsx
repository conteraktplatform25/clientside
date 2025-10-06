'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IDataTableProps } from '@/type/client/default.type';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DataTableField<TData, TValue>({ columns, data, title, children }: IDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className='px-4 flex flex-col gap-2'>
      <div className='flex justify-between items-center py-4 px-2'>
        <div className='inline gap-2'>
          {title && <h3 className='font-semibold text-xl leading-[150%] text-neutral-800'>{title}</h3>}
        </div>
        {children && children}
      </div>
      <div className='rounded-[10px] border border-[#EEEFF1] shadow-sm'>
        {/* Single scroll container */}
        <div className='max-h-[380px] overflow-y-auto overflow-x-auto'>
          <Table className='relative w-full'>
            <TableHeader className='sticky top-0 z-20 bg-white'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='bg-white'>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className='sticky top-0 z-20 bg-white text-left'
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='text-left' style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
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
      </div>
      {data && data.length > 9 && (
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
