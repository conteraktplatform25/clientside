'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetDesktopContacts } from '@/lib/hooks/business/contact.hook';
import { FileUp, MessageCircle, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ContactFilterDialog } from './custom/ContactFilterDialog';
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { CreateContactDrawer } from './custom/CreateContactDialog';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import { useContactStore } from '@/lib/store/business/contact.store';
import { IContactTableHeaderProps } from '@/lib/schemas/business/client/contact.schema';
import { EmptyTable } from '@/components/custom/Emptyable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { BsTag, BsTags } from 'react-icons/bs';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';
//import { ContactFilterState } from './_component/ContactFilters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AddTagDialog from './_component/tags/AddTagDialog';
import { StartConversationSchema } from '@/lib/schemas/business/server/inbox.schema';
import { useStartConversation } from '@/lib/hooks/business/inbox-conversation.hook';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/navigation';

const DEBOUNCE_MS = 400;

const ContactManagementPage: React.FC = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(''); // immediate controlled input
  const [serverFilter, setServerFilter] = useState(''); // debounced value used for server fetch
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(0);
  const [isCreateContactDialogOpen, setIsCreateContactDialogOpen] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [pageInput, setPageInput] = useState('1');

  /** Add Tag Implementation code is activated here */
  const [isAddTagDialogOpen, setIsAddTagDialogOpen] = useState(false);
  const [selectedContactIdForTags, setSelectedContactIdForTags] = useState<string | null>(null);

  // debouncer ref
  const debounceRef = useRef<number | null>(null);

  // Fetch contacts from server (serverFilter is debounced)
  const { data, isLoading, isError } = useGetDesktopContacts(serverFilter, page, limit);
  const startConversationMutation = useStartConversation();

  // store
  const { addedContacts, setAllContacts } = useContactStore();
  console.log(openDrawer);

  useEffect(() => {
    setLimit(10);
  }, [setLimit]);

  // when new data arrives from server, update the store once
  useEffect(() => {
    if (data?.contacts) {
      setAllContacts(data.contacts);
    }
  }, [data?.contacts, setAllContacts]);

  // Ensure current page is within bounds if server reports fewer pages
  useEffect(() => {
    if (!data) return;
    const totalPages = data.pagination.totalPages ?? 1;
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [data, page]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setServerFilter(searchTerm.trim());
      setPage(1); // when search changes, reset to first page
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  // Build table data from store (memoized)
  const tableData: IContactTableHeaderProps[] = useMemo(() => {
    return (
      (addedContacts ?? []).map((contact) => ({
        id: contact.id,
        contact_name: contact.name ?? 'UN-NAMED',
        phone_number: contact.phone_number,
        total_spent: `₦${contact.totalAmountSpent.toLocaleString()}`,
        last_orderId: contact.lastOrderNumber ?? 'NA',
        tags: contact.lastTag || 'NA',
        tag_number: contact.totalTags > 0 ? `+${contact.totalTags}` : 'NA',
        tag_color: contact.tagColor ?? '#0d142f',
        created_on: contact.dateCreated,
      })) ?? []
    );
  }, [addedContacts]);

  // Columns: stable (no data dependencies). Keep renderers pure and light.
  const columns = useMemo<ColumnDef<IContactTableHeaderProps>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
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
          return tags === 'NA' ? (
            <div className='w-fit p-2 rounded border text-xs text-gray-700-base font-semibold bg-gray-200'>
              {tag_number}
            </div>
          ) : (
            <div className='flex items-center gap-1 text-sm'>
              <BsTag style={{ color: tag_color }} />
              <span style={{ color: tag_color }}>{tags}</span>
              <div className='p-1 rounded border text-xs border-primary-base text-primary-base bg-[#EFF6FF]'>
                {tag_number}
              </div>
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
          const handleStartConversation = async (contactId: string) => {
            try {
              const payload = StartConversationSchema.parse({ contactId });

              const conversation = await startConversationMutation.mutateAsync(payload);
              if (!conversation) {
                toast.error('Could not start conversation.');
                return;
              }

              // Extract useful data
              const conversationId = conversation.id;
              const name = conversation.contact?.name;
              const phoneNumber = conversation.contact?.phone_number;
              const channel = conversation.channel;
              const assignee = conversation.assignee
                ? `${conversation.assignee.first_name} ${conversation.assignee.last_name}`
                : undefined;
              const chatStatus = conversation.status;

              const filterObj = {
                chatStatus,
                channel,
                assignee,
              };
              const encodedFilter = encodeURIComponent(JSON.stringify(filterObj));

              // Redirect to Inbox with the newly started conversation
              // Assuming your inbox URL can accept a conversationId query param
              const url = `/inbox?phone=${phoneNumber}&name=${name}&identity=${conversationId}&contact=${contactId}&filter=${encodedFilter}`;
              router.push(url);
            } catch (err) {
              toast.error(getErrorMessage(err));
            }
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
                <DropdownMenuItem
                  className='w-full cursor-pointer'
                  onClick={() => handleOpenAddTags(contact.id)}
                  asChild
                >
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
                <DropdownMenuItem onClick={() => handleStartConversation(contact.id)}>
                  <div className='inline-flex items-center space-x-1.5'>
                    {startConversationMutation.isPending ? (
                      <div className='w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin' />
                    ) : (
                      <MessageCircle className='w-[16px] h-[16px]' />
                    )}
                    <span className='text-sm leading-[155%]'>Send message</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [startConversationMutation, router]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handlers (stable)
  const openCreateDrawer = useCallback(() => setIsCreateContactDialogOpen(true), []);
  const closeCreateDrawer = useCallback(() => setIsCreateContactDialogOpen(false), []);
  const handleApplyFilters = useCallback((filters: unknown) => {
    // forward to your server-side filter logic as needed
    console.log('Applied filters:', filters);
  }, []);

  const handleOpenAddTags = (contactId: string) => {
    setSelectedContactIdForTags(contactId);
    setIsAddTagDialogOpen(true);
  };

  return (
    <div className='w-full px-4 flex flex-col gap-2'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-xl text-neutral-800'>Contact Profile</h3>
        <div className='flex items-center gap-4 py-4'>
          <div className='relative'>
            <Search className='absolute left-2 top-2 w-4 h-4 text-gray-400' />
            <Input
              placeholder='Search by name or phone'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-[400px] pl-8 pr-2 py-2 w-full rounded-md border text-sm'
            />
          </div>
          <Button variant='default' className='bg-white border hover:bg-gray-100 rounded-md'>
            <FileUp size={12} color='#1A73E8' />
            <span className='ml-2 text-sm text-neutral-800'>Export</span>
          </Button>
          <ContactFilterDialog onApplyFilters={handleApplyFilters} />
          <Button
            variant={'default'}
            className='bg-primary-base hover:bg-primary-700 text-white rounded-[10px] px-4 py-3 cursor-pointer'
            onClick={openCreateDrawer}
            asChild
          >
            <div className='inline-flex space-x-1'>
              <FaPlus />
              <span>Create Contact</span>
            </div>
          </Button>
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

            {/* --------------------------------------- */}
            {/* ADVANCED PAGINATION UI                  */}
            {/* --------------------------------------- */}
            <div className='flex items-center justify-between py-4 px-3 border-t'>
              {/* Left: Page size selector */}
              <div className='flex items-center gap-2'>
                <span className='text-sm'>Rows per page:</span>
                <select
                  className='border rounded p-1'
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                >
                  {[5, 10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              {/* Center: Jump to page */}
              <div className='flex items-center gap-2'>
                <span className='text-sm'>
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <Input
                  className='w-10 max-w-20'
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const page = Number(pageInput) - 1;
                      if (!isNaN(page)) table.setPageIndex(page);
                    }
                  }}
                />
              </div>
              {/* Right: Prev / Next */}
              <div className='flex items-center gap-2'>
                <Button variant='outline' disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                  Previous
                </Button>

                <Button variant='outline' disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <CreateContactDrawer open={isCreateContactDialogOpen} onClose={closeCreateDrawer} />
      <AddTagDialog
        open={isAddTagDialogOpen}
        onOpenChange={setIsAddTagDialogOpen}
        contactId={selectedContactIdForTags}
      />
    </div>
  );
};

export default ContactManagementPage;
