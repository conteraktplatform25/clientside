'use client';
import { Button } from '@/components/ui/button';
import {
  TQuickReplyQuery,
  TQuickReplyResponse,
  useCreateQuickReply,
  useGetQuickReplies,
} from '@/lib/hooks/business/quick-reply.hook';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import PaginationControls from '@/components/custom/PaginationControls';
import QuickReplyTestTable from './_component/table/QuickReplyTestTable';
import AddReplyTestDialog, { IVariable } from './AddReplyTestDialog';
import { FaSearch } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { QuickReplyCategory } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EditQuickReplyDialog from './_component/EditQuickReplyDialog';

const QuickReplyManagementTest = () => {
  const { setTitle } = usePageTitleStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [quickReplyId, setQuickReplyId] = useState<string | null>(null);
  const [isAddReplyDialogOpen, setIsAddReplyDialogOpen] = useState(false);
  const [replyCategory, setReplyCategory] = useState<QuickReplyCategory[]>([]);
  //const [selectedQuickReplyDetails, setSelectedQuickReplyDetails] = useState<TQuickReplyResponse | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [activeCategory, setActiveCategory] = useState<QuickReplyCategory | null>(null);

  useEffect(() => {
    setTitle('Automated Messaging - Quick Reply');
    setReplyCategory(Object.values(QuickReplyCategory) as QuickReplyCategory[]);
  }, [setTitle, setReplyCategory]);

  const requestBody: TQuickReplyQuery = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    category: activeCategory || undefined,
    sortBy: 'created_at',
    sortOrder: 'desc',
  };
  const { data, isLoading } = useGetQuickReplies(requestBody);
  const replies = data?.replies ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  // const handleViewDetails = (reply: TQuickReplyResponse) => {
  //   setSelectedQuickReplyDetails(reply);
  //   setIsDetailsDialogOpen(true);
  // };

  // const handleAddReplyDialog = () => {
  //   //setReplies()
  //   setIsAddReplyDialogOpen(true);
  // };
  /* -------- Create reply mutation -------- */
  const createReply = useCreateQuickReply();

  const handleAddReplyDialog = () => setIsAddReplyDialogOpen(true);
  const handleCloseAddReplyDialog = () => setIsAddReplyDialogOpen(false);

  /* -------- Add reply handler -------- */
  const handleAddReplyProfile = (data: {
    title: string;
    content: string;
    category?: QuickReplyCategory;
    is_global: boolean;
    variables: IVariable[];
  }) => {
    createReply.mutate(data, {
      onSuccess: () => {
        setIsAddReplyDialogOpen(false);
      },
    });
  };

  /* -------- Table actions -------- */
  const handleViewDetails = (reply: TQuickReplyResponse) => {
    setQuickReplyId(reply.id);
    setIsDetailsDialogOpen(true);
  };
  const handleDeleteDetails = (reply: TQuickReplyResponse) => console.log(reply);
  return (
    <div className='w-full p-4'>
      <div className='flex items-start justify-between gap-2 mb-6'>
        <h1 className='text-xl leading-[150%] text-neutral-700 font-semibold'>Quick Reply</h1>
        <div className='flex flex-col md:flex-row justify-end gap-8'>
          {/* ------------------------------- Search Bar ------------------------------- */}
          <div className='relative w-full max-w-md'>
            <FaSearch className='absolute left-3 top-3 text-neutral-400' />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search replies...'
              className='pl-10 rounded-lg border-neutral-300 focus-visible:ring-primary-base'
            />
          </div>
          {/* ------------------------------ Category Pills ----------------------------- */}
          <div className='flex items-center gap-4'>
            {/* Category Filter */}
            <div className='w-48'>
              <Select
                value={activeCategory ?? 'ALL'} // Use 'ALL' for no filter
                onValueChange={(val) => setActiveCategory(val === 'ALL' ? null : (val as QuickReplyCategory))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Filter by category' />
                </SelectTrigger>
                <SelectContent>
                  {/* All categories option */}
                  <SelectItem value='ALL'>All Categories</SelectItem>

                  {/* Individual categories */}
                  {replyCategory.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant={'default'}
            className='bg-primary-base hover:bg-primary-700 text-white rounded-[10px] px-4 py-3 cursor-pointer'
            onClick={handleAddReplyDialog}
            asChild
          >
            <div className='inline-flex space-x-1'>
              <FaPlus />
              <span>Add reply</span>
            </div>
          </Button>
        </div>
      </div>
      {/* Quick Reply Table */}
      <QuickReplyTestTable
        data={replies}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        loading={isLoading}
        onViewDetails={handleViewDetails}
        onDeleteReply={handleDeleteDetails}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <AddReplyTestDialog
        isOpen={isAddReplyDialogOpen}
        onClose={handleCloseAddReplyDialog}
        onAddReply={handleAddReplyProfile}
        isLoading={createReply.isPending}
      />

      <EditQuickReplyDialog
        open={isDetailsDialogOpen}
        quickReplyId={quickReplyId}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setQuickReplyId(null);
        }}
      />
    </div>
  );
};

export default QuickReplyManagementTest;
