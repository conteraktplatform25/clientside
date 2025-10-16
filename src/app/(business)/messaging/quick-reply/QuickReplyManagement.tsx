'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { IQuickReplyTableProps } from '@/type/client/business/quickreply.type';
import QuickReplyTable from './_component/table/QuickReplyTable';
import { ConstQuickReplyProfile as quickReplies } from '@/lib/constants/quick-reply.constant';
import AddReplyDialog from './AddReplyDialog';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa6';
import PaginationControls from '@/components/custom/PaginationControls';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';

const QuickReplyManagement = () => {
  const { setTitle } = usePageTitleStore();
  const [replies] = useState<IQuickReplyTableProps[]>(quickReplies);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for Order Details Dialog
  const [isAddReplyDialogOpen, setIsAddReplyDialogOpen] = useState(false);

  useEffect(() => {
    setTitle('Automated Messaging');
  }, [setTitle]);

  const totalPages = Math.ceil(replies.length / rowsPerPage);
  const filteredReplies = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return replies.slice(startIndex, endIndex);
  }, [replies, currentPage, rowsPerPage]);

  const handleAddReplyDialog = () => {
    //setReplies()
    setIsAddReplyDialogOpen(true);
  };
  const handleCloseAddReplyDialog = () => {
    setIsAddReplyDialogOpen(false);
  };

  const handleViewDetails = (reply: IQuickReplyTableProps) => {
    console.log(reply);
  };

  const handleDeleteDetails = (reply: IQuickReplyTableProps) => {
    console.log(reply);
  };

  // const handleCloseDetailsDialog = () => {
  //   setIsAddReplyDialogOpen(false);
  // };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handleAddReplyProfile = (title: string, message: string) => {
    console.log(title);
    console.log(message);
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-start justify-between gap-2 mb-6'>
        <h1 className='text-xl leading-[150%] text-neutral-700 font-semibold'>Quick Reply</h1>
        <div className='flex flex-col md:flex-row justify-end gap-8'>
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

      {/* Orders Table */}
      <QuickReplyTable
        data={filteredReplies}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onViewDetails={handleViewDetails}
        onDeleteReply={handleDeleteDetails}
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Add Reply Dialog */}
      <AddReplyDialog
        isOpen={isAddReplyDialogOpen}
        onClose={handleCloseAddReplyDialog}
        onAddReply={handleAddReplyProfile}
      />
    </div>
  );
};

export default QuickReplyManagement;
