import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className='flex items-center justify-between px-2 py-4'>
      <div className='flex items-center space-x-2'>
        <span className='text-sm font-medium'>Show:</span>
        <Select value={String(rowsPerPage)} onValueChange={(value) => onRowsPerPageChange(Number(value))}>
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={rowsPerPage} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[5, 10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            className='h-8 w-8 p-0'
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
