import React from 'react';
import { useMemo, useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, FileUp, Plus, MoreHorizontal, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { BsTags } from 'react-icons/bs';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ContactFilterDialog } from '../custom/ContactFilterDialog';
import { CreateContactDrawer } from '../custom/CreateContactDialog';
import { useGetDesktopContacts } from '@/lib/hooks/business/contact.hook';
import { useContactStore } from '@/lib/store/business/contact.store';
import { IContactTableHeaderProps } from '@/lib/schemas/business/client/contact.schema';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import { EmptyTable } from '@/components/custom/Emptyable';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';

const ContactTableProfile = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [page, setPage] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError } = useGetDesktopContacts(globalFilter, page, limit);
  const { addedContacts, setAllContacts } = useContactStore();

  useEffect(() => {
    if (data?.contacts) {
      setAllContacts(data.contacts);
    }
  }, [data, setAllContacts]);

  const tableData: IContactTableHeaderProps[] =
    addedContacts.map((contact) => ({
      id: contact.id,
      contact_name: contact.name ?? 'UN-NAMED',
      phone_number: contact.phone_number,
      total_spent: `₦${contact.totalAmountSpent.toLocaleString()}`,
      last_orderId: contact.lastOrderNumber ?? 'NA',
      tags: contact.lastTag ? contact.lastTag.name : 'NA',
      tag_number: contact.totalTags > 0 ? `+${contact.totalTags}` : 'NA',
      tag_color: contact.tagColor ?? '#0d142f',
      created_on: contact.dateCreated,
    })) ?? [];

  const columns = useMemo<ColumnDef<IContactTableHeaderProps>[]>(
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
        accessorKey: 'contact_name',
        header: 'Contact Name',
        cell: ({ row }) => <div className='text-sm text-neutral-600'>{row.getValue('contact_name')}</div>,
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
        cell: ({ row }) => <div className='text-sm text-neutral-600'>{row.getValue('phone_number')}</div>,
      },
      {
        accessorKey: 'total_spent',
        header: 'Total Spent',
        cell: ({ row }) => <div className='text-sm text-neutral-600'>{row.getValue('total_spent')}</div>,
      },
      {
        accessorKey: 'last_orderId',
        header: 'Last Order ID',
        cell: ({ row }) => <div className='text-sm text-neutral-600'>{row.getValue('last_orderId')}</div>,
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
          const { tags, tag_color, tag_number } = row.original;
          return (
            <div className='flex items-start'>
              {tags === 'NA' ? (
                <div className='p-1 rounded border text-xs border-primary-base text-primary-base bg-[#EFF6FF]'>
                  {tag_number}
                </div>
              ) : (
                <div className='flex items-center gap-1 text-sm'>
                  <BsTags style={{ color: tag_color }} />
                  <span style={{ color: tag_color }}>{tags}</span>
                  <div className='p-1 rounded border text-xs border-primary-base text-primary-base bg-[#EFF6FF]'>
                    {tag_number}
                  </div>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'created_on',
        header: 'Created',
        cell: ({ row }) => (
          <div className='text-sm text-neutral-600'>
            {formatDateField(row.getValue('created_on'), { relative: true })}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className='text-center'>Actions</div>,
        cell: ({ row }) => {
          //const [openDialog, setOpenDialog] = useState<boolean>(false);
          const contact = row.original;
          //const openDialog = false;
          const handleAddTagsInit = () => {
            alert(contact.tags);
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='h-6 w-6' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='space-y-2' align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='w-full cursor-pointer' onClick={handleAddTagsInit} asChild>
                  <div className='inline-flex space-x-1.5'>
                    <BsTags className='text-[#1A73E8] w-[13.33px] h-[13.33px]' />
                    <span className='text-sm leading-[155%]'>Add tags</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => alert(contact.id)} asChild>
                  <div className='inline-flex space-x-1.5'>
                    <FaRegTrashAlt className='w-[13.33px] h-[13.33px]' />
                    <span className='text-sm leading-[155%]'>Delete contact</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(contact.id)}>
                  <div className='inline-flex space-x-1.5'>
                    <MessageCircle className='w-[16px] h-[16px]' />
                    <span className='text-sm leading-[155%]'>Send message</span>
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
    data: tableData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // 🧮 Pagination helpers
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className='px-4 flex flex-col gap-2'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-xl text-neutral-800'>Contact Profile</h3>
        <div className='flex items-center gap-4 py-4'>
          <div className='relative'>
            <Search className='absolute left-2 top-2 w-4 h-4 text-gray-400' />
            <Input
              placeholder='Search by name or phone number'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='max-w-sm pl-8 pr-2 py-2 w-full rounded-md border text-sm'
            />
          </div>
          <Button variant='default' className='bg-white border hover:bg-gray-100 rounded-md'>
            <FileUp size={12} color='#1A73E8' />
            <span className='ml-2 text-sm text-neutral-800'>Export</span>
          </Button>
          <ContactFilterDialog onApplyFilters={(f) => console.log('filters', f)} />
          <Button onClick={() => setOpenDrawer(true)} className='bg-primary-base text-white rounded-md'>
            <Plus size={12} />
            <span className='ml-2 text-sm'>Create Contact</span>
          </Button>
          <CreateContactDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
        </div>
      </div>
      <div className='rounded-md border'>
        {isLoading ? (
          <UILoaderIndicator label='Fetching your contact list content...' />
        ) : isError ? (
          <div className='p-6 text-center text-sm text-red-500'>Error loading contacts.</div>
        ) : tableData.length === 0 ? (
          <EmptyTable
            title='No contacts found'
            description='Create your first contact to get started.'
            actionText='Create Contact'
            onAction={() => setOpenDrawer(true)}
          />
        ) : (
          <>
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
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className='flex flex-wrap justify-between items-center py-4 px-3 border-t bg-gray-50 gap-3'>
              <div className='flex items-center gap-3 text-sm text-gray-500'>
                <span>
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} contacts
                </span>
                <div className='flex items-center gap-2'>
                  <label htmlFor='pageSize' className='text-sm text-gray-600'>
                    Rows per page:
                  </label>
                  <select
                    id='pageSize'
                    value={limit}
                    onChange={(e) => {
                      setPage(1);
                      setLimit(Number(e.target.value));
                    }}
                    className='border rounded-md text-sm p-1 px-2'
                  >
                    {[10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Button variant='outline' disabled={page === 1} onClick={() => setPage((p) => Math.max(p - 1, 1))}>
                  <ChevronLeft size={16} /> Prev
                </Button>
                <span className='text-sm'>
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant='outline'
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactTableProfile;
