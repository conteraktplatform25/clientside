'use client';

import React, { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TQuickReplyResponse } from '@/lib/hooks/business/quick-reply.hook';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, LucidePencil, MoreHorizontal } from 'lucide-react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { formatDateField } from '@/lib/helpers/date-manipulator.helper';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import { EmptyTable } from '@/components/custom/Emptyable';
import { formatVariables, highlightText, stripHtml } from '@/lib/helpers/string-manipulator.helper';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ReplyPreviewModal } from '../ReplyPreviewModal';

interface IQuickReplyTableProps {
  data: TQuickReplyResponse[];
  currentPage: number;
  rowsPerPage: number;
  loading?: boolean;
  searchTerm?: string;
  onViewDetails: (reply: TQuickReplyResponse) => void;
  onDeleteReply: (reply: TQuickReplyResponse) => void;
  onCategoryFilter?: (category: string) => void;
}

const QuickReplyTestTable: React.FC<IQuickReplyTableProps> = ({
  data,
  loading = false,
  searchTerm = '',
  onViewDetails,
  onDeleteReply,
  onCategoryFilter,
}) => {
  const [preview, setPreview] = useState<{ open: boolean; reply: TQuickReplyResponse | null }>({
    open: false,
    reply: null,
  });

  const openPreview = (reply: TQuickReplyResponse) => setPreview({ open: true, reply });

  const columns: ColumnDef<TQuickReplyResponse>[] = [
    {
      accessorKey: 'title',
      header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Title</div>,
      cell: ({ row }) => <div className='font-medium text-[14px]'>{row.original.title}</div>,
    },

    // ---------------------------------------------
    // 📌 QUICK REPLY COLUMN WITH IMPROVED UX
    // ---------------------------------------------
    {
      accessorKey: 'content',
      header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Quick Reply</div>,
      cell: ({ row }) => {
        const raw = row.original.content;
        const stripped = stripHtml(raw);
        //const previewText = cleanText.slice(0, 180);
        const highlighted = highlightText(stripped, searchTerm);
        const withVariables = formatVariables(highlighted);

        return (
          // <div className='w-[280px]'>
          <div className='flex items-start gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className='max-w-[280px] line-clamp-2 text-sm leading-snug cursor-pointer'
                  onClick={() => openPreview(row.original)}
                  dangerouslySetInnerHTML={{ __html: withVariables }}
                />
              </TooltipTrigger>

              <TooltipContent className='max-w-xs'>
                <p>View full reply</p>
              </TooltipContent>
            </Tooltip>

            {/* Copy button */}
            <Button variant='ghost' size='icon' onClick={() => navigator.clipboard.writeText(stripped)}>
              <Copy size={16} />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) return <span className='text-gray-500 text-xs'>—</span>;

        return (
          <span
            className='px-2 py-1 bg-blue-50 text-blue-700 rounded cursor-pointer text-xs'
            onClick={() => onCategoryFilter?.(category)}
          >
            {category}
          </span>
        );
      },
    },

    {
      accessorKey: 'createdById',
      header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Created By</div>,
      cell: ({ row }) => <div className='font-medium text-[14px]'>{row.original.createdById ?? 'ADMIN'}</div>,
    },

    {
      accessorKey: 'created_at',
      header: () => <div className='font-semibold text-sm leading-[155%] text-left'>Created On</div>,
      cell: ({ row }) => <div className='font-medium text-[14px]'>{formatDateField(row.getValue('created_at'))}</div>,
    },

    // Actions
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-6 w-6' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='flex flex-col gap-2 w-full'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <div className='inline-flex space-x-3 cursor-pointer' onClick={() => onViewDetails(row.original)}>
                <LucidePencil className='mt-0.5' color='#1A73E8' />
                <span className='text-sm'>Edit</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <div className='inline-flex space-x-3 cursor-pointer' onClick={() => onDeleteReply(row.original)}>
                <FaRegTrashAlt className='mt-0.5' color='#b33605' />
                <span className='text-sm'>Delete</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='rounded-md border'>
      {/* LOADING */}
      {loading ? (
        <UILoaderIndicator label='Fetching your quick reply list...' />
      ) : data.length === 0 ? (
        <EmptyTable
          title='No quick reply found'
          description='Create your first quick reply to get started.'
          actionText='Create Quick Reply'
        />
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
      )}

      {/* PREVIEW MODAL */}
      {/* Preview modal */}
      {preview.reply && (
        <ReplyPreviewModal
          open={preview.open}
          onClose={() => setPreview({ open: false, reply: null })}
          title={preview.reply.title}
          content={stripHtml(preview.reply.content)}
        />
      )}
    </div>
  );
};

export default QuickReplyTestTable;
