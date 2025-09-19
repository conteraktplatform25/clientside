import React, { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface IContactDataTableProps<TData, TValue> {
  getNewContact?: (newContact: TData) => void;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ContactDataTable<TData, TValue>({
  getNewContact,
  columns,
  data,
}: IContactDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  //const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  console.log(getNewContact);

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
      <div className='flex justify-between items-center py-4'>
        <div className='relative'>
          <Search className='absolute left-2 top-2 w-4 h-4 text-gray-400' />
          <Input
            placeholder='Search by name or phone number'
            value={(table.getColumn('contact_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('contact_name')?.setFilterValue(event.target.value)}
            className='max-w-sm pl-8 pr-2 py-2 w-full rounded-md border text-sm'
          />
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow className='hover:bg-transparent' key={group.id}>
                {group.headers.map((header, index) => {
                  return (
                    <TableHead key={index} className=' text-neutral-800 text-sm leading-[155%] font-semibold'>
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
                <TableRow
                  className='hover:bg-white/10 data-[state=selected]:bg-white/20'
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No Contact have been retrieved.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='pt-4 flex-1 text-sm text-muted-foreground'>
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      {/* <ResponsiveDialog isOpen={isCreateTaskOpen} setIsOpen={setIsCreateTaskOpen} title='Create New Task'>
        <CreateNewTask getNewTaskProfile={getNewTask} setIsOpen={setIsCreateTaskOpen} appAuth={appAuthenticator} />
      </ResponsiveDialog> */}
    </div>
  );
}

export default ContactDataTable;
