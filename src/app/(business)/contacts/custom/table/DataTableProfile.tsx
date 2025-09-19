import { useMemo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUp, MoreHorizontal, Plus, Search } from 'lucide-react';
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
//import ConfirmationDialog from '@/components/special-ui/ConfirmationDialog';

// Define the interface for contact data
interface IContactTableHeaderProps {
  id?: string | number;
  contact_name?: string;
  phone_number?: string;
  total_spent?: Date | null;
  last_orderId?: boolean;
  tags?: string;
  created_on?: Date | null;
}

// Sample data
const data: IContactTableHeaderProps[] = [
  {
    id: 1,
    contact_name: 'John Doe',
    phone_number: '+1-555-123-4567',
    total_spent: new Date('2025-01-15'),
    last_orderId: true,
    tags: 'VIP, Regular',
    created_on: new Date('2024-06-01'),
  },
  {
    id: 2,
    contact_name: 'Jane Smith',
    phone_number: '+1-555-987-6543',
    total_spent: new Date('2025-03-22'),
    last_orderId: false,
    tags: 'New',
    created_on: new Date('2024-08-15'),
  },
  {
    id: 3,
    contact_name: 'Alice Johnson',
    phone_number: '+1-555-456-7890',
    total_spent: null,
    last_orderId: true,
    tags: 'Premium',
    created_on: new Date('2024-09-01'),
  },
];

export default function DataTableProfile() {
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
      // {
      //   accessorKey: 'id',
      //   header: 'ID',
      //   cell: ({ row }) => <div>{row.getValue('id')}</div>,
      // },
      {
        accessorKey: 'contact_name',
        header: 'Contact Name',
        cell: ({ row }) => <div>{row.getValue('contact_name')}</div>,
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
        cell: ({ row }) => <div>{row.getValue('phone_number')}</div>,
      },
      {
        accessorKey: 'total_spent',
        header: 'Total Spent Date',
        cell: ({ row }) => {
          const date = row.getValue('total_spent') as Date | null;
          return <div>{date ? date.toLocaleDateString() : 'N/A'}</div>;
        },
      },
      {
        accessorKey: 'last_orderId',
        header: 'Has Last Order',
        cell: ({ row }) => <div>{row.getValue('last_orderId') ? 'Yes' : 'No'}</div>,
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => <div>{row.getValue('tags') || 'None'}</div>,
      },
      {
        accessorKey: 'created_on',
        header: 'Created On',
        cell: ({ row }) => {
          const date = row.getValue('created_on') as Date | null;
          return <div>{date ? date.toLocaleDateString() : 'N/A'}</div>;
        },
      },
      {
        id: 'actions',
        header: () => <div className='text-center'>Actions</div>,
        cell: ({ row }) => {
          //const [openDialog, setOpenDialog] = useState<boolean>(false);
          const contact = row.original;
          //const openDialog = false;
          const handleCompletedInit = () => {
            console.log(contact.tags);
          };
          // const handleConfirm = () => {
          //   console.log();
          // };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='h-6 w-6' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCompletedInit}>Mark as Completed</DropdownMenuItem>
                {/* <ConfirmationDialog
                  isOpen={openDialog}
                  onOpenChange={setOpenDialog}
                  onConfirm={handleConfirm}
                  title='Are you sure?'
                  description='This action cannot be undone.'
                  confirmText='Close Profile'
                  cancelText='Cancel'
                /> */}
                <DropdownMenuItem onClick={() => alert(contact.id)}>Edit Task Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert(contact.id)}>Delete Task</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  // Initialize table with react-table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='px-4 flex flex-col gap-2'>
      <div className='flex justify-end items-end py-4 gap-4'>
        <div className='relative'>
          <Search className='absolute left-2 top-2 w-4 h-4 text-gray-400' />
          <Input
            placeholder='Search by name or phone number'
            value={(table.getColumn('contact_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('contact_name')?.setFilterValue(event.target.value)}
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
        <Button
          variant={'default'}
          className='bg-primary-base hover:bg-primary-700 rounded-[10px] py-3 px-4 border-white cursor-pointer'
          asChild
        >
          <div className='inline-flex gap-1.5'>
            <Plus size={10.5} strokeWidth={1.5} color='#ffffff' />
            <span className='font-semibold text-sm leading-[155%] text-white'>Create Contact</span>
          </div>
        </Button>
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
