import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
//import ConfirmationDialog from '@/components/special-ui/ConfirmationDialog';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
//import { format } from 'date-fns';

// Define a generic interface for the data structure
interface IContactTableHeaderProps {
  id?: string | number;
  contact_name?: string;
  phone_number?: string;
  total_spent?: Date | null;
  last_orderId?: boolean;
  tags?: string;
  created_on?: Date | null;
}

export const TableColumn: ColumnDef<IContactTableHeaderProps>[] = [
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
    header: () => <div className='text-center'>Contact Name</div>,
  },
  {
    accessorKey: 'phone_number',
    header: () => <div className='text-center'>Phone Number</div>,
  },
  {
    accessorKey: 'total_spent',
    header: () => <div className='text-center'>Total Spent</div>,
  },
  {
    accessorKey: 'last_orderId',
    header: () => <div className='text-center'>Last Order ID</div>,
  },
  {
    accessorKey: 'tags',
    header: () => <div className='text-center'>Tags</div>,
  },
  {
    accessorKey: 'created_on',
    header: () => <div className='text-center'>Created On</div>,
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Actions</div>,
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
];
