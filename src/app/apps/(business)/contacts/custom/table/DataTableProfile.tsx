'use client';
import { useMemo, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUp, MessageCircle, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { BsTags } from 'react-icons/bs';
import { FaRegTrashAlt } from 'react-icons/fa';
import { ContactFilterDialog } from '../ContactFilterDialog';
import { CreateContactDrawer } from '../CreateContactDialog';

// Define the interface for contact data
interface IContactTableHeaderProps {
  id?: string | number;
  contact_name: string;
  phone_number?: string;
  total_spent?: string;
  last_orderId?: string;
  tags?: string;
  created_on?: Date | null;
  tag_number?: string;
  tag_color?: string;
}

// Sample data
const data: IContactTableHeaderProps[] = [
  {
    id: 10,
    contact_name: 'John Doe',
    phone_number: '+1-555-123-4567',
    total_spent: '₦80,000.00',
    last_orderId: '#8452',
    tags: 'Monday order',
    tag_number: '+2',
    tag_color: '#4D26C9',
    created_on: new Date('2024-06-01'),
  },
  {
    id: 20,
    contact_name: 'Jane Smith',
    phone_number: '(+234)805488388',
    total_spent: '₦120,000.00',
    last_orderId: '#8590',
    tags: 'Monday order',
    tag_number: '+3',
    tag_color: '#4D26C9',
    created_on: new Date('2025-05-22'),
  },
  {
    id: 45,
    contact_name: 'Strump Akanbi',
    phone_number: '+27-679-222-1357',
    total_spent: '₦1,902,000.00',
    last_orderId: '#1940',
    tags: 'Will look into',
    tag_number: '+1',
    tag_color: '#EF3838',
    created_on: new Date('2025-01-15'),
  },
  {
    id: 67,
    contact_name: 'Alice Johnson',
    phone_number: '+1-555-456-7890',
    total_spent: '₦240,000.00',
    last_orderId: '#3794',
    tags: 'First time buyer',
    tag_number: '+3',
    tag_color: '#0D3A74',
    created_on: new Date('2024-12-18'),
  },
  {
    id: 30,
    contact_name: 'Dunfries Kalenjon',
    phone_number: '(+334)48859991',
    total_spent: '₦1,392,000.00',
    last_orderId: '#4302',
    tags: 'Pending payment',
    tag_number: '+1',
    tag_color: '#F2BD17',
    created_on: new Date('2025-10-02'),
  },
];

export default function DataTableProfile() {
  const [globalFilter, setGlobalFilter] = useState('');
  // Define columns using useMemo for stable column definitions
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
        header: () => <div className='font-semibold text-sm text-left'>Contact Name</div>,
        cell: ({ row }) => (
          <div className='text-sm leading-[155%] text-neutral-600'>{row.getValue('contact_name')}</div>
        ),
      },
      {
        accessorKey: 'phone_number',
        header: () => <div className='font-semibold text-sm text-left'>Phone Number</div>,
        cell: ({ row }) => {
          return <div className='text-sm leading-[155%] text-neutral-600'>{row.getValue('phone_number')}</div>;
        },
      },
      {
        accessorKey: 'total_spent',
        header: () => <div className='font-semibold text-sm text-left'>Total Spent</div>,
        cell: ({ row }) => {
          const amount = row.original.total_spent || '₦0.00';
          return <div className='text-sm leading-[155%] text-neutral-600'>{amount}</div>;
        },
      },
      {
        accessorKey: 'last_orderId',
        header: 'Last Order ID',
        cell: ({ row }) => (
          <div className='text-sm leading-[155%] text-neutral-600'>{row.getValue('last_orderId')}</div>
        ),
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
          const { tags, tag_color, tag_number } = row.original;
          return (
            <div className='flex gap-1 text-sm leading-[155%] items-center'>
              <BsTags style={{ color: tag_color }} /> {/* Optional: color the icon too */}
              <span style={{ color: tag_color }}>{tags}</span>
              <div className='p-1 rounded-[4px] border-[0.5px] text-xs border-primary-base text-primary-base bg-[#EFF6FF]'>
                {tag_number}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'created_on',
        header: 'Created On',
        cell: ({ row }) => {
          const date = row.original.created_on;
          return (
            <div className='text-sm leading-[155%] text-neutral-600'>{date ? date.toLocaleDateString() : 'N/A'}</div>
          );
        },
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
  const [openDrawer, setOpenDrawer] = useState(false);

  // Initialize table with react-table
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const name = row.original.contact_name.toLowerCase();
      const phone = row.original.phone_number?.toLowerCase() || '';
      return name.includes(search) || phone.includes(search);
    },
  });

  const handleApplyFilters = (filters: unknown) => {
    console.log('Applied filters:', filters);
  };

  return (
    <div className='px-4 flex flex-col gap-2'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-xl text-neutral-800'>Contact Profile</h3>
        <div className='flex justify-end items-end py-4 gap-4'>
          <div className='relative'>
            <Search className='absolute left-2 top-2 w-4 h-4 text-gray-400' />
            <Input
              placeholder='Search by name or phone number'
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)} // Use global state
              className='max-w-sm pl-8 pr-2 py-2 w-full rounded-md border text-sm'
            />
          </div>
          <Button
            variant={'default'}
            className='bg-white hover:bg-gray-100 rounded-[8px] py-2.5 px-3 border border-[#EEEFF1] cursor-pointer'
            asChild
          >
            <div className='inline-flex gap-1.5'>
              <FileUp size={12} strokeWidth={1.3} color='#1A73E8' />
              <span className='font-medium text-base leading-[150%] text-neutral-800'>Export contacts</span>
            </div>
          </Button>
          <ContactFilterDialog onApplyFilters={handleApplyFilters} />
          <Button
            onClick={() => setOpenDrawer(true)}
            variant={'default'}
            className='bg-primary-base hover:bg-primary-700 rounded-[10px] py-3 px-4 border-white cursor-pointer'
            asChild
          >
            <div className='inline-flex gap-1.5'>
              <Plus size={10.5} strokeWidth={1.5} color='#ffffff' />
              <span className='font-semibold text-sm leading-[155%] text-white'>Create Contact</span>
            </div>
          </Button>
          <CreateContactDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
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
    </div>
  );
}
